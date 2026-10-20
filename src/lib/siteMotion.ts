/** Progressive, one-time motion for existing shared sections; no layout wrappers. */
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const gridSelectors = [
  '.figma-services-grid', '.figma-cards-grid', '.bbg-icon-grid',
  '.bbg-twocol-gallery.is-four', '.bbg-twocol-gallery.is-stack',
  '.bbg-faq-stack', '.bbg-faq-col', '.bbg-areas-grid',
  '.section-container > ol.grid', '#postsContainer',
];
const headingSelectors = [
  '.figma-services-header', '.figma-cards-heading', '.bbg-twocol-content',
  '.bbg-icon-head', '.bbg-sec-head', '.bbg-faq-head', '.bbg-areas-head',
  '.bbg-steps-head', '.bbg-form-head', '.bbg-sa-content', '.bbg-cta-content',
].join(',');
let activeRoot: Element | null = null;
let dispose: (() => void) | undefined;

function initializeMotion() {
  const root = document.querySelector('#main-content');
  if (!root || root === activeRoot) return;
  dispose?.();
  activeRoot = root;
  if (motionPreference.matches || !('IntersectionObserver' in window)) return;

  const pending = new Set<HTMLElement>();
  const timers = new Map<HTMLElement, number>();
  const candidates = new Map<HTMLElement, number>();
  const show = (element: HTMLElement) => {
    observer.unobserve(element);
    pending.delete(element);
    window.clearTimeout(timers.get(element));
    timers.delete(element);
    element.dataset.scrollReveal = 'shown';
    element.style.removeProperty('--motion-index');
  };
  const reveal = (element: HTMLElement) => {
    observer.unobserve(element);
    if (motionPreference.matches) return show(element);
    element.dataset.scrollReveal = 'revealing';
    // Restore visibility even if a browser extension suppresses animation events.
    timers.set(element, window.setTimeout(() => show(element), 1000));
  };
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) reveal(entry.target as HTMLElement);
    }
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

  const register = (element: HTMLElement, index = 0) => {
    if (element.dataset.scrollReveal || !element.getClientRects().length) return;
    const bounds = element.getBoundingClientRect();
    // Leave the first viewport, restored scroll positions, and LCP content alone.
    if (bounds.top < window.innerHeight || element.contains(document.activeElement)) {
      element.dataset.scrollReveal = 'shown';
      return;
    }
    element.style.setProperty('--motion-index', String(index % 4));
    element.dataset.scrollReveal = 'pending';
    pending.add(element);
    observer.observe(element);
  };

  for (const grid of root.querySelectorAll(gridSelectors.join(','))) {
    Array.from(grid.children).forEach((element, index) => {
      if (element instanceof HTMLElement) candidates.set(element, index);
    });
  }
  for (const heading of root.querySelectorAll('h2')) {
    if (heading.closest('.figma-hero, .hero-v5')) continue;
    const group = heading.closest<HTMLElement>(headingSelectors) ?? heading;
    candidates.set(group, 0);
  }
  for (const element of root.querySelectorAll<HTMLElement>(
    '.bbg-twocol-gallery.is-single > div, .blog-list-description, .blog-empty-state, .bbg-form-card, .bbg-svc-cell',
  )) candidates.set(element, element.matches('.bbg-svc-cell')
    ? Array.from(element.parentElement?.children ?? []).indexOf(element)
    : 0);
  const footerContent = document.querySelector<HTMLElement>('.footer-cta-inner');
  if (footerContent) candidates.set(footerContent, 0);

  // A title inside a registered card travels with that card, never twice.
  for (const [element, index] of candidates) {
    const hasCandidateParent = Array.from(candidates.keys()).some((other) => other !== element && other.contains(element));
    if (!hasCandidateParent) register(element, index);
  }

  const showFocusedContent = (event: Event) => {
    if (!(event.target instanceof Element)) return;
    const parent = event.target.closest<HTMLElement>('[data-scroll-reveal="pending"], [data-scroll-reveal="revealing"]');
    if (parent) show(parent);
  };
  const showHashTarget = () => {
    if (!window.location.hash) return;
    let target: HTMLElement | null;
    try { target = document.getElementById(decodeURIComponent(window.location.hash.slice(1))); }
    catch { return; }
    for (const element of pending) {
      if (target && (element.contains(target) || target.contains(element))) show(element);
    }
  };
  const finishAnimation = (event: AnimationEvent) => {
    if (event.animationName === 'site-scroll-reveal' && event.target instanceof HTMLElement) show(event.target);
  };
  document.addEventListener('focusin', showFocusedContent);
  document.addEventListener('beforematch', showFocusedContent);
  document.addEventListener('animationend', finishAnimation);
  document.addEventListener('animationcancel', finishAnimation);
  window.addEventListener('hashchange', showHashTarget);
  showHashTarget();

  // Blog filtering replaces just this grid's children; observe no other mutations.
  const posts = root.querySelector('#postsContainer');
  const postObserver = posts ? new MutationObserver(() => {
    Array.from(posts.children).forEach((element, index) => {
      if (element instanceof HTMLElement) register(element, index);
    });
  }) : null;
  if (posts && postObserver) postObserver.observe(posts, { childList: true });

  dispose = () => {
    observer.disconnect();
    postObserver?.disconnect();
    for (const element of pending) show(element);
    document.removeEventListener('focusin', showFocusedContent);
    document.removeEventListener('beforematch', showFocusedContent);
    document.removeEventListener('animationend', finishAnimation);
    document.removeEventListener('animationcancel', finishAnimation);
    window.removeEventListener('hashchange', showHashTarget);
  };
}

document.addEventListener('astro:page-load', initializeMotion);
document.addEventListener('astro:before-swap', () => { dispose?.(); activeRoot = null; });
motionPreference.addEventListener('change', () => { dispose?.(); activeRoot = null; initializeMotion(); });
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeMotion, { once: true });
} else initializeMotion();
