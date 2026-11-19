// The menu's own font: Inter (SIL OFL 1.1), as a variable font split by
// script. Each part declares the characters it covers, so a browser
// downloads only the parts a language needs, and only once the menu is
// opened. The files ship beside the widget script in dist/fonts/.
export const MENU_FONT_FAMILY = 'AccessibleWeb Inter';

export const MENU_FONT_SUBSETS = [
  { file: 'inter-cyrillic-ext.woff2', range: 'U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F' },
  { file: 'inter-cyrillic.woff2', range: 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116' },
  { file: 'inter-greek-ext.woff2', range: 'U+1F00-1FFF' },
  { file: 'inter-greek.woff2', range: 'U+0370-0377,U+037A-037F,U+0384-038A,U+038C,U+038E-03A1,U+03A3-03FF' },
  { file: 'inter-vietnamese.woff2', range: 'U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB' },
  { file: 'inter-latin-ext.woff2', range: 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF' },
  { file: 'inter-latin.woff2', range: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD' }
];

// Where the widget's own file was loaded from; the fonts sit in a fonts/
// folder beside it, so they come from the same place as the script and no
// other server is contacted. This has to be read while the script is
// first running, which is why it is worked out here and not on demand.
export const WIDGET_SCRIPT_URL = (() => {
  try {
    return import.meta.url || '';
  } catch {
    return '';
  }
})();

// The folder holding the font files, as an absolute URL ending in "/".
// An owner's menuFontUrl wins; otherwise it is fonts/ beside the script.
export function resolveMenuFontBase(customUrl, scriptUrl = WIDGET_SCRIPT_URL, pageUrl = (typeof document !== 'undefined' ? document.baseURI : '')) {
  const custom = typeof customUrl === 'string' ? customUrl.trim() : '';
  const isSafe = (value) => value && !/["'()\\\s]/.test(value);
  try {
    if (custom) {
      if (!isSafe(custom)) return '';
      const base = new URL(custom.endsWith('/') ? custom : `${custom}/`, pageUrl || undefined).href;
      return isSafe(base) ? base : '';
    }
    if (!scriptUrl || !/^https?:/i.test(scriptUrl)) return '';
    const base = new URL('fonts/', scriptUrl).href;
    return isSafe(base) ? base : '';
  } catch {
    return '';
  }
}
