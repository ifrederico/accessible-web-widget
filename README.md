# AccessibleWeb Widget

A lightweight, customizable accessibility widget that helps make websites more accessible to all users. This widget provides various tools to improve readability and usability for people with different accessibility needs.

**⚠️ IMPORTANT: Please read the [DISCLAIMER](DISCLAIMER.md) before using this widget.**

## Features

- 🔍 **Text Adjustments**: Font size scaling (3 levels), bold text, line height, letter spacing
- 🎨 **Color Adjustments**: Dark contrast, light contrast, invert colors, high/low saturation, monochrome
- 📖 **Reading Tools**: Dyslexia-friendly font, reading guide, highlight links/titles
- 🛠️ **Interaction Tools**: Large cursor, pause animations, hide images
- 🌍 **Multi-language Support**: Expandable language system
- 💾 **Persistent Settings**: Saves user preferences across sessions
- ⌨️ **Keyboard Accessible**: Full keyboard navigation support
- 📱 **Mobile Friendly**: Responsive design for all devices

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
<script src="https://cdn.jsdelivr.net/gh/ifrederico/accessible-web-widget@1.0.0/dist/accessible-web-widget.min.js"></script>
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

### Language

Set the default language:

```html
<div data-acc-lang="en"></div>
```

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

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons from Google Material Icons
- OpenDyslexic font by Abbie Gonzalez
- Inspired by the need for better web accessibility

## Version History

- **1.0.0** - Initial release with core accessibility features

---

**Remember**: This widget is one part of making your website accessible. Always test your entire website with screen readers and accessibility tools, and consult with accessibility professionals for comprehensive compliance.