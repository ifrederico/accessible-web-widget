=== AccessibleWeb Widget ===
Contributors: ifrederico
Tags: accessibility, a11y, widget, contrast, text-to-speech
Requires at least: 5.0
Tested up to: 6.8
Requires PHP: 7.2
Stable tag: 1.1.4
License: MIT
License URI: https://opensource.org/licenses/MIT

Adds the AccessibleWeb accessibility widget to your site: font sizing, contrast modes, dyslexia-friendly font, text-to-speech, and more.

== Description ==

AccessibleWeb Widget is a small floating panel that gives your visitors accessibility controls they actually want — font sizing, contrast modes, a dyslexia-friendly font, animation pausing, text-to-speech, and more.

This plugin loads the widget from the jsDelivr CDN (pinned to version 1.1.4) and lets you configure its position, button size, and language from Settings > AccessibleWeb Widget.

Note: this widget is a complement to — not a substitute for — real accessibility work (semantic HTML, ARIA, keyboard navigation, alt text). It does not guarantee compliance with WCAG, ADA, Section 508, or any other standard.

== Installation ==

1. Upload the `accessible-web-widget` folder to `/wp-content/plugins/`, or install via the Plugins screen.
2. Activate the plugin through the Plugins screen in WordPress.
3. Go to Settings > AccessibleWeb Widget to configure position, size, and language.

== Frequently Asked Questions ==

= Does this make my site WCAG/ADA compliant? =

No. No overlay does. Use it as a convenience layer on top of a properly built, accessible site.

= Where does the script load from? =

From the jsDelivr CDN, pinned to a specific release: https://cdn.jsdelivr.net/gh/ifrederico/accessible-web-widget@1.1.4/dist/accessible-web-widget.min.js

== Changelog ==

= 1.1.4 =
* Initial plugin release, bundling widget version 1.1.4.
