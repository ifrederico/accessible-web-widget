# Contributing

Thanks for your interest in contributing. Here's how to get set up and submit changes.

## Project structure

Source code lives in `src/`, with the entrypoint at `src/index.js`. Rollup builds IIFE bundles into `dist/`. The dist artifacts are committed intentionally - they're used for releases and CDN delivery.
JavaScript editor type-checking is enabled through `jsconfig.json` (`checkJs`).

## Getting started

```bash
npm install
npm run build
```

Watch mode for local development:

```bash
npm run dev
```

## Build outputs

- `dist/accessible-web-widget.js` - unminified
- `dist/accessible-web-widget.min.js` - minified
- `dist/accessible-web-widget.min.js.map` - sourcemap

## Testing

```bash
npm run lint         # lint
npm run test:smoke   # smoke tests
npm run ci           # full local CI flow
npm run check:axe-version
```

Please run `npm run ci` before submitting a PR.

## axe-core pin maintenance

`loadAxeCore()` uses a pinned jsDelivr URL and SRI hash in `src/features.js`. Run `npm run check:axe-version` periodically. If there is a new version:

1. Update `AXE_CORE_VERSION` and `AXE_CORE_SRC` in `src/features.js`.
2. Regenerate `AXE_CORE_INTEGRITY` with:
   `curl -sL https://cdn.jsdelivr.net/npm/axe-core@<version>/axe.min.js | openssl dgst -sha384 -binary | openssl base64 -A`
3. Run `npm run ci`.
4. Commit source + dist artifacts and release a patch version.

## Local demo

After building:

```bash
npx http-server . -p 4173 -c-1
```

Then open:
- `http://127.0.0.1:4173/examples/index.html`
- `http://127.0.0.1:4173/examples/index.html?acc-dev=true`

## Submitting changes

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Run `npm run ci` to make sure nothing's broken
5. Open a pull request
