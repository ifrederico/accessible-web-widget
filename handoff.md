# Handoff (temporary)

Delete this file before `dev` is merged into `main`. It is a working note, not documentation.

Written 2026-11-19.

## Where things stand

- **`main` is version 1.7.0, released.** Dev tools are now off by default and need `data-acc-dev-tools` on the script tag (or `devTools: true`) plus `?acc-dev` in the URL. Issue #33 is closed. GitHub, the CDN, npm and the WordPress plugin directory all have 1.7.0.
- **`dev` is ahead of `main`.** It holds the panel's new look: the blue `#0072e4`, 28px corners, 8px gap around the panel, a soft shadow onto the header, and 20px inside padding. The `dev` preview site builds from this branch.
- **A menu redesign is in progress on `dev`** (see below). When it lands it will be a commit after this file's commit. If `git log origin/dev` shows no such commit, the build was not finished and has to be done from the spec below.

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
- **A tile that is on:** icon and label in blue, a small soft glow instead of an outline, and a check mark in the top corner.
- **Levels:** the existing dots under the label. Contrast, Saturation and Readable Font show the level's name as the label while on.
- **Font Size is a tile with three taps** (110%, 125%, 150%, then off). The slider goes away. These three steps are placeholders; confirm them.
- **Text to Speech is a tile**, first in the grid. Taps change the speed (normal, slow, fast, then off). Click any text to hear it, as today.
- **Footer:** one quiet Reset button with a count of what is on. It is disabled when nothing is on.

Rules the build must follow:

- **No new words to translate.** There are 54 languages and no translators. Reuse existing text keys; numbers are fine.
- Colors come from the theme variables, so site owners' themes keep working.
- Keyboard use, screen reader announcements, right-to-left languages, phone layouts, dev tools gating and Reset must keep working.
- Text contrast at least 4.5 to 1, tap targets at least 44px.
- The Vision Impaired profile sets text to 150% (it was 140%) so it matches a step.

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
