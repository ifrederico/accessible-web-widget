# tests/

Playwright smoke coverage for critical behavior.

## Run

- `npm run test:smoke`

## Covered Scenarios

- auto-init toggle render
- global constructor availability
- menu open/close
- persistence across reload
- dev mode report visibility
- data-attribute position/offset/size behavior
- phone behavior under touch emulation (`mobile.spec.js`, Pixel 7): compact
  layout, no page scroll behind the menu, touch-only options, tap-driven
  reading guide and text magnifier
- focus rings: none after mouse/touch, kept for keyboard
