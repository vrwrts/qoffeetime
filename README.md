# Qoffeetime

Coffee timer Progressive Web App, built with [Vite](https://vite.dev),
[React](https://react.dev) and [TanStack Router](https://tanstack.com/router),
with recipes from James Hoffmann. Hosted on Cloudflare Workers.

## Running locally

Requires [pnpm](https://pnpm.io) (and Node 18+).

```bash
$ git clone https://github.com/vrwrts/qoffeetime
$ cd qoffeetime
$ pnpm install   # Install dependencies
$ pnpm dev       # Start the dev server
```

## Useful scripts

```bash
$ pnpm build     # Type-check and build to ./dist
$ pnpm preview   # Serve the built app with Wrangler (as Cloudflare will)
$ pnpm lint      # Lint & format check with Biome
$ pnpm format    # Apply Biome formatting/lint fixes
$ pnpm deploy    # Build and deploy to Cloudflare Workers
```
