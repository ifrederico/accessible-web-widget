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

## Adding a language

Translations are the easiest way to contribute — the whole change lives in two files:

1. In `src/constants/translations.js`, copy the `en` dictionary block, rename it to your language's two-letter ISO 639-1 code, and translate every value. Keep the keys exactly as they are (they're English source strings). Then add an entry to `SUPPORTED_LANGUAGES` at the bottom of the same file, with the label in the form `Native name (English name)`.
2. In `src/ui.js`, add your language to `countryByLanguage` (display name) and `countryCodeByLanguage` (two-letter ISO country code for the flag emoji) in `getLanguageCountryLabel`/`getLanguageFlag`. Don't rely on the fallback — it guesses the country from the language code and gets it wrong (e.g. `sv` would become El Salvador's flag).
3. If the language is written right-to-left, add its code to `rtlLanguages` in `isRtlLanguage` (`src/ui.js`).

Run `npm run test:unit` — the translation tests fail if any key is missing or empty, so a green run means your dictionary is complete. Native speakers reviewing existing translations are just as welcome as new languages: short UI labels are easy to get subtly wrong.

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
