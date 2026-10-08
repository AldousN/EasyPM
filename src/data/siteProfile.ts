const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const readEnv = (key: string, fallback = '') => {
  const value = import.meta.env[key];
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;
};
const readOptionalNumber = (key: string) => {
  const value = readEnv(key);
  return value ? Number(value) : undefined;
};

const siteUrl = trimTrailingSlash(
  readEnv('SITE_URL', readEnv('PUBLIC_SITE_URL', 'http://localhost:4321'))
);

export const siteProfile = {
  brandName: readEnv('BRAND_NAME', readEnv('PUBLIC_BRAND_NAME', 'EasyPM')),
  brandAbbrev: readEnv('BRAND_ABBREV', readEnv('PUBLIC_BRAND_ABBREV', 'EasyPM')),
  brandSlug: readEnv('BRAND_SLUG', readEnv('PUBLIC_BRAND_SLUG', 'easy-pm')),
  siteUrl,
  logoPath: '/src/assets/logo-wordmark.svg',
  primaryPhoneFormatted: readEnv('PHONE_PRIMARY_FORMATTED', '267-440-7306'),
  primaryPhoneE164NoPlus: readEnv('PHONE_PRIMARY_E164_NOPLUS', '12674407306'),
  primaryPhoneDashed: readEnv('PHONE_PRIMARY_DASHED', '+1-267-440-7306'),
  secondaryPhoneFormatted: readEnv('PHONE_SECONDARY_FORMATTED'),
  secondaryPhoneE164NoPlus: readEnv('PHONE_SECONDARY_E164_NOPLUS'),
  secondaryPhoneDashed: readEnv('PHONE_SECONDARY_DASHED'),
  streetAddress: readEnv('NAP_STREET_ADDRESS'),
  city: readEnv('NAP_CITY', 'Philadelphia'),
  region: readEnv('NAP_REGION', 'PA'),
  zip: readEnv('NAP_ZIP'),
  latitude: readOptionalNumber('NAP_LATITUDE'),
  longitude: readOptionalNumber('NAP_LONGITUDE'),
  ga4MeasurementId: readEnv('PUBLIC_GA4_MEASUREMENT_ID', readEnv('GA4_MEASUREMENT_ID')),
  callRailCompanyId: readEnv('PUBLIC_CALLRAIL_COMPANY_ID', readEnv('CALLRAIL_COMPANY_ID')),
  callRailSwapKey: readEnv('PUBLIC_CALLRAIL_SWAP_KEY', readEnv('CALLRAIL_SWAP_KEY'))
} as const;

export const getAbsoluteSiteUrl = (path = '/') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteProfile.siteUrl}${normalizedPath}`;
};
