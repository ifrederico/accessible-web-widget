# AccessibleWeb Widget

A small, customizable accessibility widget you can drop into any website. It gives visitors controls to adjust font size, contrast, reading guides, animations, and more.

**⚠️ Please read the [DISCLAIMER](DISCLAIMER.md) before using this widget.**

## What this is (and isn't)

This widget adds a floating panel with preference controls - font sizing, contrast modes, a dyslexia-friendly font, animation pausing, etc. It's similar to what users might find in browser accessibility settings, just more convenient.

It is **not** an automated accessibility overlay that claims to fix compliance issues. Real accessibility requires semantic HTML, ARIA, keyboard navigation, alt text, and other fundamentals built into your code. No widget replaces that.

We support the accessibility community's stance in the [Overlay Factsheet](https://overlayfactsheet.com/). Build accessibility in from the start; use tools like this as a complement, not a substitute.

## Features

- **Text** - Font size (3 levels), bold, line height, letter spacing
- **Color** - Dark/light contrast, invert, high/low saturation, monochrome, high contrast mode
- **Reading** - Dyslexia-friendly font (OpenDyslexic), reading guide, link/title highlighting, simplify layout (reader mode), text-to-speech (native browser voices)
- **Interaction** - Large cursor, pause animations, hide images
- **Dev tools** - Inline annotation markers and full accessibility report via axe-core (enable with `?acc-dev=true`)
- **Other** - 10 languages, persistent settings, system preference detection, keyboard accessible, mobile friendly

## Quick start

```html
<script src="https://cdn.jsdelivr.net/gh/ifrederico/accessible-web-widget@latest/dist/accessible-web-widget.min.js"></script>
```

The widget initializes on page load. No config required.

## Installation

### Pin a specific version

```html
<script src="https://cdn.jsdelivr.net/gh/ifrederico/accessible-web-widget@1.1.2/dist/accessible-web-widget.min.js"></script>
```

### Self-host

1. Download `accessible-web-widget.min.js` from `dist/`
2. Host it yourself
3. Add it:

```html
<script src="/path/to/accessible-web-widget.min.js"></script>
```

## Release checklist (for jsDelivr)

To make versioned CDN URLs work (for example `@1.1.2`), publish a matching Git tag:

1. Run `npm run build`
2. Commit `dist/` changes
3. Create and push a version tag (example): `git tag v1.1.2 && git push origin v1.1.2`

jsDelivr will then resolve:

```html
<script src="https://cdn.jsdelivr.net/gh/ifrederico/accessible-web-widget@1.1.2/dist/accessible-web-widget.min.js"></script>
```

## Configuration

All optional, via `data-` attributes on a `<div>`.

### Position

```html
<div data-acc-position="bottom-left"></div>   <!-- default -->
<div data-acc-position="bottom-right"></div>
<div data-acc-position="top-left"></div>
<div data-acc-position="top-right"></div>
<div data-acc-position="center-left"></div>
```

### Offset

```html
<div data-acc-offset="24,24"></div>   <!-- x, y in pixels -->
<div data-acc-offset="16"></div>      <!-- single value for both -->
```

### Button size

```html
<div data-acc-size="44"></div>        <!-- px -->
<div data-acc-size="2.75rem"></div>   <!-- CSS units work too -->
```

### Language

```html
<div data-acc-lang="en"></div>
```

### Dev mode

Append `?acc-dev=true` to the page URL to expose a built-in axe-core report in the widget menu.
The widget loads a pinned `axe-core` build (`4.11.1`) from jsDelivr for stable results.

### Native voice tuning

`Text to Speech` uses native browser voices only.
When enabled, it waits for the user to click any text block (`h1`-`h6`, `p`, `li`, `div`, `section`, etc.) and reads it aloud.

```html
<script>
  window.AccessibleWebWidgetOptions = {
    ttsNativeVoiceName: "Samantha",  // best-effort match by name
    ttsNativeVoiceLang: "en-US",     // optional language preference
    ttsRate: 1.0,                    // 0.5 - 2.0
    ttsPitch: 1.0                    // 0 - 2.0
  };
</script>
```

## Browser support

Chrome/Edge 88+, Firefox 78+, Safari 14+, iOS Safari 14+, Chrome for Android.

## Demo

[https://accessibleweb.pages.dev/](https://accessibleweb.pages.dev/)

## Legal

**Provided "as is" without warranty of any kind.** This widget does not guarantee compliance with WCAG, ADA, Section 508, or any other standard. See the full [DISCLAIMER](DISCLAIMER.md).

## Contributing

Want to help out? See [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions and how to submit changes.

## Bugs

[Open an issue](https://github.com/ifrederico/accessible-web-widget/issues) with browser/version, repro steps, expected vs. actual behavior, and screenshots if possible.

## License

MIT - see [LICENSE](LICENSE).

## Acknowledgments

- Icons: [Google Material Icons](https://fonts.google.com/icons)
- Font: [OpenDyslexic](https://opendyslexic.org/) by Abbie Gonzalez
