## Personal Website v2

This project contains the Next.js (App Router) implementation of Brian Liu’s homepage shown in the mockup. Styling is handled with Tailwind CSS (v4). The layout is intentionally minimal—feel free to iterate on copy, colors, and sections as your content grows.

## Local Development

Install dependencies (already done if you ran `create-next-app`):

```bash
pnpm install
```

Start the dev server:

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the site.

## Customizing Content

- Update the hero text in `app/page.tsx`.
- Replace `public/profile.svg` with an actual portrait (`profile.jpg`/`profile.png`/`profile.svg`). Keep the same filename to avoid code changes.
- Adjust colors or spacing via Tailwind classes or project-wide tokens in `app/globals.css`.

## Production Build

```bash
pnpm build
pnpm start
```

Deploy on Vercel, Netlify, or any Next.js-friendly platform when you’re ready.
