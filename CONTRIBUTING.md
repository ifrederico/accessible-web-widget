# Contributing

Thanks for your interest in contributing. Here's how to get set up and submit changes.

## Project structure

Source code lives in `src/`, with the entrypoint at `src/index.js`. Rollup builds IIFE bundles into `dist/`. The dist artifacts are committed intentionally - they're used for releases and CDN delivery.

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
npm run test:smoke   # smoke tests
npm run ci           # full local CI flow
```

Please run `npm run ci` before submitting a PR.

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
