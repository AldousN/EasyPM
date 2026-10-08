export type NavigationItem = {
  label: string;
  href: string;
  children?: Array<{ label: string; href: string }>;
};

// Shared navigation for the local EasyPM trial. Service links map to the
// corresponding Desktop Group frames in the supplied Figma file.
export const primaryNavigation: NavigationItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    href: '/services/',
    children: [
      { label: 'Our Services Overview', href: '/services/' },
      { label: 'Bed Bug Control', href: '/services/bed-bug-control/' },
      { label: 'Cockroach Control', href: '/services/cockroach-control/' },
      { label: 'Termite Control', href: '/services/termite-control/' },
    ],
  },
  { label: 'Service Area', href: '/service-area/' },
  { label: 'About Us', href: '/about-us/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Contact', href: '/contact/' },
];
