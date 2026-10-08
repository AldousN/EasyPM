/** Accept only YouTube watch, share, shorts, and embed URLs from Sanity. */
export const EASYPM_FALLBACK_VIDEO_URL = 'https://www.youtube.com/embed/PH3786NxmIE';

export function getYouTubeEmbedUrl(value?: string): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;

    const host = url.hostname.toLowerCase();
    let id: string | null = null;
    if (host === 'youtu.be') {
      id = url.pathname.split('/')[1] ?? null;
    } else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)) {
      const segments = url.pathname.split('/').filter(Boolean);
      id = segments[0] === 'watch' ? url.searchParams.get('v') :
        ['embed', 'shorts', 'live'].includes(segments[0]) ? segments[1] ?? null : null;
    }

    return id && /^[A-Za-z0-9_-]{11}$/.test(id)
      ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`
      : null;
  } catch {
    return null;
  }
}
