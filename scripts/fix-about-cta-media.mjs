/** Apply the Figma About photo and shared footer banner media to existing EasyPM documents. */
import { createReadStream } from 'node:fs';
import { resolve } from 'node:path';
import { createClient } from '@sanity/client';

const token = process.env.SANITY_API_TOKEN;
if (!token) throw new Error('Set SANITY_API_TOKEN for this command.');

const client = createClient({
  projectId: 'mrdn8wqq', dataset: 'production', apiVersion: '2025-10-01',
  token, useCdn: false,
});

async function media(filename) {
  const existing = await client.fetch(
    '*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id',
    { filename },
  );
  if (existing) return existing;
  const uploaded = await client.assets.upload(
    'image', createReadStream(resolve('public/images', filename)),
    { filename, title: filename.replace(/[-.]/g, ' ') },
  );
  return uploaded._id;
}

const [aboutId, gradientId, dogBannerId] = await Promise.all([
  media('easypm-about-service-van-figma.webp'),
  media('easypm-cta-gradient-clean-figma.webp'),
  media('easypm-k9-banner-figma.webp'),
]);
const image = (id, alt) => ({
  _type: 'image', asset: { _type: 'reference', _ref: id }, alt,
});
const aboutImage = image(aboutId, 'White pickup truck and equipment trailer in the About EasyPM Figma design');
const gradientImage = image(gradientId, 'Purple gradient from the EasyPM Figma call-to-action banner');
const dogBannerImage = image(dogBannerId, 'K9 banner photo from the EasyPM Figma design');

const slugs = ['home', 'services', 'service-area', 'about-us', 'blog', 'contact'];
const docs = await client.fetch('*[_id in $ids]{_id, _rev, sections}', {
  ids: slugs.map((slug) => `easy-pm-page-${slug}`),
});
if (docs.length !== slugs.length) throw new Error(`Expected ${slugs.length} pages; found ${docs.length}.`);

const transaction = client.transaction();
for (const doc of docs) {
  let aboutCount = 0;
  const sections = doc.sections.map((section) => {
    if (doc._id === 'easy-pm-page-about-us' && section._type === 'twoColTextImageSection' && section.title === 'Clear options when you need them') {
      aboutCount++;
      return { ...section, images: [{ _key: 'aboutServiceVan', ...aboutImage }], image: undefined, videoUrl: undefined };
    }
    return section;
  });
  if (doc._id === 'easy-pm-page-about-us' && aboutCount !== 1) throw new Error(`Expected one About media section; found ${aboutCount}.`);
  transaction.patch(doc._id, (patch) => patch.ifRevisionId(doc._rev).set({ sections }));
}
transaction.patch('global-settings', (patch) => patch.set({
  footerBannerImage: dogBannerImage,
  footerGradientImage: gradientImage,
}));
await transaction.commit();

const readback = await client.fetch(`{
  "about": *[_id == "easy-pm-page-about-us"][0].sections[_type == "twoColTextImageSection" && title == "Clear options when you need them"][0].images[0]{alt, "url": asset->url},
  "footerBanner": *[_id == "global-settings"][0].footerBannerImage{alt, "url": asset->url},
  "footerGradient": *[_id == "global-settings"][0].footerGradientImage{alt, "url": asset->url}
}`, { ids: slugs.map((slug) => `easy-pm-page-${slug}`) });
if (!readback.about?.url || !readback.footerBanner?.url || !readback.footerGradient?.url) {
  throw new Error(`CMS readback incomplete: ${JSON.stringify(readback)}`);
}
console.log(JSON.stringify({ aboutPhoto: readback.about.url, footerBanner: readback.footerBanner.url, footerGradient: readback.footerGradient.url }, null, 2));
