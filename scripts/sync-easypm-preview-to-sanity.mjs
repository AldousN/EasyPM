/** Sync reviewed EasyPM local preview pages and their local media to Sanity. */
import { createReadStream, existsSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { build } from 'esbuild';
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

const projectRoot = resolve(import.meta.dirname, '..');
dotenv.config({ path: resolve(projectRoot, '.env.local'), quiet: true });
const dryRun = process.argv.includes('--dry-run');
const settingsOnly = process.argv.includes('--settings-only');
const slugs = [
  'home', 'services', 'services/bed-bug-control',
  'services/cockroach-control', 'services/termite-control',
  'service-area', 'about-us', 'blog', 'contact',
];

const built = await build({
  entryPoints: [resolve(projectRoot, 'src/data/easyPmLocalPreview.ts')],
  bundle: true, platform: 'node', format: 'esm', write: false,
  outfile: 'easy-pm-preview.mjs',
});
const source = built.outputFiles[0].text;
const { getEasyPmLocalPreviewPage, easyPmLocalPreviewSettings } = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
);

const token = process.env.SANITY_API_TOKEN;
if (!dryRun && !token) {
  throw new Error('Set SANITY_API_TOKEN in .env.local before writing to Sanity.');
}
const projectId = process.env.SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.PUBLIC_SANITY_DATASET;
if (!dryRun && (!projectId || !dataset)) {
  throw new Error('Set the Sanity project ID and dataset in .env.local.');
}
const client = dryRun ? null : createClient({
  projectId, dataset, token, apiVersion: '2025-01-01', useCdn: false,
});
const uploaded = new Map();

function keyFor(path) {
  return createHash('sha1').update(path).digest('hex').slice(0, 12);
}

function arrayMemberType(parentType, field) {
  if (field === 'items' && parentType === 'serviceGridSection') return 'serviceItem';
  if (field === 'items' && parentType === 'iconGridSection') return 'iconItem';
  if (field === 'steps' && parentType === 'processSection') return 'processStep';
  if (field === 'steps' && parentType === 'stepsSection') return 'step';
  if (field === 'fields') return 'formField';
  if (field === 'options') return 'option';
  if (field === 'faqs') return 'faqItem';
  return undefined;
}

async function convert(value, path = '', parentType = '') {
  if (Array.isArray(value)) {
    const field = path.split('.').at(-1)?.replace(/\[\d+\]$/, '') || '';
    return Promise.all(value.map(async (item, index) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return item;
      const itemType = item._type || arrayMemberType(parentType, field);
      const withIdentity = {
        ...item,
        ...(itemType ? { _type: itemType } : {}),
        _key: item._key || keyFor(`${path}[${index}]`),
      };
      return convert(withIdentity, `${path}[${index}]`, itemType || parentType);
    }));
  }
  if (!value || typeof value !== 'object') return value;
  if (typeof value.url === 'string' && value.url.startsWith('/images/')) {
    const file = resolve(projectRoot, 'public', value.url.slice(1));
    if (!existsSync(file)) throw new Error(`Missing local Figma asset: ${file}`);
    if (dryRun) return { _type: 'image', alt: value.alt || basename(file), asset: { _type: 'reference', _ref: `dry-run:${basename(file)}` } };
    if (!uploaded.has(file)) {
      const filename = basename(file);
      const existing = await client.fetch('*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id', { filename });
      if (existing) {
        uploaded.set(file, existing);
      } else {
        const asset = await client.assets.upload('image', createReadStream(file), { filename });
        uploaded.set(file, asset._id);
        console.log(`Uploaded ${filename}`);
      }
    }
    return { _type: 'image', alt: value.alt || basename(file), asset: { _type: 'reference', _ref: uploaded.get(file) } };
  }
  const type = value._type || parentType;
  const entries = await Promise.all(Object.entries(value).map(async ([field, entry]) => [field, await convert(entry, path ? `${path}.${field}` : field, type)]));
  return Object.fromEntries(entries);
}

for (const slug of settingsOnly ? [] : slugs) {
  const page = getEasyPmLocalPreviewPage(slug);
  if (!page) throw new Error(`Missing local page: ${slug}`);
  const sections = await convert(page.sections, 'sections', 'page');
  const pageType = slug === 'home' ? 'home'
    : slug.startsWith('services/') ? 'service-detail'
    : slug === 'about-us' ? 'about'
    : slug;
  const id = dryRun ? `easy-pm-${slug.replaceAll('/', '-')}` :
    (await client.fetch('*[_type == "page" && slug.current == $slug][0]._id', { slug })) ||
    `easy-pm-${slug.replaceAll('/', '-')}`;
  const document = {
    _id: id, _type: 'page', title: page.title,
    slug: { _type: 'slug', current: slug }, pageType,
    seo: { _type: 'object', seoTitle: page.title.slice(0, 60), seoDescription: page.description?.slice(0, 160) },
    sections,
  };
  if (!dryRun) {
    await client.createOrReplace(document);
  }
  console.log(`${dryRun ? 'Prepared' : 'Synced'} ${slug}: ${sections.length} sections`);
}

const navigationItems = await convert(easyPmLocalPreviewSettings.navigationItems.map((item) => item.href === '/services/' ? {
  ...item,
  children: [
    { label: 'Bed Bug Control', href: '/services/bed-bug-control/' },
    { label: 'Cockroach Control', href: '/services/cockroach-control/' },
    { label: 'Termite Control', href: '/services/termite-control/' },
  ],
} : item), 'navigationItems', 'globalSettings');
if (!dryRun) {
  await client.patch('global-settings').set({
    navigationItems,
    headerCtaLabel: easyPmLocalPreviewSettings.headerCtaLabel,
    headerCtaLink: easyPmLocalPreviewSettings.headerCtaLink,
    footerCtaHeading: easyPmLocalPreviewSettings.footerCtaHeading,
    footerCtaButtonLabel: easyPmLocalPreviewSettings.footerCtaButtonLabel,
    footerCtaButtonLink: easyPmLocalPreviewSettings.footerCtaButtonLink,
    footerLinks: await convert(easyPmLocalPreviewSettings.footerLinks, 'footerLinks', 'globalSettings'),
  }).unset(['footerCtaText', 'footerCtaSecondaryButtonLabel', 'footerCtaSecondaryButtonLink']).commit();
  if (!settingsOnly) {
    const readback = await client.fetch('*[_type == "page" && slug.current in $slugs]{"slug":slug.current,"sections":count(sections)}', { slugs });
    console.log(`Sanity readback: ${readback.length}/${slugs.length} pages`);
    if (readback.length !== slugs.length) process.exitCode = 1;
  }
  const settingsReadback = await client.fetch('*[_id == "global-settings"][0]{headerCtaLabel,footerCtaHeading,footerCtaButtonLabel,"navigation":navigationItems[].label}');
  console.log(`Settings readback: ${JSON.stringify(settingsReadback)}`);
}
console.log(`${dryRun ? 'Prepared' : 'Synced'} navigation: ${navigationItems.length} top-level links`);
