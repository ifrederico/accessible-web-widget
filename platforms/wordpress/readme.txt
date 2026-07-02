=== AccessibleWeb Widget ===
Contributors: ifrederico
Tags: accessibility, a11y, widget, contrast, text-to-speech
Requires at least: 5.0
Tested up to: 6.8
Requires PHP: 7.2
Stable tag: 1.3.1
License: MIT
License URI: https://opensource.org/licenses/MIT

Adds the AccessibleWeb accessibility widget to your site: font sizing, contrast modes, dyslexia-friendly font, text-to-speech, and more.

== Description ==

AccessibleWeb Widget is a small floating panel that gives your visitors accessibility controls they actually want — font sizing, contrast modes, a dyslexia-friendly font, animation pausing, text-to-speech, and more.

This plugin loads the widget from the jsDelivr CDN (pinned to version 1.3.1) and lets you configure its position, button size, and language from Settings > AccessibleWeb Widget.

Note: this widget is a complement to — not a substitute for — real accessibility work (semantic HTML, ARIA, keyboard navigation, alt text). It does not guarantee compliance with WCAG, ADA, Section 508, or any other standard.

== Installation ==

1. Upload the `accessible-web-widget` folder to `/wp-content/plugins/`, or install via the Plugins screen.
2. Activate the plugin through the Plugins screen in WordPress.
3. Go to Settings > AccessibleWeb Widget to configure position, size, and language.

== Frequently Asked Questions ==

= Does this make my site WCAG/ADA compliant? =

No. No overlay does. Use it as a convenience layer on top of a properly built, accessible site.

= Where does the script load from? =

From the jsDelivr CDN, pinned to a specific release: https://cdn.jsdelivr.net/gh/ifrederico/accessible-web-widget@1.3.1/dist/accessible-web-widget.min.js

== Changelog ==

= 1.3.1 =
* Fixes the menu opening on the right side when the widget button is positioned bottom-left or top-left; the panel now docks to the button's edge.
* Adds an optional menuPosition ('left' or 'right') setting to override the docking side independently of the button position.

= 1.3.0 =
* Bundles widget version 1.3.0: the menu now opens as a full-height side panel with an "Accessibility Options" header, the language picker beside the close button, one-tap profiles as toggle switches, and a roughly 20% wider layout.
* Improved keyboard and screen-reader behavior: opening the menu focuses the dialog itself and the focus trap handles Shift+Tab from the dialog.

= 1.2.0 =
* Bundles widget version 1.2.0: accessibility profiles, page structure navigator, text magnifier, mute sounds, Shadow DOM UI, RTL layout with Arabic and Hebrew, and pt-BR translations.
* Regional language codes such as "pt-BR" now resolve to the matching dictionary instead of falling back to English.

= 1.1.4 =
* Initial plugin release, bundling widget version 1.1.4.
