// Cockroach and termite pages are available in the local draft for review.
// Public deployments keep them unpublished until the service scope is approved.
const pendingServiceSlugs = new Set([
  'services/cockroach-control',
  'services/termite-control',
]);

export const pendingServicesEnabled =
  (import.meta.env.DEV && import.meta.env.PUBLIC_EASYPM_LOCAL_PREVIEW === 'true') ||
  import.meta.env.EASYPM_INCLUDE_PENDING_SERVICES === 'true';

export const isPendingServiceSlug = (slug: string) =>
  pendingServiceSlugs.has(slug.trim().replace(/^\/+|\/+$/g, ''));

export const isPendingServiceHref = (href: string) => {
  try {
    return isPendingServiceSlug(new URL(href, 'https://easypm.invalid').pathname);
  } catch {
    return false;
  }
};
