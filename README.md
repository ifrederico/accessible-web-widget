# AccessibleWeb Widget

A lightweight, customizable accessibility widget that helps make websites more accessible to all users. This widget provides various tools to improve readability and usability for people with different accessibility needs.

**⚠️ IMPORTANT: Please read the [DISCLAIMER](DISCLAIMER.md) before using this widget.**

## Purpose

This widget provides user preference controls that allow website visitors to adjust visual and interactive elements according to their needs. Features include font size adjustment, contrast options, reading guides, and animation controls.

## Scope & Limitations

This widget provides user-facing customization tools. It does not provide, ensure, or guarantee accessibility compliance with WCAG, ADA, Section 508, or any other accessibility standards.

Website accessibility requires proper semantic HTML, ARIA implementation, keyboard navigation, alternative text, and other fundamental development practices that must be implemented at the code level.

## Features

- 🔍 **Text Adjustments**: Font size scaling (3 levels), bold text, line height, letter spacing
- 🎨 **Color Adjustments**: Dark contrast, light contrast, invert colors, high/low saturation, monochrome
- 📖 **Reading Tools**: Dyslexia-friendly font, reading guide, highlight links/titles
- 🛠️ **Interaction Tools**: Large cursor, pause animations, hide images
- 🌍 **Multi-language Support**: Expandable language system
- 💾 **Persistent Settings**: Saves user preferences across sessions
- ⌨️ **Keyboard Accessible**: Full keyboard navigation support
- 📱 **Mobile Friendly**: Responsive design for all devices

### Important Distinction

This widget provides user preference controls (like font size, contrast, etc.) similar to browser settings. It is NOT an automated accessibility overlay that claims to fix compliance issues. 

We strongly support the accessibility community's position outlined in the [Overlay Factsheet](https://overlayfactsheet.com/). Proper accessibility must be built into websites from the ground up, not added as an afterthought.

## Quick Start

Add this single line to your website's HTML:

```html
<script src="https://cdn.jsdelivr.net/gh/ifrederico/accessible-web-widget@latest/dist/accessible-web-widget.min.js"></script>
```

The widget will automatically initialize when the page loads.

## Installation Methods

### Method 1: CDN (Recommended)

Always get the latest version:
```html
<script src="https://cdn.jsdelivr.net/gh/ifrederico/accessible-web-widget@latest/dist/accessible-web-widget.min.js"></script>
```

Or use a specific version:
```html
<script src="https://cdn.jsdelivr.net/gh/ifrederico/accessible-web-widget@1.1.0/dist/accessible-web-widget.min.js"></script>
```

### Method 2: Download

1. Download `accessible-web-widget.min.js` from the `dist` folder
2. Upload to your website
3. Add to your HTML:
```html
<script src="/path/to/accessible-web-widget.min.js"></script>
```

## Configuration

### Widget Position

Control where the widget button appears:

```html
<!-- Default: bottom-left -->
<div data-acc-position="bottom-left"></div>

<!-- Other options: -->
<div data-acc-position="bottom-right"></div>
<div data-acc-position="top-left"></div>
<div data-acc-position="top-right"></div>
<div data-acc-position="center-left"></div>
```

### Widget Offset

Control X/Y offset in pixels from the selected position:

```html
<!-- x, y -->
<div data-acc-offset="24,24"></div>

<!-- single value applies to both x and y -->
<div data-acc-offset="16"></div>
```

### Widget Button Size

Control the launcher button size:

```html
<!-- numeric values are interpreted as px -->
<div data-acc-size="44"></div>

<!-- units are also supported -->
<div data-acc-size="2.75rem"></div>
```

### Language

Set the default language:

```html
<div data-acc-lang="en"></div>
```

### Dev Mode (Accessibility Report)

To expose the built-in axe-core report tool in the widget menu, add `?acc-dev=true` to the page URL.

Example:
`https://example.com/?acc-dev=true`

## Development

Source entrypoint for contributors is `src/index.js`.

Architecture summary:

- Source code is modular under `src/` (not a single source file anymore)
- Rollup builds IIFE bundles into `dist/`
- Production/browser usage should consume files from `dist/`
- Dist artifacts are committed intentionally for release/CDN workflows

Install dependencies:

```bash
npm install
```

Build distributable files:

```bash
npm run build
```

Watch mode for local development:

```bash
npm run dev
```

Run smoke tests:

```bash
npm run test:smoke
```

Run full local CI flow:

```bash
npm run ci
```

Build outputs:

- `dist/accessible-web-widget.js` (IIFE, unminified)
- `dist/accessible-web-widget.min.js` (IIFE, minified)
- `dist/accessible-web-widget.min.js.map` (minified sourcemap)

Local demo after building:

```bash
npx http-server . -p 4173 -c-1
```

Then open:

- `http://127.0.0.1:4173/examples/index.html`
- `http://127.0.0.1:4173/examples/index.html?acc-dev=true`

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- iOS Safari 14+
- Chrome for Android

## Demo

View a live demo: [https://ifrederico.github.io/accessible-web-widget/examples/](https://ifrederico.github.io/accessible-web-widget/examples/)

## Legal Disclaimer

**THIS SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND.** 

Please read the full [DISCLAIMER](DISCLAIMER.md) for important legal information including:
- Limitations of liability
- No guarantee of accessibility compliance
- Your responsibilities as a user
- Indemnification terms

**This widget is a tool to assist with accessibility but does not guarantee compliance with WCAG, ADA, Section 508, or any other accessibility standards.**

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Reporting Issues

Found a bug? Please [open an issue](https://github.com/ifrederico/accessible-web-widget/issues) with:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## License
MIT License. This software is provided "as is" without warranty of any kind, express or implied. See [LICENSE](LICENSE) file for complete terms.

## Acknowledgments

- Icons from Google Material Icons
- OpenDyslexic font by Abbie Gonzalez
- Inspired by the need for better web accessibility

**Remember**: This widget is one part of making your website accessible. Always test your entire website with screen readers and accessibility tools, and consult with accessibility professionals for comprehensive compliance.
