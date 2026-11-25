# Kaitianming 开天命

Open your sky: a star and number reading from only a date and place of birth.
Live site: https://kaitianming.com

- **Stack:** React 19 · Vite 8 · TypeScript 6 · vite-plugin-pwa (installable, works offline) · Cloudflare Workers (static assets)
- **Privacy:** every calculation runs in the visitor's browser. The birth date and place never go into the URL, storage, or any network request.
- **Languages:** English (default) and Thai.

## Project layout

```
public/data/cities.json       GeoNames extract, 49,708 cities (CC BY 4.0)
public/data/sky-catalog.json  d3-celestial stars ≤ mag 5, lines, IAU boundaries (BSD 3-Clause)
public/_headers               Security headers (CSP) and caching for Cloudflare
src/engine/                   Calculation engine (no UI code)
  sky.ts        planet/Moon/Sun positions (Paul Schlyter)
  skymap.ts     precession, alt/az, constellation lookup
  time.ts       historical time-zone offsets (IANA via Intl)
  cities.ts     city search
  chart.ts      planets table, Moon, Sun, JPL Horizons links
  paper.ts      sky paper: zenith, personal star, overlaps, bright/dark
  numbers.ts    day power / year power (site owner's rules), life number
  compute.ts    one full result + the JSON for the reading module
  events.ts     key sky moments across a lifetime (returns, contacts, lunar eclipses) for the time-travel dial
src/i18n/                     English/Thai text, credits
src/components/               Screens: Home, Result, Calculations (5 tabs), Premium, Settings
wrangler.jsonc                Cloudflare Workers config (static assets, SPA fallback)
```

## Commands

```bash
npm install        # once
npm run dev        # local preview at http://localhost:5173
npm run build      # production build into dist/
npm run typecheck  # TypeScript check
npm run deploy     # build and upload to Cloudflare (needs `npx wrangler login` once)
```

## Deploying on Cloudflare (Git-connected, automatic)

1. Put this folder in a GitHub repository.
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Import a repository** → pick the repo.
3. Build command: `npm run build` · Deploy command: `npx wrangler deploy` · Root directory: `/`.
4. After the first deploy: the Worker → **Settings → Domains & Routes → Add → Custom domain** → `kaitianming.com` (and `www.kaitianming.com` if wanted).

Every push to the main branch then rebuilds and redeploys the site.

## Notes for later phases

- **Ads (AdSense):** the Content-Security-Policy in `public/_headers` currently allows only this site and Google Fonts. Ad scripts will need their domains added. Ads must never receive birth details.
- **Engine parity:** engine 0.4.0 produces byte-identical JSON to prototype 0.3 (checked on 8 dates/places, including Singapore 1975 = UTC+7:30 and Bangkok 1919 = UTC+6:42).
- **Credits rule:** anything new that the site uses (library, font, data, service) must be added to `src/i18n/credits.ts` in both languages.
