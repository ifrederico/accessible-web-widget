# tests/

Playwright smoke coverage for critical behavior.

## Run

- `npm run test:smoke`

## Covered Scenarios

- auto-init toggle render
- global constructor availability
- menu open/close
- persistence across reload
- dev mode report visibility, and the two keys it needs (`devTools` /
  `data-acc-dev-tools` plus `?acc-dev`)
- data-attribute position/offset/size behavior
- phone behavior under touch emulation (`mobile.spec.js`, Pixel 7): the tile
  grid across the screen, no page scroll behind the menu, touch-only options,
  tap-driven reading guide and text magnifier
- focus rings: none after mouse/touch, kept for keyboard
- menu layout: header with only title and close, Language and Profiles rows
  expanding in place, one tile grid (three per row on desktop, two on narrow
  phones) with visually hidden group headings, on-state check badge
- Font Size tile: 110/125/150/off, persistence, snapping a value saved by
  the old slider
- Text to Speech tile: normal/slow/fast/off, speed persistence, legacy `true`
- Reset: count badge and disabled state when nothing is on
- options used together (`combinations.spec.js`): tiles that touch the same
  text in either order and after a reload, profiles on top of tiles, and page
  options that must not change the widget's own menu and dialogs
