# AccessibleWeb Widget

Most accessibility overlays promise to magically fix your site. This isn't that.

This is a small floating panel that gives your visitors controls they actually want — font sizing, contrast modes, a dyslexia-friendly font, animation pausing, text-to-speech, and more. Think of it as the browser's built-in accessibility settings, just easier to find.

Real accessibility means semantic HTML, proper ARIA, keyboard navigation, and alt text baked into your code. No widget replaces that work. We support the [Overlay Factsheet](https://overlayfactsheet.com/) and built this as a complement, not a substitute.

**[See the demo →](https://accessibleweb.pages.dev/)**

> **⚠️** This widget does not guarantee compliance with WCAG, ADA, Section 508, or any other standard. See the full [DISCLAIMER](DISCLAIMER.md).

## Quick start

Drop this into your HTML and you're done:

```html
<script src="https://cdn.jsdelivr.net/gh/ifrederico/accessible-web-widget@latest/dist/accessible-web-widget.min.js"></script>
```

It initializes on page load. No config needed.

To pin a specific version:

```html
<script src="https://cdn.jsdelivr.net/gh/ifrederico/accessible-web-widget@1.1.4/dist/accessible-web-widget.min.js"></script>
```

Or [self-host](docs/self-hosting.md) — just download `dist/accessible-web-widget.min.js` and serve it yourself.

## What you get

- **Text** — Font size, bold, line height, letter spacing
- **Color** — Contrast (light/dark), invert, saturation controls, high contrast
- **Reading** — OpenDyslexic font, reading guide, link/title highlighting, reader mode, text-to-speech
- **Interaction** — Large cursor, pause animations, hide images

Plus: 10 languages, persistent settings, system preference detection, keyboard accessible, and mobile friendly.

## Configuration

Everything below is optional. The widget works with zero config.

### Position and offset

```html
<div data-acc-position="bottom-right"></div>  <!-- default -->
<div data-acc-position="bottom-left"></div>
<div data-acc-position="top-left"></div>
<div data-acc-position="top-right"></div>

<div data-acc-offset="24,24"></div>   <!-- x, y in pixels -->
```

### Button size and language

```html
<div data-acc-size="44"></div>        <!-- px, rem, or any CSS unit -->
<div data-acc-lang="en"></div>
<div data-acc-icon="default"></div>   <!-- default | icon-2 | icon-3 | icon-4 -->
```

### Text-to-speech voices

TTS uses native browser voices. When enabled, visitors click any text block to hear it read aloud.

```html
<script>
  window.AccessibleWebWidgetOptions = {
    ttsNativeVoiceName: "Samantha",  // best-effort match
    ttsNativeVoiceLang: "en-US",
    ttsRate: 1.0,                    // 0.5 – 2.0
    ttsPitch: 1.0                    // 0 – 2.0
  };
</script>
```

### Dev tools

Add `?acc-dev=true` to any page URL to get inline annotation markers and a full accessibility report powered by axe-core. Useful for development, not meant for production.

## Browser support

Chrome/Edge 88+, Firefox 78+, Safari 14+, iOS Safari 14+, Chrome for Android.

## Contributing

Want to help? See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, testing, and how to submit a PR.

## Bugs

[Open an issue](https://github.com/ifrederico/accessible-web-widget/issues) — include your browser/version, repro steps, expected vs. actual behavior, and screenshots if you can.

## License

MIT — see [LICENSE](LICENSE).

## Acknowledgments

- Icons: [Google Material Icons](https://fonts.google.com/icons)
- Font: [OpenDyslexic](https://opendyslexic.org/) by Abbie Gonzalez
