import { PREFERRED_SITE_ORIGIN } from '../lib/canonical';

export const prerender = false;

export function GET() {
  const configuredSite = import.meta.env.SITE_URL ?? import.meta.env.PUBLIC_SITE_URL;
  const hasPublicOrigin = Boolean(configuredSite && !/example\.com|localhost|127\.0\.0\.1/i.test(configuredSite));
  const canIndex = hasPublicOrigin && import.meta.env.EASYPM_ALLOW_INDEXING === 'true';
  const body = canIndex
    ? `User-agent: *\nAllow: /\n\nSitemap: ${PREFERRED_SITE_ORIGIN}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n';

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
