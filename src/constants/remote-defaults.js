// Default remote sources for optional, on-demand assets (dev-mode audit
// engine and the dyslexia font). The WordPress build replaces this module
// with empty values (see rollup.config.js): the wordpress.org directory
// forbids shipping code that references remote executables, even as
// unreachable fallbacks, so that build requires axeCoreUrl/dyslexiaFontUrl
// to be configured (the bundled plugin always sets both).
export const AXE_CORE_VERSION = '4.11.1';
export const AXE_CORE_SRC = `https://cdn.jsdelivr.net/npm/axe-core@${AXE_CORE_VERSION}/axe.min.js`;
export const AXE_CORE_INTEGRITY = 'sha384-wb3zgvLcZeMFSec08dk7g8K8yDFFAX2uNKVwOUuowwc/wIfE2t6XVUjTEgPrOJCS';
export const DYSLEXIA_FONT_SRC = 'url("https://website-widgets.pages.dev/fonts/OpenDyslexic3-Regular.woff") format("woff"), url("https://website-widgets.pages.dev/fonts/OpenDyslexic3-Regular.ttf") format("truetype")';
