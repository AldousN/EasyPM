/**
 * Seed the EasyPM trial dataset from the checked-in local draft and Figma exports.
 * Requires SANITY_API_TOKEN. It never stores the token in this repository.
 * Existing EasyPM documents are replaced with the checked-in draft; unrelated
 * documents are left untouched. Image assets are reused by original filename.
 */
import { readFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { resolve } from 'node:path';
import { createClient } from '@sanity/client';
import { transform } from 'esbuild';

const token = process.env.SANITY_API_TOKEN;
if (!token) throw new Error('Set SANITY_API_TOKEN for this command.');

const client = createClient({
  projectId: 'mrdn8wqq', dataset: 'production', apiVersion: '2025-10-01',
  token, useCdn: false,
});

const assetFiles = {
  background: 'easypm-home-hero.webp',
  video: 'easypm-header-video-figma.webp',
  logo: 'easypm-logo-figma.webp',
  heat: 'easypm-heat-icon-figma.webp',
  aprehend: 'easypm-aprehend-icon-figma.webp',
  k9: 'easypm-k9-icon-figma.webp',
  k9Photo: 'easypm-k9-photo-figma.webp',
  k9Banner: 'easypm-k9-banner-figma.webp',
  contactArtLeft: 'easypm-contact-form-backdrop-left-figma.webp',
  contactArtRight: 'easypm-contact-form-backdrop-right-figma.webp',
  map: 'easypm-map-icon-figma.webp',
  servicesHero: 'easypm-services-hero-figma.webp',
  bedbugService: 'easypm-bedbug-service-figma.webp',
  serviceAreaHero: 'easypm-service-area-hero-figma.webp',
  serviceAreaHomes: 'easypm-service-area-homes-figma.webp',
  aboutHero: 'easypm-about-hero-figma.webp',
  aboutServiceVan: 'easypm-about-service-van-figma.webp',
  ctaGradient: 'easypm-cta-gradient-clean-figma.webp',
  treatmentRoom: 'easypm-treatment-photo-figma-watermarked.webp',
  treatmentOutdoor: 'easypm-section1-treatment-figma-watermarked.webp',
};
const assetIds = {};
for (const [name, filename] of Object.entries(assetFiles)) {
  let id = await client.fetch(
    '*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id',
    { filename },
  );
  if (!id) {
    const asset = await client.assets.upload(
      'image', createReadStream(resolve('public/images', filename)),
      { filename, title: filename.replace(/[-.]/g, ' ') },
    );
    id = asset._id;
  }
  assetIds[name] = id;
  process.stdout.write(`Media ready: ${name}\n`);
}

const source = await readFile(resolve('src/data/easyPmLocalPreview.ts'), 'utf8');
const compiled = await transform(source, { loader: 'ts', format: 'esm' });
const fixture = await import(`data:text/javascript;base64,${Buffer.from(compiled.code).toString('base64')}`);
const imageRef = (id, alt) => ({
  _type: 'image', asset: { _type: 'reference', _ref: id }, alt,
});
const assetByLocalUrl = Object.fromEntries(
  Object.entries(assetFiles).map(([name, filename]) => [`/images/${filename}`, assetIds[name]]),
);
const attachMedia = (value) => {
  if (Array.isArray(value)) return value.map(attachMedia);
  if (value && typeof value === 'object') {
    if (typeof value.url === 'string' && assetByLocalUrl[value.url]) {
      return imageRef(assetByLocalUrl[value.url], value.alt);
    }
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, attachMedia(child)]));
  }
  return value;
};
const keyed = (value, path = 'root') => {
  if (Array.isArray(value)) return value.map((item, index) => {
    const child = keyed(item, `${path}-${index}`);
    return child && typeof child === 'object' && !Array.isArray(child)
      ? { _type: child._type ?? 'object', _key: child._key ?? `k${path.replace(/[^a-z0-9]/gi, '')}${index}`, ...child }
      : child;
  });
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, keyed(child, `${path}-${key}`)]));
  }
  return value;
};

const slugs = ['home', 'services', 'service-area', 'about-us', 'blog', 'contact'];
const pageTypes = { home: 'home', services: 'services', 'service-area': 'service-area', 'about-us': 'about', blog: 'blog', contact: 'contact' };
for (const slug of slugs) {
  const page = fixture.getEasyPmLocalPreviewPage(slug);
  if (!page) throw new Error(`Missing local page: ${slug}`);
  const sections = attachMedia(structuredClone(page.sections));
  await client.createOrReplace({
    _id: `easy-pm-page-${slug}`, _type: 'page', title: page.title,
    slug: { _type: 'slug', current: slug }, pageType: pageTypes[slug],
    seo: { _type: 'object', seoTitle: page.title, seoDescription: page.description },
    sections: keyed(sections),
  });
  process.stdout.write(`Page ready: ${slug}\n`);
}

const settings = fixture.easyPmLocalPreviewSettings;
await client.createOrReplace({
  _id: 'global-settings', _type: 'globalSettings', title: 'EasyPM Trial Settings',
  contact: { _type: 'contactInfo', ...settings.contact },
  brandLogo: attachMedia(settings.brandLogo),
  navigationItems: keyed(settings.navigationItems, 'nav'),
  headerCtaLabel: settings.headerCtaLabel,
  headerCtaLink: settings.headerCtaLink,
  footerDescription: settings.footerDescription,
  footerCtaHeading: settings.footerCtaHeading,
  footerCtaButtonLabel: settings.footerCtaButtonLabel,
  footerCtaButtonLink: settings.footerCtaButtonLink,
  footerCtaSecondaryButtonLabel: settings.footerCtaSecondaryButtonLabel,
  footerCtaSecondaryButtonLink: settings.footerCtaSecondaryButtonLink,
  footerBannerImage: attachMedia(settings.footerBannerImage),
  footerGradientImage: attachMedia(settings.footerGradientImage),
  footerLinks: keyed(settings.footerLinks, 'footer'),
  defaultSeo: { _type: 'seo', seoTitle: 'EasyPM | Bed Bug Help', seoDescription: 'Bed bug inspection and treatment in Philadelphia and surrounding areas.' },
});
process.stdout.write('Global settings ready.\n');
