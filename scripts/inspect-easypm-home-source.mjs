/** Read-only check for which published Home document the route can resolve. */
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'mrdn8wqq', dataset: 'production', apiVersion: '2025-10-01',
  token: process.env.SANITY_API_TOKEN, useCdn: false, perspective: 'published',
});
const pages = await client.fetch(`*[_type == "page" && lower(slug.current) in $slugs]{
  _id,
  "slug": slug.current,
  pageType,
  "hero": sections[_type == "heroSection"][0]{visualVariant, layoutStyle, videoUrl, "sideImageRef": sideImage.asset._ref}
}`, { slugs: ['home', '/home', 'home/', '/home/'] });
console.log(JSON.stringify(pages, null, 2));
