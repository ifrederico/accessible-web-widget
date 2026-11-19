# src/styles/

CSS for widget/menu/report/reading guide/skip link.

## Files

- `menu.css`
- `widget.css`
- `report.css`
- `reading-guide.css`
- `skip-link.css`
- `annotations.css`

## Menu layout (`menu.css`)

- `.acc-card` holds the Language and Profiles rows (`.acc-card-row`) and
  their in-place panels (`.acc-card-panel`).
- `.acc-options` is the tile grid: three columns, two below a ~380px panel.
  `.acc-btn` is a tile; `.acc-selected` adds the primary color and the check badge
  (`::before`/`::after`). `.acc-sr-only` hides the group headings visually.
- `.acc-footer-reset` is the quiet pill with `.acc-reset-count`.

## Conventions

- Use CSS variables provided by runtime (`--acc-*`) for themeable values.
- Avoid embedding CSS in JS templates; update these files instead.
