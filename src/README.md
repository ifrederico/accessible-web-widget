# src/

Modular widget implementation.

## Important Files

- `index.js`: main class, module composition, auto-init, global export.
- `state.js`: persistence, cookies/localStorage, language/default resolution.
- `styles.js`: style utilities, theme CSS variables, static CSS registration.
- `features.js`: accessibility behavior and report logic.
- `ui.js`: menu/widget rendering and interaction wiring.

## Development Notes

- Keep behavior parity with existing public API.
- If adding new styles, place them in `src/styles/*.css` and ensure registration still works.
