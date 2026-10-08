# EasyPM local trial implementation status

## Current state · 2026-10-08

The nine-route site is running at `http://192.168.1.23:4323/`. It is a trial separate from easypm.com. The local server now loads the nine published Sanity documents. `src/data/easyPmLocalPreview.ts` remains the repeatable source for content sync.

### UI and route review · 2026-10-08

- The shared Figma hero now uses a left-to-right dark overlay on desktop and a top-to-bottom overlay at narrow widths. The brighter end of the hero button gradient was darkened so white button text retains at least 4.5:1 contrast.
- Floating service columns now have equal widths, uniformly sized badges, white backgrounds, and dividers confined to the card content below the heading. The icon lift remains, with reduced-motion handling. The shared photo-card variant has a branded background, 16:10 Sanity image crops, a user-requested fixed eyebrow badge, padded slate label areas, decorative arrows, hover lift/zoom, and reduced-motion handling. Shared purple buttons use bold white labels.
- Services is a dropdown button on desktop and an accordion button on mobile. Both menus contain Our Services Overview, Bed Bug Control, Cockroach Control, and Termite Control. Browser checks confirmed click open/close, 112×112 desktop badges, equal column heights, white column backgrounds, and no horizontal overflow at 1202px, 800px, or the browser's 693px narrow viewport. The final Astro build passed.
- `npm run template:audit` passed, including the Astro build. All nine published routes showed one H1, one global footer, no horizontal overflow, no broken loaded images, and no missing image `alt` attributes at the in-app browser's 520px narrow viewport. Footer markup matched across all nine routes after load. The desktop Home and Service Area heroes were reviewed at 1706px.
- The Services overview hero in published Sanity still has a secondary CTA pointing to `/services/` itself. The local content draft now uses the approved “Discuss Your Options” and phone actions; `.env.local` has no `SANITY_API_TOKEN`, so Sanity returned `Insufficient permissions; permission "update" required` on a targeted patch. An Editor-scoped token is needed to publish that correction.

## Implemented in the local draft

- Home, Services overview, Bed Bug Control, Cockroach Control, Termite Control, Service Area, About, Blog, and Contact render through `SectionRenderer.astro` and reusable section components.
- The header has a keyboard-accessible Services dropdown with the overview and all three service routes. The Home timeline is removed. The Home hero keeps the live `PH3786NxmIE` YouTube iframe. The Contact page follows the supplied form-led desktop frame.
- A reusable Figma estimate strip and card-grid variants support the frame section order. The photo-card variant uses identical 16:10 crops with a separate padded dark label area and white text.
- The global footer follows the revised reference: one K9 photo CTA, grouped links, a Philadelphia map, decorative social glyphs with no destinations yet, and a compact copyright bar. Sanity readback confirms the new CTA and Services navigation label.
- The local draft uses available Figma-derived assets. The separately supplied Cockroach and Termite logo PNGs now provide local WebP overview badges. Per the user's local-assets-only direction, no CMS mutation was made; the shared grid's explicit local artwork map fills missing icon fields. This trial exception expires before production delivery, when those files must be attached to the card image fields in Sanity and the runtime map removed. Cockroach and Termite section photos remain pending.
- All nine CMS routes were opened in the in-app browser. Each returned one H1, its page title, and no horizontal overflow at the browser's desktop width. Rendered images had no broken URLs or empty alt text. The Home timeline is absent and its iframe has the specified embed URL. The Astro build and Sanity Studio build pass. The sync script read back 9/9 Sanity documents. The latest card readback showed equal media heights, white labels below the photos, and `object-fit: cover`.

## Inputs needed to finish

- Remaining isolated exports from the Cockroach and Termite frames: infestation/damage photographs, process icons, and any additional badge-card art. The pest logo exports have now been supplied.
- Confirmed social profile URLs if the decorative footer glyphs should become links.
- A working inquiry delivery endpoint in `AUTOMATION_WEBHOOK_URL`. Until configured, the Contact form remains disabled and the phone link is active.
- An Editor-scoped Sanity token in `.env.local` to publish the corrected Services overview hero CTA. Do not paste the token into chat or project documentation.

The copy in the Cockroach and Termite frame screenshots contains pasted bed bug claims; the local draft uses neutral service-specific text pending review. No pixel-perfect overlay or Lighthouse score has been completed. The Services grid and mobile navigation have received targeted responsive checks. Existing repository-wide TypeScript diagnostics include pre-existing Studio errors; the Astro production build passes.
