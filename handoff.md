# Handoff (temporary)

Delete this file before `dev` is merged into `main`. It is a working note, not documentation.

Written 2026-11-19.

## Where things stand

- **`main` is version 1.7.0, released.** Dev tools are now off by default and need `data-acc-dev-tools` on the script tag (or `devTools: true`) plus `?acc-dev` in the URL. Issue #33 is closed. GitHub, the CDN, npm and the WordPress plugin directory all have 1.7.0.
- **`dev` is ahead of `main`.** It holds the panel's new look: the blue `#0072e4`, 28px corners, 8px gap around the panel, a soft shadow onto the header, and 20px inside padding. The `dev` preview site builds from this branch.
- **The menu redesign is built and on `dev`** (see below). All tests pass. It has not been tried with a real screen reader yet.

## Still to do from the 1.7.0 release

- **Check the WordPress plugin on a real site.** Logged out, a page opened with `?acc-dev` must show no dev tools. Logged in as an administrator, the same address must show Annotations and Accessibility Report. This line of PHP was never run before release.

## The menu redesign (decided on the design canvas)

The design canvas is called "Widget Tile Directions" in the Claude artifacts list. The chosen board is "Speech as a tile".

What was decided:

- **Header:** title and close button only. The language button leaves the header.
- **Top card with two folded rows**, each with a chevron:
  - Language: shows the current language, opens the existing language list and search in place.
  - Profiles: shows the active profile, opens the four profile tiles, two per row.
- **No visible section titles** (Speech, Text, Color & Contrast, Reading Aids, Interaction). Keep the group names for screen readers only.
- **One grid, three tiles per row** (two per row on very narrow screens).
- **Tile look:** white tile on a light background (`oklch(97% 1% 255deg)`, stored as `#f3f5f8` for older browsers), 22px corners, icon centered above the label, no circle behind the icon, no "On/Off" words.
- **A tile that is on:** icon and label in blue and a check mark in the top corner. No outline and no blue glow.
- **Levels:** the existing dots under the label. Contrast, Saturation and Readable Font show the level's name as the label while on.
- **Font Size is a tile with three taps** (110%, 125%, 150%, then off). The slider is gone. These three steps are placeholders; confirm them.
- **Text to Speech is a tile**, first in the grid. Taps change the speed (normal, slow, fast, then off). Click any text to hear it, as today.
- **Reset:** one quiet button with a count of what is on. It is disabled when nothing is on. Its final place is described below.

Rules the build must follow:

- **No new words to translate.** There are 54 languages and no translators. Reuse existing text keys; numbers are fine.
- Colors come from the theme variables, so site owners' themes keep working.
- Keyboard use, screen reader announcements, right-to-left languages, phone layouts, dev tools gating and Reset must keep working.
- Text contrast at least 4.5 to 1, tap targets at least 44px.
- The Vision Impaired profile sets text to 150% (it was 140%) so it matches a step.

## Reset, Hide, Move and the credit line (built)

- The header has the title, a "more" button (three dots) and Close. The "more" button opens a small drop-down with two items: "Move widget" and "Hide widget". Its screen reader name reuses the existing word "Tools".
- "Move widget" flips the floating button and the panel to the other side. It is remembered on the device.
- "Hide widget" swaps the drop-down's two items for a step that asks for how long: this visit, one day, one week, or always, with Close and Hide. "Always" takes a second click, after a note saying the widget stays hidden until the visitor clears the site's data in their browser.
- While the button is hidden, the menu still opens through the skip link (press Tab on the page) or `AccessibleWebWidget.instance.open()`. Under "more", Hide widget then shows as on, and clicking it brings the floating button back. `showButton()` does the same.
- Reset (with a count) is one wide white button under the Language and Profiles card, above the tiles.
- A footer bar is back, in the header's blue, with "AccessibleWeb" and "Accessibility Statement" in white. It is hidden with `hideAttribution`.
- New words, translated in all 54 languages by machine and not checked by native speakers: "Hide widget", "Move widget", "This visit", "One day", "One week", "Always", "Hide", "Accessibility Statement", and the one-sentence "Always" note. The note is a full sentence, so it is the most likely to read badly in some languages.
- The statement page's wording was drafted from the README and the disclaimer. It needs the owner's read-through.
- The statement link points at the production site, where the page only exists after `dev` is merged.

## Options brought up to standard (2026-11-22)

- **Contrast is one tile with three choices**, one click each, then off: Smart Contrast (recolors only the text that fails the WCAG AA contrast measure, just far enough to pass), Dark Contrast (black page, white text, yellow links) and Light Contrast (white page, black text). The separate High Contrast tile is gone: Light Contrast is the same rules under the same saved key, `high-contrast-mode`. The old faint "light-contrast" filter is gone; a saved one now means Light Contrast. Contrast no longer switches off when a Saturation level or Invert Colors is picked.
- **Smart Contrast leaves alone** text over a picture or gradient (it cannot know the color behind it) and colors written in a color space other than RGB. It stands down while Dark or Light Contrast is on. It does not fix text made faint with `opacity`.
- **Line Height has three steps** (line-height 2, 2.5, 3; headings take three quarters). **Letter Spacing has three steps** and spaces words too (0.12em and 0.16em per step). A saved "on" from before means the first step of each, which for Line Height is gentler than the old single step of 3.
- **Hide Images keeps each picture's space**, and leaves the icons inside buttons and links. It still hides videos, canvases and iframes; an iframe can be a payment form or a map, which may deserve a second look.
- **Tiles that step through an amount keep their plain name** (Font Size, Line Height, Letter Spacing, Text to Speech). The dots show the step. A screen reader hears the step number ("Font Size: 2 On"), because it cannot see the dots. The numbers that were shown for a while ("Font Size 125%", "Line Height 2×") are gone: three tiles wrote them three ways and Letter Spacing had none. Contrast, Saturation and Readable Font still show the name of the choice.
- **The figure in the floating button is 15% larger.**
- **Tooltips is a new tile** (hidden on touch-only devices). On hover and on keyboard focus it shows the hidden name of a control (`aria-label`, `title`) or the description of a picture (`alt`) in a large bubble. It shows nothing when that name only repeats the visible text. The element's own `title` is held back while the bubble shows and put back after.
- **Page Structure names landmarks in plain words** ("Navigation: Main menu", "Main content", "Footer") instead of tag names. A header or footer inside an article or section is no longer listed as a page landmark.
- **Smart Contrast handles gradients**: text must pass against the gradient's lightest and darkest color. It leaves text over a picture alone, and text so close to its background that it would be invisible (that means a picture is underneath).
- **Text laid over a picture** (a banner photo with a headline) is marked with `data-acc-over-media`. Dark and Light Contrast dim or fade the picture behind it instead of covering it with a solid box.
- **Dark Contrast keeps icons and logos visible**: icons drawn as a CSS mask take the text color, and SVGs and header/footer images get a thin light edge so dark ink shows on black.
- **Hide Images leaves embedded frames alone** (a frame can be a payment form or a map).
- **New words, machine translated in 53 languages and not checked by native speakers:** "Smart Contrast", "Tooltips", and the landmark names "Navigation", "Header", "Main content", "Footer", "Sidebar", "Search", "Form", "Section".
- **Tried on real sites** (a Wikipedia article, the Shopify Dawn demo shop, a payments company home page, a news front page) by loading the local build into them: Smart, Dark and Light Contrast ran without errors, and the scan took 20 to 70 ms. Still not tried on the owner's own shop, in Safari or Firefox, or with a screen reader.
- **Not done, waiting on a decision:** a keyboard shortcut to open the menu (the obvious keys are taken by browsers), and more profiles.

## Options used together (2026-11-22)

Every tile was tried alone, then every pair in both orders, every three, random larger sets, and the four profiles on top of each tile, with reloads and Reset in between: about 53,000 checks on a test page. What that found is fixed and has tests in `tests/combinations.spec.js`.

- **The menu and the Page Structure window keep their own type.** Letter Spacing used to widen the word gaps in the menu; Font Weight and Readable Font used to restyle the Page Structure window. The Text Magnifier banner and the Tooltips bubble do follow the reader's font and weight, on purpose: they show page text.
- **Dark Contrast and Simplify Layout** now give a black page with white text whichever is switched on first. Before, Dark then Simplify gave dark grey on black.
- **Font Size works under Simplify Layout.** Its sizes are now written as important, and are measured again when Simplify Layout goes on or off. A size the page wrote on an element itself is put back when Font Size goes off.
- **Line Height and Letter Spacing win over Simplify Layout's own spacing**, also after a reload (before, it depended on which was switched on first).
- **Smart Contrast measures in the page's own colors under Invert Colors and Saturation**, and looks again when Font Size changes (large text needs less contrast than small text).
- **Dark Contrast, Light Contrast and Simplify Layout fix colors the page forces.** A color written on an element as `!important` beats any rule, so under these three the Smart Contrast scan runs as a net and fixes what is left unreadable, up to a ratio of 7.
- **A color filter follows the body color.** With Invert Colors on, switching Dark Contrast on turns the whole page light (a black page, inverted), with no dark frame left around it.
- **Profiles that share an option** (Seizure Safe and ADHD Friendly both stop animations) give it back when both are off. Before, Stop Animations stayed on.
- **A profile gives back the color filter that was on before it**, keeps Monochrome if that was already chosen, and keeps a Line Height or Letter Spacing level that is higher than its own.
- **Reading Guide:** the window is 120px tall (was 100px), has a line along its top and bottom edge, follows the mouse while the menu is open (over the page, not over the menu), and no longer stops short of where the mouse stops.
- **Page Structure opens over the menu**, which stays open behind it. Escape or the close button comes back to the Page Structure tile; picking a heading or link with the mouse closes the window only and the menu stays, picking one from the keyboard closes both (the open menu holds the Tab key, so reading on from the chosen place would not work). The developer-only Accessibility Report still closes the menu first.
- **Dyslexia Font has a tile of its own** (it was the first step of the Readable Font tile, where visitors did not find it). The Readable Font tile keeps Legible Font and Lexend. Both tiles write the same saved value, `readable-text`, so one reading font is on at a time and older saved choices still work. No new words: "Dyslexia Font" was already translated. Its icon is the letters "Df", drawn by hand in the weight of the icon set, and the Dyslexia Friendly profile uses it too. The Readable Font tile has a new icon (a letter A with a line under it).
- **Left as it is:** changing a tile that a profile switched on, then switching the profile off, puts that tile back to how it was before the profile.

- **A reading font changes the page once.** The font file is fetched on the first click. The page used to switch to the font's system stand-in at once and to the font a moment later, two jumps. Now it keeps its own type until the file is in (three seconds at most, then the stand-ins show). The tile answers at once. A later choice, off, or Reset cancels a switch still waiting.

- **The Highlight Title tile is gone** (owner's call, 2026-11-23: not needed). Its code, icon and its word in the 54 languages went with it. A saved `highlight-title` from an older version is ignored and cleared by Reset. Highlight Links stays.

## Other changes since the redesign

- Tiles are square and the panel is 456px wide, the narrowest that keeps every English label on one line. Phones show two tiles per row.
- Profiles are short rows, icon then name, two by two (one per row on phones).
- The language list has a soft search field, a thin scrollbar and a fade at the bottom.

- Menu icons are Phosphor Icons, Light weight (MIT), a little larger. Hide Images is that set's picture icon with a slash added by hand. The floating button keeps its Material icons.
- Hover is a soft grey fill everywhere (tiles, Reset, rows). Blue is kept for options that are on and for keyboard focus. The theme's default `hoverColor` is now grey, and the customizer no longer sets one.
- Text sizes: 17 for the title, 15 for rows and buttons, 13 for tile labels and small print. The search field stays 16 so iPhones do not zoom in on it.
- Two font weights: semibold for the title and the name of anything you press, regular for everything else (values, notes, list choices, picked or not).
- The panel's scrollbar is thin with no track where the system always shows scrollbars. This was checked in Chrome only, and has no automated test.
- The menu's text is set in Inter. The files are in `src/fonts/`, copied to `dist/fonts/` by the build, and loaded from beside the script when the menu first opens (only the parts a language needs). `menuFontUrl` points at another folder; `menuFont: "system"` turns it off. Before release: check the font loads from the CDN address, and in the WordPress plugin, whose PHP line for `menuFontUrl` and font copies were added but never run.
- The Accessibility Report and Page Structure dialogs are built from the menu's pieces, with no blue (a blue header and footer were tried and rejected as hard to read): a light grey dialog, white cards, soft pills. The design is the "Report" board on the canvas.
  - The header is the title with "Powered by axe-core" beside it, a Close button, and a line under it. Passed tests is the heading over the four severity tiles.
  - Each result is a card that opens on its own, with the element's HTML in a dark code box and a copy button.
  - "Items Need Review" now lists its items as cards. Its note, "A person needs to check these.", and the copy button's names "Copy" and "Copied" are English only, like the engine's own texts.
- The statement page is one sheet instead of five cards.
- "Simplify Layout" is still in English in 9 of the 54 dictionaries.

## Planned next, not started

- **A player on the page for Text to Speech** (previous, pause, next, speed, close), shown while it reads. This is a new feature and should be its own release, after the redesign.
- **The language button's hover color** fails the contrast rule (3.5 to 1). It moves into the new top row with the redesign; check it there.
- **Widget and scanner alignment:** the widget's built-in report uses an older audit engine version and a shorter rule list than the scanner, and it scans while its own dialog is open, which hides some page-level problems. A test branch for this (`test/scanner-parity-self-scan`) exists only on the computer where it was written and is not on GitHub.

## Working locally

```
npm install
npm run dev                      # rebuilds dist on every change
npx http-server . -p 4180 -c-1   # then open http://127.0.0.1:4180/examples/index.html
npm run ci                       # lint, build, unit tests, browser tests
```

Commit to `dev`. Merge to `main` only when the redesign is finished and tested, then release.
