import { fetchPageBySlug } from './queries/pageBySlug';
import { fetchPageByType } from './queries/pageByType';
import { siteProfile } from '../data/siteProfile';
import { isPendingServiceHref, isPendingServiceSlug, pendingServicesEnabled } from '../data/serviceScope';
import type { Sections } from '../types/sections';

export type PageData = {
  title: string;
  description?: string;
  sections: Sections[];
  canonicalUrl?: string;
};

const normalizeSlug = (value?: string) => {
  if (!value) return '';
  return value.trim().replace(/^\/+/, '').replace(/\/+$/, '');
};

type LoadOptions = {
  pageType?: string;
  slug?: string;
  fallbackSections?: Sections[];
};

const SLUG_FALLBACKS: Record<string, string[]> = {
  'terms-of-service': ['terms-and-conditions', 'terms-of-use']
};

export async function loadPage({ pageType, slug, fallbackSections }: LoadOptions): Promise<PageData> {
  const isLocalPreview = import.meta.env.DEV && import.meta.env.PUBLIC_EASYPM_LOCAL_PREVIEW === 'true';
  const normalizedSlug = normalizeSlug(slug);

  if (isPendingServiceSlug(normalizedSlug) && !pendingServicesEnabled) {
    return { title: siteProfile.brandName, sections: [] };
  }

  // An explicitly enabled local trial preview must be deterministic. Use its
  // checked-in draft content instead of accidentally rendering published
  // documents from a shared Sanity project.
  if (isLocalPreview) {
    const { getEasyPmLocalPreviewPage } = await import('../data/easyPmLocalPreview');
    const previewPage = getEasyPmLocalPreviewPage(normalizedSlug || 'home');
    if (previewPage) return previewPage;
  }

  // Load page data with slug priority over pageType
  let page = null;
  
  if (normalizedSlug) {
    page = await fetchPageBySlug(normalizedSlug);

    if (!page) {
      const fallbackSlugs = SLUG_FALLBACKS[normalizedSlug] ?? [];
      for (const fallbackSlug of fallbackSlugs) {
        page = await fetchPageBySlug(fallbackSlug);
        if (page) break;
      }
    }
  } else if (pageType) {
    page = await fetchPageByType(pageType);
  }

  // Ensure sections is always an array
  const sections = Array.isArray(page?.sections) && page.sections.length > 0 
    ? page.sections 
    : Array.isArray(fallbackSections) ? fallbackSections : [];
  const scopedSections = pendingServicesEnabled
    ? sections
    : sections.map((section) => section._type === 'serviceGridSection'
      ? { ...section, items: section.items.filter((item) => !isPendingServiceHref(item.linkUrl ?? '')) }
      : section);

  return {
    title: page?.seo?.seoTitle ?? page?.title ?? siteProfile.brandName,
    description: page?.seo?.seoDescription ?? undefined,
    canonicalUrl: page?.seo?.canonicalUrl ?? undefined,
    sections: scopedSections
  };
}
