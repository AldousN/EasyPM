/** Remove the five duplicate closing CTA sections and configure one shared dual-action footer. */
import { createClient } from '@sanity/client';

const token = process.env.SANITY_API_TOKEN;
if (!token) throw new Error('Set SANITY_API_TOKEN for this command.');

const client = createClient({
  projectId: 'mrdn8wqq', dataset: 'production', apiVersion: '2025-10-01',
  token, useCdn: false,
});
const slugs = ['home', 'services', 'service-area', 'about-us', 'blog', 'contact'];
const docs = await client.fetch('*[_id in $ids]{_id, _rev, sections}', {
  ids: slugs.map((slug) => `easy-pm-page-${slug}`),
});
if (docs.length !== slugs.length) throw new Error(`Expected six pages; found ${docs.length}.`);

const transaction = client.transaction();
for (const slug of slugs) {
  const doc = docs.find((item) => item._id === `easy-pm-page-${slug}`);
  const ctaIndices = doc.sections.flatMap((section, index) => section._type === 'ctaSection' ? [index] : []);
  const isClosingCta = ctaIndices.length === 1 && ctaIndices[0] === doc.sections.length - 1;
  if ((slug === 'contact' && ctaIndices.length > 0) ||
      (slug !== 'contact' && ctaIndices.length > 0 && !isClosingCta)) {
    throw new Error(`Unexpected CTA placement on ${slug}: ${JSON.stringify(ctaIndices)}.`);
  }
  if (isClosingCta) {
    transaction.patch(doc._id, (patch) => patch.ifRevisionId(doc._rev).set({
      sections: doc.sections.slice(0, -1),
    }));
  }
}
transaction.patch('global-settings', (patch) => patch.set({
  footerCtaButtonLabel: 'Call 267-440-7306 →',
  footerCtaButtonLink: 'tel:+12674407306',
  footerCtaSecondaryButtonLabel: 'Contact EasyPM',
  footerCtaSecondaryButtonLink: '/contact/',
}));
await transaction.commit();

const readback = await client.fetch(`{
  "remainingCtaSections": count(*[_id in $ids && count(sections[_type == "ctaSection"]) > 0]),
  "settings": *[_id == "global-settings"][0]{footerCtaButtonLabel, footerCtaButtonLink, footerCtaSecondaryButtonLabel, footerCtaSecondaryButtonLink, "bannerUrl": footerBannerImage.asset->url}
}`, { ids: slugs.map((slug) => `easy-pm-page-${slug}`) });
if (readback.remainingCtaSections !== 0 ||
    readback.settings?.footerCtaButtonLabel !== 'Call 267-440-7306 →' ||
    readback.settings?.footerCtaButtonLink !== 'tel:+12674407306' ||
    readback.settings?.footerCtaSecondaryButtonLabel !== 'Contact EasyPM' ||
    readback.settings?.footerCtaSecondaryButtonLink !== '/contact/' ||
    !readback.settings?.bannerUrl) {
  throw new Error(`CMS readback incomplete: ${JSON.stringify(readback)}`);
}
console.log(JSON.stringify(readback, null, 2));
