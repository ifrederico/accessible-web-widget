# src/

Modular widget implementation.

## Important Files

- `index.js`: main class, module composition, auto-init, global export.
- `state.js`: persistence, cookies/localStorage, language/default resolution.
- `styles.js`: style utilities, theme CSS variables, static CSS registration.
- `features.js`: accessibility behavior and report logic.
- `ui.js`: menu/widget rendering and interaction wiring. The menu is a
  header (title and close), a card with the Language and Profiles rows
  (each expands in place), one grid of option tiles, and a footer with the
  Reset button. Group names (Speech, Text, ...) are visually hidden headings
  inside the grid.
- `features/visual-filters.js`: cycling tiles (Contrast, Saturation,
  Readable Font, Font Size, Text to Speech) and their level dots.

## Development Notes

- Keep behavior parity with existing public API.
- If adding new styles, place them in `src/styles/*.css` and ensure registration still works.
