// Default remote sources for optional, on-demand assets (dev-mode audit
// engine and the dyslexia font). The WordPress build replaces this module
// with empty values (see rollup.config.js): the wordpress.org directory
// forbids shipping code that references remote executables, even as
// unreachable fallbacks, so that build requires axeCoreUrl/dyslexiaFontUrl
// to be configured (the bundled plugin always sets both).
export const AXE_CORE_VERSION = '4.11.1';
export const AXE_CORE_SRC = `https://cdn.jsdelivr.net/npm/axe-core@${AXE_CORE_VERSION}/axe.min.js`;
export const AXE_CORE_INTEGRITY = 'sha384-wb3zgvLcZeMFSec08dk7g8K8yDFFAX2uNKVwOUuowwc/wIfE2t6XVUjTEgPrOJCS';
export const DYSLEXIA_FONT_SRC = 'url("https://accessibleweb.pages.dev/fonts/OpenDyslexic3-Regular.woff") format("woff"), url("https://accessibleweb.pages.dev/fonts/OpenDyslexic3-Regular.ttf") format("truetype")';
// One @font-face source per Readable Font level. An empty src (WordPress
// build) skips the @font-face and the family falls back through its
// system font stack.
export const READABLE_FONT_FACES = {
  dyslexic: { family: 'OpenDyslexic3', src: DYSLEXIA_FONT_SRC },
  legible: { family: 'Atkinson Hyperlegible', src: 'url("https://accessibleweb.pages.dev/fonts/AtkinsonHyperlegible-Regular.woff2") format("woff2")' },
  lexend: { family: 'Lexend', src: 'url("https://accessibleweb.pages.dev/fonts/Lexend-Regular.woff2") format("woff2")' }
};
