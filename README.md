# AI Radar

Discover AI websites and tools. React + TypeScript + Vite, powered by the public [FreeSERP API](https://freeserp.ai/docs.php)
(`index=sites`, `ai_startups=1`). No database, no API key.

## Run

```bash
npm install
npm run dev          # http://localhost:5173
npm run typecheck && npm run lint && npm run build
```

## FreeSERP proxy

FreeSERP sends a duplicated CORS header, so browsers cannot call it directly. The app calls a small same-origin proxy
at `/api/freeserp`, which forwards only validated parameters. On Vercel, this is the Edge Function in `api/freeserp.ts`.
Other PHP-enabled hosts can use `public/api/freeserp.php`; it requires PHP with cURL.

## Deploy

### Vercel

Import the Git repository in Vercel. The Vite project is detected automatically; use `npm run build` as the build
command and `dist` as the output directory. No environment variables or API key are required. The API function is
deployed alongside the static site. To run the function locally, use `vercel dev` instead of `npm run dev`.

### PHP-enabled server

`./deploy.sh` builds and rsyncs `dist/` to `/var/www/html/` (adjust the path for your server). Make sure the server
executes `public/api/freeserp.php` as PHP and routes `/api/freeserp.php` to it.

## Data

Favorites and the theme choice live in `localStorage` only.
