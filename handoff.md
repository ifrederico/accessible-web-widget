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

## Other changes since the redesign

- Tiles are square and the panel is 456px wide, the narrowest that keeps every English label on one line. Phones show two tiles per row.
- Profiles are short rows, icon then name, two by two (one per row on phones).
- The language list has a soft search field, a thin scrollbar and a fade at the bottom.

- Menu icons are Phosphor Icons, Light weight (MIT), a little larger. Hide Images is that set's picture icon with a slash added by hand. The floating button keeps its Material icons.
- Hover is a soft grey fill everywhere (tiles, Reset, rows). Blue is kept for options that are on and for keyboard focus. The theme's default `hoverColor` is now grey, and the customizer no longer sets one.
- Text sizes: 17 for the title, 15 for rows and buttons, 13 for tile labels and small print. The search field stays 16 so iPhones do not zoom in on it.
- The panel's scrollbar is thin with no track where the system always shows scrollbars. This was checked in Chrome only, and has no automated test.
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
