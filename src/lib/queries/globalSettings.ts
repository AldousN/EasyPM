import groq from 'groq';
import { getSanityClient } from '../sanityClient';

export type SiteSettings = {
  contact?: {
    companyName?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
  };
  brandLogo?: { url?: string; alt?: string };
  navigationItems?: Array<{ label?: string; href?: string; children?: Array<{ label?: string; href?: string }> }>;
  headerCtaLabel?: string;
  headerCtaLink?: string;
  footerDescription?: string;
  footerCtaHeading?: string;
  footerCtaText?: string;
  footerCtaButtonLabel?: string;
  footerCtaButtonLink?: string;
  footerCtaSecondaryButtonLabel?: string;
  footerCtaSecondaryButtonLink?: string;
  footerBannerImage?: { url?: string; alt?: string };
  footerGradientImage?: { url?: string; alt?: string };
  footerLinks?: Array<{ label?: string; href?: string }>;
  socialLinks?: Array<{ label?: string; url?: string }>;
};

const GLOBAL_SETTINGS_QUERY = groq`
  *[_type == "globalSettings" && _id == "global-settings"][0]{
    contact { companyName, phone, address, city, state },
    "brandLogo": brandLogo { "url": asset->url, alt },
    navigationItems[] { label, href, children[] { label, href } },
    headerCtaLabel,
    headerCtaLink,
    footerDescription,
    footerCtaHeading,
    footerCtaText,
    footerCtaButtonLabel,
    footerCtaButtonLink,
    footerCtaSecondaryButtonLabel,
    footerCtaSecondaryButtonLink,
    "footerBannerImage": footerBannerImage { "url": asset->url, alt },
    "footerGradientImage": footerGradientImage { "url": asset->url, alt },
    footerLinks[] { _key, label, href },
    socialLinks[] { _key, label, url }
  }
`;

export async function fetchGlobalSettings(): Promise<SiteSettings | null> {
  const client = getSanityClient();
  if (!client) return null;

  try {
    return await client.fetch<SiteSettings | null>(GLOBAL_SETTINGS_QUERY);
  } catch (error) {
    console.warn('Failed to fetch global site settings', error);
    return null;
  }
}
