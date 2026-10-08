/** Set the approved YouTube player on the Home, K9, and About sections. */
import { createClient } from '@sanity/client';

const token = process.env.SANITY_API_TOKEN;
if (!token) throw new Error('Set SANITY_API_TOKEN for this command.');

const client = createClient({
  projectId: 'mrdn8wqq', dataset: 'production', apiVersion: '2025-10-01',
  token, useCdn: false,
});
const videoUrl = 'https://www.youtube.com/embed/PH3786NxmIE';
const targets = [
  { id: 'easy-pm-page-home', type: 'heroSection', title: null },
  { id: 'easy-pm-page-services', type: 'twoColTextImageSection', title: 'K9 Bed Bug Inspections' },
  { id: 'easy-pm-page-about-us', type: 'twoColTextImageSection', title: 'Clear options when you need them' },
];

const docs = await client.fetch('*[_id in $ids]{_id, _rev, sections}', {
  ids: targets.map((target) => target.id),
});
if (docs.length !== targets.length) throw new Error(`Expected ${targets.length} pages; found ${docs.length}.`);

const transaction = client.transaction();
for (const target of targets) {
  const doc = docs.find((item) => item._id === target.id);
  let matched = 0;
  const sections = doc.sections.map((section) => {
    if (section._type !== target.type || (target.title && section.title !== target.title)) return section;
    matched++;
    // The existing photos remain in the Sanity media library, but the section
    // uses the active player and has no competing static image reference.
    const { images, image, sideImage, ...rest } = section;
    return target.type === 'heroSection'
      ? { ...rest, layoutStyle: 'twoColumn', mediaType: 'video', videoUrl }
      : { ...rest, videoUrl };
  });
  if (matched !== 1) throw new Error(`Expected one video section in ${target.id}; found ${matched}.`);
  transaction.patch(doc._id, (patch) => patch.ifRevisionId(doc._rev).set({ sections }));
}
await transaction.commit();

const readback = await client.fetch(`*[_id in $ids]{
  _id,
  "videoSections": sections[videoUrl == $videoUrl]{_type, title, layoutStyle, mediaType, videoUrl, "imageCount": count(images), "sideImageRef": sideImage.asset._ref}
}`, { ids: targets.map((target) => target.id), videoUrl });
if (readback.length !== targets.length || readback.some((doc) => doc.videoSections.length !== 1 || doc.videoSections[0].sideImageRef)) {
  throw new Error(`Video readback incomplete: ${JSON.stringify(readback)}`);
}
const home = readback.find((doc) => doc._id === 'easy-pm-page-home')?.videoSections[0];
if (home?.layoutStyle !== 'twoColumn' || home.mediaType !== 'video') {
  throw new Error(`Home hero layout readback incomplete: ${JSON.stringify(home)}`);
}
console.log(JSON.stringify(readback, null, 2));
