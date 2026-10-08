# EasyPM Figma asset manifest

Source: [EasyPM Figma design](https://www.figma.com/design/iRqswWfFaddIiE7s59z2Pu/EasyPM?node-id=82-994). The trial site uses the Desktop group frames as mapped by the client. Page copy is in `CONTENT-DRAFT.md`, matching the supplied `easypm-main-pages-draft.md`.

| Route / frame | Exported media in `public/images/` | CMS use |
| --- | --- | --- |
| Shared navigation | `easypm-logo-figma.webp`, `easypm-map-icon-figma.webp`, `easypm-phone-icon-figma.png` | Logo and topbar icons |
| Home Frame Desktop | `easypm-home-hero.webp`, `easypm-heat-icon-figma.webp`, `easypm-aprehend-icon-figma.webp`, `easypm-k9-icon-figma.webp`, `easypm-treatment-photo-figma-watermarked.webp`, `easypm-section1-treatment-figma-watermarked.webp` | Hero background, service cards, and approach photos. The hero's right column now embeds the approved YouTube video. |
| Bed Bug Control Frame Desktop | `easypm-services-hero-figma.webp`, `easypm-bedbug-service-figma.webp`, `easypm-bedbug-service-badge-figma.webp`, `easypm-k9-photo-figma.webp`, `easypm-k9-banner-figma.webp` | Bed Bug Control hero, service badge, and static K9 section photo in the nine-route local draft. |
| Cockroach Control Frame Desktop | Skyline reuses `easypm-services-hero-figma.webp`; `easypm-cockroach-service-figma.webp` from the separately supplied `cockroach logo.png` | Service overview badge is available locally. The isolated infestation photograph remains outstanding. |
| Termite Control Frame Desktop | Skyline reuses `easypm-services-hero-figma.webp`; `easypm-termite-service-figma.webp` from the separately supplied `termite logo.png` | Service overview badge is available locally. The termite photographs and process icons remain outstanding. |
| Service Area Frame Desktop | `easypm-service-area-hero-figma.webp`, `easypm-service-area-homes-figma.webp` | Service area hero |
| About Frame Desktop | `easypm-about-hero-figma.webp`, `easypm-about-service-van-figma.webp` | About hero and mission section. The local draft uses a static vehicle photograph. |
| Shared footer | `easypm-k9-banner-figma.webp` | The K9 strip drives the single Contact footer CTA banner on all nine local routes. Decorative social glyphs remain inactive until URLs are provided. |
| Blog | `easypm-home-hero.webp` reused from Home Frame Desktop | The Blog page uses the shared Figma system and approved empty state. No dedicated Blog frame or banner was found in the Desktop group. |
| Contact Frame Desktop | `easypm-contact-form-backdrop-left-figma.webp`, `easypm-contact-form-backdrop-right-figma.webp` | The two pale house-outline layers appear behind the form. The local draft is form-led, as in the frame. |

The Service Area frame includes a four-property illustration, which is uploaded as `easypm-service-area-homes-figma.webp`. A separate Philadelphia coverage-map vector has not been verified, so the rendered service-area section uses the draft's confirmed Philadelphia text rather than inventing map coverage.

Figma's logo and several icons are raster layers. Converting their SVG wrappers would embed PNG data, so the original artwork is retained in optimized WebP or PNG. The topbar PNG glyphs are color-adaptive CSS masks; code-native chevrons and checkmarks use `currentColor`. The two Home approach photographs visibly contain prototype stock watermarks and are temporary assets for local review.

`scripts/seed-easypm-figma.mjs` uploads the local WebP exports to Sanity project `mrdn8wqq`, dataset `production`, and attaches image references with contextual alt text to the six page documents. It reuses assets by original filename. Astro renders CMS images through the Sanity image builder with WebP URLs, responsive width descriptors, and explicit image dimensions. The checked-in local draft is available for repeatable reseeding.

`scripts/sync-easypm-preview-to-sanity.mjs` synchronized all nine pages and shared navigation on 2026-10-08, reusing previously uploaded assets. The readback returned 9/9 page documents. The token was supplied to that one process and was not stored in the repository.

`scripts/fix-about-cta-media.mjs` applies the About photo and shared footer banner references to existing documents while preserving unrelated CMS fields. `scripts/consolidate-easypm-footer.mjs` removes the five duplicate closing CTA sections and configures both global footer actions. The Figma estimation banner has “FREE ESTIMATION” baked into the full export, so the CMS uses a clean crop of its gradient without that text.

## Banner readback

On 2026-10-07, Sanity readback confirmed hero `backgroundImage` asset references for all six routes. Home, Services, Service Area, and About use their mapped Figma frame images. Blog reuses the Home Figma hero because no dedicated Blog frame exists in the accessible Desktop group. Contact uses the clean 1668×278 Figma K9 photograph strip as a compact hero and the two original Contact frame artwork layers in its form section. These two hero choices reuse verified Figma artwork but are not unique Blog or Contact banner designs. The Home raster source is 1920×885; it must not be described as a true 2× export.

## Verification on 2026-10-07

- Astro and Studio builds completed; all six CMS routes returned HTTP 200 and had one H1 each.
- On 2026-10-08, the latest directive changed Home, Services K9, and About to use an active YouTube iframe with the specified title. Sanity readback confirmed all three `videoUrl` fields. Their former static section images remain in the media library but are no longer attached to K9 or About.
- Contact uses its Figma form artwork and the approved phone, service area, fields, and messages.
- Sanity readback confirmed zero duplicate closing `ctaSection` entries across the six original pages. Global settings now provide one Contact action in the K9 footer banner. The same shared footer renders on every route. Browser checks found no desktop or mobile horizontal overflow.
- Browser inspection found no horizontal overflow at the in-app browser's 520px effective mobile viewport. The mobile drawer opened with all six links. Every rendered image had nonempty alt text.
- The blog displayed the approved empty state. The contact form is visibly disabled until an inquiry webhook is configured; the phone link works.
- Pixel-perfect overlay measurements and a Lighthouse accessibility score are not claimed.

## Local draft on 2026-10-08

The later Figma-led scope replaces the prior six-route assumption. The nine-route local site at `http://192.168.1.23:4323/` now reads from Sanity. The Home timeline is removed, the Contact page is form-led, and all nine routes render the revised shared footer. Astro and Studio builds complete. Separately supplied Cockroach and Termite logo PNGs are optimized to 560×560 transparent WebP files for the overview cards. The user chose a local-only asset update, so the published Sanity cards still lack those asset references; the shared floating service grid reads the explicit local artwork mapping when a card icon field is empty. CMS media synchronization remains open.
