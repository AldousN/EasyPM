# EasyPM

EasyPM website built with Astro, Tailwind CSS, TypeScript, and Sanity Studio.

## Run locally

```sh
npm install
cp .env.example .env.local
npm run dev
```

Set `PUBLIC_EASYPM_LOCAL_PREVIEW=true` in `.env.local` to use the checked-in trial content without a Sanity connection. To load published CMS content, set the Sanity project and dataset variables and leave local preview disabled.

## Sanity Studio

```sh
npm install --prefix studio
npm run sanity:dev
```

Configure the Studio project and dataset in your local environment. The contact form requires an inquiry webhook before it can send messages.

## Build

```sh
npm run build
```

## Environment and repository safety

Environment files, credentials, dependency folders, generated builds, and internal project records are excluded from Git. The included environment examples contain no credentials. Keep Sanity write tokens, webhook secrets, and Turnstile secret keys in local or hosting environment variables; never put them in `PUBLIC_` variables or commit them.

## Structure

- `src/`: routes, shared sections, styles, and CMS integration
- `public/`: website assets and fonts
- `studio/`: Sanity schemas and Studio configuration
- `scripts/`: content and maintenance utilities

This is a local trial website. Prototype assets remain temporary until final licensed media is provided.
