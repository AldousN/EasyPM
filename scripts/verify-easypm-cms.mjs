/** Read-only verification of the six EasyPM trial pages and shared footer. */
import { createClient } from '@sanity/client';

const token = process.env.SANITY_API_TOKEN;
if (!token) throw new Error('Set SANITY_API_TOKEN for this command.');

const client = createClient({
  projectId: 'mrdn8wqq', dataset: 'production', apiVersion: '2025-10-01',
  token, useCdn: false,
});
const slugs = ['home', 'services', 'service-area', 'about-us', 'blog', 'contact'];
const data = await client.fetch(`{
  "pages": *[_id in $ids]{
    _id,
    "heroBannerUrl": sections[_type == "heroSection"][0].backgroundImage.asset->url,
    "heroLayout": sections[_type == "heroSection"][0].layoutStyle,
    "heroMediaType": sections[_type == "heroSection"][0].mediaType,
    "closingCtaCount": count(sections[_type == "ctaSection"]),
    "videoSections": sections[defined(videoUrl)]{title, videoUrl},
    "blogEmptyState": sections[_type == "blogListSection"][0].emptyStateText,
    "content": sections
  },
  "settings": *[_id == "global-settings"][0]{
    footerCtaButtonLabel, footerCtaButtonLink,
    footerCtaSecondaryButtonLabel, footerCtaSecondaryButtonLink,
    "footerBannerUrl": footerBannerImage.asset->url,
    "footerGradientUrl": footerGradientImage.asset->url
  }
}`, { ids: slugs.map((slug) => `easy-pm-page-${slug}`) });

if (data.pages.length !== 6) throw new Error(`Expected six pages; found ${data.pages.length}.`);
const expectedVideoPages = new Set(['home', 'services', 'about-us']);
const expectedVideoUrl = 'https://www.youtube.com/embed/PH3786NxmIE';
for (const slug of slugs) {
  const page = data.pages.find((entry) => entry._id === `easy-pm-page-${slug}`);
  if (!page?.heroBannerUrl) throw new Error(`Missing Figma hero banner on ${slug}.`);
  if (slug === 'home' && (page.heroLayout !== 'twoColumn' || page.heroMediaType !== 'video')) {
    throw new Error('Home hero is not configured for a two-column video layout.');
  }
  if (page.closingCtaCount !== 0) throw new Error(`Duplicate CTA section on ${slug}.`);
  const videoCount = page.videoSections?.length ?? 0;
  if (videoCount !== (expectedVideoPages.has(slug) ? 1 : 0)) {
    throw new Error(`Unexpected video section count on ${slug}: ${videoCount}.`);
  }
  if (expectedVideoPages.has(slug) && page.videoSections[0].videoUrl !== expectedVideoUrl) {
    throw new Error(`Unexpected video URL on ${slug}.`);
  }
  if (/\b(?:cockroach|termite|Oklahoma|Exton)\b|\b4\.8\b|under.?1.?hour/i.test(JSON.stringify(page.content))) {
    throw new Error(`Unapproved service, place, or claim found on ${slug}.`);
  }
}
if (!data.pages.find((entry) => entry._id === 'easy-pm-page-blog')?.blogEmptyState?.includes('There are no articles to show yet')) {
  throw new Error('Approved blog empty state is missing.');
}
const settings = data.settings;
if (settings?.footerCtaButtonLabel !== 'Call 267-440-7306 →' ||
    settings?.footerCtaButtonLink !== 'tel:+12674407306' ||
    settings?.footerCtaSecondaryButtonLabel !== 'Contact EasyPM' ||
    settings?.footerCtaSecondaryButtonLink !== '/contact/' ||
    !settings?.footerBannerUrl || !settings?.footerGradientUrl) {
  throw new Error('Shared footer settings are incomplete.');
}

console.log(JSON.stringify({
  pages: slugs.map((slug) => ({
    slug,
    heroBanner: true,
    video: expectedVideoPages.has(slug),
    duplicateCtaSections: 0,
  })),
  footer: 'shared banner image and both CTA links present',
  blog: 'approved empty state present',
}, null, 2));
