# Implementation Plan: 6 New Features for AccessibleWeb Widget
 
## Architecture Context
 
- **Stack**: Vanilla JS (ES2022+), Rollup IIFE bundle, zero runtime deps
- **Pattern**: Mixin architecture — `index.js` (class + config) → `state.js`, `styles.js`, `features.js`, `ui.js`
- **CSS**: Imported as strings via rollup-plugin-string, injected at runtime
- **Persistence**: localStorage / cookie under `accweb` key
- **i18n**: 10 languages in `translations.js`
- **Tests**: Playwright smoke tests
- **Build**: `npm run build` → dist files are committed
 
## Implementation Order
 
Features ordered by dependency chain and complexity:
 
---
 
### Feature 6 (first): Auto-detect System Preferences
 
**Why first**: Foundational — affects initialization flow, all other features benefit.
 
**Files to modify**:
- `src/features.js` — add `detectSystemPreferences()` and `setupMediaQueryListeners()`
- `src/ui.js` — call detection in `startAccessibleWebWidget()` before applying saved state
- `src/state.js` — add helper to check if user has explicitly set a preference
 
**Logic**:
1. On init, read media queries:
   - `prefers-reduced-motion: reduce` → enable `pause-motion`
   - `prefers-color-scheme: dark` → enable `dark-contrast`
   - `prefers-contrast: more` → enable `dark-contrast`
2. **User overrides always win**: if saved config has an explicit value for a key (even `false`), don't override it
3. Register `MediaQueryList.addEventListener('change', ...)` for live updates
4. Cleanup listeners on reset
 
**State strategy**: Add a `systemDefaults` object to config alongside `states`. When system preference triggers a feature, set it in `states` but also record it came from system. If user explicitly toggles, it becomes a user override and system can't change it back.
 
---
 
### Feature 1: Violation Count Bubble on Toggle Button
 
**Files to modify**:
- `src/features.js` — add `runBackgroundAxeScan()`, `updateViolationBubble()`
- `src/ui.js` — modify `displayWidget()` to add bubble element to toggle button
- `src/styles/widget.css` — add bubble styles (positioned badge)
- `src/constants/icons.js` — no new icons needed (just a colored circle)
 
**Logic**:
1. After widget renders (`displayWidget`), trigger a background axe scan
2. Load axe-core (reuse existing `loadAxeCore()`)
3. Run `axe.run()` with same ruleset as report
4. Count violations by severity:
   - Any `critical` or `serious` → **red** bubble, total count
   - Only `moderate` or `minor` → **yellow** bubble, total count
   - Zero violations → **no bubble** (element hidden or removed)
5. Bubble is a small `<span>` absolutely positioned on the toggle button
6. Re-scan when accessibility report is opened (reuse results)
7. Store last scan results on `this.axeScanResults` for annotation feature
 
**CSS** (in widget.css):
```css
.acc-violation-bubble {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  pointer-events: none;
  z-index: 1;
}
.acc-violation-bubble[data-severity="critical"] { background: #d32f2f; }
.acc-violation-bubble[data-severity="warning"] { background: #f9a825; color: #222; }
.acc-violation-bubble[hidden] { display: none; }
```
 
---
 
### Feature 2: Inline Page Annotations
 
**Files to modify**:
- `src/features.js` — add `enableAnnotations()`, `disableAnnotations()`, `createAnnotationMarker()`, `positionAnnotations()`
- `src/ui.js` — add tool button, handle toggle
- `src/index.js` — add to `accessTools` array
- `src/constants/icons.js` — add annotation icon (pin/flag SVG)
- `src/constants/translations.js` — add translation keys for all 10 languages
- `src/styles/` — add `annotations.css`
- `src/styles.js` — import and register annotations CSS
 
**Logic**:
1. New tool: "Page Annotations" — toggle button in Tools section
2. On enable:
   - Use `this.axeScanResults` from Feature 1 (or run scan if not available)
   - For each violation node, create a small colored marker (pin icon) positioned near the element
   - Marker color matches severity (red/orange/yellow/blue)
   - Click marker → popup with: violation title, description, "How to Fix" link
   - Popup is dismissable (click outside or X button)
3. On disable: remove all annotation markers and popups
4. Handle scroll/resize: use `IntersectionObserver` + throttled repositioning
5. Limit to first 50 annotations to avoid performance issues
6. Markers are absolutely positioned in a container that doesn't interfere with page layout
 
**Annotations CSS**: Markers, popup tooltip, severity colors, z-index layering
 
---
 
### Feature 3: Text-to-Speech
 
**Files to modify**:
- `src/features.js` — add `enableTextToSpeech()`, `pauseSpeech()`, `resumeSpeech()`, `stopSpeech()`, `getReadableContent()`
- `src/ui.js` — add tool button, TTS control bar when active
- `src/index.js` — add to `accessTools`, add TTS state properties
- `src/constants/icons.js` — add play, pause, stop icons
- `src/constants/translations.js` — add keys: "Text to Speech", "Play", "Pause", "Stop", "Reading..."
- `src/styles/` — add `tts.css` for the floating control bar
 
**Logic**:
1. New tool: "Text to Speech" — toggle button in Tools section
2. On enable:
   - Collect readable text from page using `document.querySelectorAll('main, article, [role="main"], .content, body')` — prioritize semantic content containers
   - Create `SpeechSynthesisUtterance` with detected text
   - Set `lang` to match widget's current language setting
   - Show floating control bar with play/pause/stop
3. Controls:
   - **Play**: start/resume speaking
   - **Pause**: `speechSynthesis.pause()`
   - **Stop**: `speechSynthesis.cancel()` + hide control bar
4. Events: `onend` → auto-hide bar, `onpause`/`onresume` → update button states
5. On disable (or widget close): `speechSynthesis.cancel()`
6. Edge case: check `'speechSynthesis' in window` — hide button if unsupported
 
**TTS control bar**: Fixed position bar below the widget button, minimal UI
 
---
 
### Feature 4: Focus Mode
 
**Files to modify**:
- `src/features.js` — add `enableFocusMode()`, `disableFocusMode()`, `focusNextSection()`, `focusPrevSection()`
- `src/ui.js` — add tool button
- `src/index.js` — add to `accessTools`, add focus mode state
- `src/constants/icons.js` — add focus/spotlight icon
- `src/constants/translations.js` — add keys: "Focus Mode", "Press Escape to exit focus mode"
- `src/styles/` — add `focus-mode.css`
 
**Logic**:
1. New tool: "Focus Mode" — toggle in Tools section
2. On enable:
   - Identify "sections" on the page: `section`, `article`, `main > *`, `[role="region"]`, or fall back to top-level block children of `main`/`body`
   - Create a semi-transparent overlay covering the full page
   - "Cut out" the current section by giving it elevated z-index + relative positioning + removing opacity
   - Add keyboard handler: Tab/arrow keys to move to next/prev section, ESC to exit
   - Visual indicator: subtle border or glow on focused section
3. On section change:
   - Transition the spotlight to the new section
   - Scroll section into view (`scrollIntoView({ behavior: 'smooth', block: 'center' })`)
4. On ESC or disable: remove overlay, restore all z-index/positioning, remove keyboard handler
5. Persist state (on/off) but not which section was focused
 
**Focus mode CSS**: Overlay, section highlight, transition animations (respecting prefers-reduced-motion)
 
---
 
### Feature 5: Simplify Layout
 
**Files to modify**:
- `src/features.js` — add `enableSimpleLayout()`, `disableSimpleLayout()`
- `src/ui.js` — add tool button
- `src/index.js` — add to `accessTools`
- `src/constants/icons.js` — add simplify/layout icon
- `src/constants/translations.js` — add keys: "Simplify Layout"
 
**Logic**:
1. New tool: "Simplify Layout" — toggle in Tools section
2. On enable, inject CSS that:
   - Forces single-column: `body > *:not(.acc-container) { max-width: 720px; margin-left: auto; margin-right: auto; float: none; position: static; }`
   - Removes decorative elements: `[role="presentation"], [aria-hidden="true"]:not(.acc-container *), .decorative, aside:not(main aside) { display: none; }`
   - Linearizes flex/grid: `* { display: block; flex-direction: column; }`  (carefully scoped)
   - Normalizes text: readable font-size minimum, consistent line-height
   - Hides background images: `* { background-image: none; }`
3. On disable: remove the injected style sheet, layout restores instantly
4. Use `applyToolStyle()` pattern for consistency
5. Careful scoping: exclude `.acc-container`, `.acc-menu`, `.acc-widget` from all rules
 
**No new CSS file needed** — uses the existing `injectStyle()` + `applyToolStyle()` pattern like other features.
 
---
 
## Cross-cutting Concerns
 
### Icons (src/constants/icons.js)
New SVG icons needed (Material Icons style, 24x24 viewBox):
- `annotations` — pin/marker icon for page annotations
- `textToSpeech` — speaker/volume icon for TTS
- `focusMode` — spotlight/center-focus icon
- `simplifyLayout` — view-agenda/single-column icon
 
### Translations (src/constants/translations.js)
New keys to add across all 10 languages:
- "Page Annotations", "Text to Speech", "Focus Mode", "Simplify Layout"
- "Play", "Pause", "Stop", "Reading..."
- "Press Escape to exit focus mode"
 
### State & Persistence
All new toggleable features persist to localStorage via the existing `updateState()` / `applyEnhancements()` flow:
- `annotations` → boolean
- `text-to-speech` → boolean
- `focus-mode` → boolean
- `simple-layout` → boolean
 
`applyEnhancements()` in features.js needs entries for each new feature.
`resetEnhancements()` needs cleanup for each new feature.
 
### Testing
Add Playwright smoke tests for:
- Violation bubble appears/doesn't appear
- Annotation markers render when toggled
- TTS button hidden when speechSynthesis unavailable
- Focus mode overlay appears and ESC dismisses
- Simplify layout forces single-column
- System preferences detection (mock media queries)
 
### Build
- Register any new CSS files in `src/styles.js` imports
- Run `npm run build` after all changes
- Run `npm run ci` to verify lint + build + tests pass
 
---
 
## File Change Summary
 
| File | Changes |
|------|---------|
| `src/index.js` | Add new tools to `accessTools`, new state properties |
| `src/features.js` | All 6 feature implementations |
| `src/ui.js` | Bubble rendering, TTS control bar, init flow changes |
| `src/state.js` | System preference helpers |
| `src/styles.js` | Import new CSS files |
| `src/constants/icons.js` | 4 new SVG icons |
| `src/constants/translations.js` | New keys in all 10 languages |
| `src/styles/widget.css` | Bubble styles |
| `src/styles/annotations.css` | NEW — annotation markers & popups |
| `src/styles/tts.css` | NEW — TTS control bar |
| `src/styles/focus-mode.css` | NEW — focus mode overlay & highlight |
| `tests/smoke.spec.js` | New test cases |