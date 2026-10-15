import { test, expect } from '@playwright/test';

const readStates = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('accweb') || '{}').states || {});

// The accessible name and the tooltip of a cycling button always match.
const expectButtonName = async (button, name) => {
  await expect(button).toHaveAccessibleName(name);
  await expect(button).toHaveAttribute('title', name);
};

test('widget UI is encapsulated in a shadow root and survives hostile page CSS', async ({ page }) => {
  await page.goto('index.html');
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.textContent = 'button { display: none !important; } * { font-size: 7px !important; }';
    document.head.appendChild(style);
  });

  const hasShadowRoot = await page.evaluate(() => {
    const host = document.getElementById('acc-widget-host');
    return Boolean(host && host.shadowRoot);
  });
  expect(hasShadowRoot).toBe(true);

  const toggle = page.locator('.acc-toggle-btn');
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(page.locator('.acc-menu')).toBeVisible();
  await expect(page.locator('.acc-footer-reset')).toBeVisible();
});

test('profile applies and clears its bundled feature states', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  const profileBtn = page.locator('.acc-btn[data-key="profile-dyslexia"]');
  await expect(profileBtn).toBeVisible();
  await profileBtn.click();

  let states = await readStates(page);
  expect(states['profile-dyslexia']).toBe(true);
  expect(states['readable-text']).toBe('dyslexic');
  expect(states['line-spacing']).toBe(true);
  expect(states['letter-spacing']).toBe(true);
  await expect(profileBtn).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.acc-btn[data-key="line-spacing"]')).toHaveAttribute('aria-pressed', 'true');

  await profileBtn.click();
  states = await readStates(page);
  expect(states['profile-dyslexia']).toBe(false);
  // Bundled keys return to "no preference" instead of an explicit false, so
  // OS-level defaults keep working after a profile is tried and removed.
  expect(states['readable-text']).toBeUndefined();
  expect(states['line-spacing']).toBeUndefined();
  await expect(profileBtn).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.acc-btn[data-key="line-spacing"]')).toHaveAttribute('aria-pressed', 'false');
});

test('disabling a profile restores prior explicit user choices', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  await page.locator('.acc-btn[data-key="line-spacing"]').click();
  const profileBtn = page.locator('.acc-btn[data-key="profile-dyslexia"]');
  await profileBtn.click();
  await profileBtn.click();

  const states = await readStates(page);
  expect(states['line-spacing']).toBe(true);
  expect(states['readable-text']).toBeUndefined();
  await expect(page.locator('.acc-btn[data-key="line-spacing"]')).toHaveAttribute('aria-pressed', 'true');
});

test('disabling a profile keeps honoring the OS reduced-motion preference', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('index.html');

  await expect.poll(() => page.evaluate(() =>
    (JSON.parse(localStorage.getItem('accweb') || '{}').states || {})['pause-motion']
  )).toBe(true);

  await page.locator('.acc-toggle-btn').click();
  const profileBtn = page.locator('.acc-btn[data-key="profile-seizure-safe"]');
  await profileBtn.click();
  await profileBtn.click();

  const states = await readStates(page);
  expect(states['pause-motion']).toBe(true);
});

test('disabling a profile leaves a manually chosen color filter active', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  const profileBtn = page.locator('.acc-btn[data-key="profile-seizure-safe"]');
  await profileBtn.click();
  // Manually switch to a different color filter after the profile set its own.
  await page.locator('.acc-btn[data-key="contrast-toggle"]').click();
  let states = await readStates(page);
  expect(states['light-contrast']).toBe(true);
  expect(states['low-saturation']).toBe(false);

  await profileBtn.click();
  states = await readStates(page);
  expect(states['light-contrast']).toBe(true);
});

test('seizure safe profile activates the low saturation color filter', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  await page.locator('.acc-btn[data-key="profile-seizure-safe"]').click();
  const states = await readStates(page);
  expect(states['pause-motion']).toBe(true);
  expect(states['low-saturation']).toBe(true);
  await expect(page.locator('.acc-btn[data-key="saturation-toggle"]')).toHaveAttribute('data-saturation-mode', 'low-saturation');
});

test('toggles are announced through the aria-live region', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  await page.locator('.acc-btn[data-key="bold-text"]').click();
  const region = page.locator('#acc-live-region');
  await expect(region).toHaveText(/Font Weight On/);

  await page.locator('.acc-btn[data-key="bold-text"]').click();
  await expect(region).toHaveText(/Font Weight Off/);
});

test('mute sounds mutes existing and dynamically added media', async ({ page }) => {
  await page.goto('index.html');
  await page.evaluate(() => {
    const video = document.createElement('video');
    video.id = 'test-video';
    document.body.appendChild(video);
  });

  await page.locator('.acc-toggle-btn').click();
  await page.locator('.acc-btn[data-key="mute-sounds"]').click();

  await expect.poll(() => page.evaluate(() => document.getElementById('test-video').muted)).toBe(true);

  const dynamicMuted = await page.evaluate(async () => {
    const video = document.createElement('video');
    video.id = 'test-video-2';
    document.body.appendChild(video);
    await new Promise(resolve => setTimeout(resolve, 50));
    return video.muted;
  });
  expect(dynamicMuted).toBe(true);

  await page.locator('.acc-btn[data-key="mute-sounds"]').click();
  await expect.poll(() => page.evaluate(() => document.getElementById('test-video').muted)).toBe(false);
});

test('readable font cycles through dyslexic, legible, and lexend', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  const btn = page.locator('.acc-btn[data-key="readable-text"]');
  await btn.click();
  await expect(btn).toHaveAttribute('data-readable-font-mode', 'dyslexic');
  let states = await readStates(page);
  expect(states['readable-text']).toBe('dyslexic');
  expect(await page.evaluate(() =>
    document.documentElement.classList.contains('acc-readable-text'))).toBe(true);

  await btn.click();
  await expect(btn).toHaveAttribute('data-readable-font-mode', 'legible');
  await btn.click();
  await expect(btn).toHaveAttribute('data-readable-font-mode', 'lexend');
  states = await readStates(page);
  expect(states['readable-text']).toBe('lexend');

  await btn.click();
  await expect(btn).toHaveAttribute('data-readable-font-mode', 'off');
  states = await readStates(page);
  expect(states['readable-text']).toBe(false);
  expect(await page.evaluate(() =>
    document.documentElement.classList.contains('acc-readable-text'))).toBe(false);
});

test('legacy readable-text boolean state maps to the dyslexia font', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('accweb', JSON.stringify({ states: { 'readable-text': true } }));
  });
  await page.goto('index.html');
  await expect.poll(() => page.evaluate(() =>
    document.documentElement.classList.contains('acc-readable-text'))).toBe(true);
  await page.locator('.acc-toggle-btn').click();
  await expect(page.locator('.acc-btn[data-key="readable-text"]')).toHaveAttribute('data-readable-font-mode', 'dyslexic');
});

test('public API toggles the panel alongside the default button', async ({ page }) => {
  await page.goto('index.html');
  await page.evaluate(() => window.AccessibleWebWidget.instance.toggle());
  await expect(page.locator('.acc-menu')).toBeVisible();
  await page.evaluate(() => window.AccessibleWebWidget.instance.toggle());
  await expect(page.locator('.acc-menu')).toBeHidden();
});

test('hideButton removes the floating toggle and the public API drives the panel', async ({ page }) => {
  await page.goto('fixtures/hide-button.html');
  await expect(page.locator('.acc-toggle-btn')).toHaveCount(0);

  const opened = await page.evaluate(() => window.AccessibleWebWidget.instance.open());
  expect(opened).toBe(true);
  await expect(page.locator('.acc-menu')).toBeVisible();

  await page.evaluate(() => window.AccessibleWebWidget.instance.close());
  await expect(page.locator('.acc-menu')).toBeHidden();
});

test('stop animations pauses videos and freezes GIF images', async ({ page }) => {
  await page.goto('index.html');
  await page.evaluate(() => {
    const img = document.createElement('img');
    img.id = 'test-gif';
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    document.body.appendChild(img);
    const video = document.createElement('video');
    video.id = 'test-motion-video';
    // Sourceless videos report paused=true; fake playback so the pause
    // path (mark + pause) is exercised.
    Object.defineProperty(video, 'paused', { get: () => false, configurable: true });
    document.body.appendChild(video);
  });

  await page.locator('.acc-toggle-btn').click();
  await page.locator('.acc-btn[data-key="pause-motion"]').click();

  await expect.poll(() => page.evaluate(() =>
    document.getElementById('test-gif').getAttribute('data-acc-gif-frozen'))).toBe('true');
  const frozen = await page.evaluate(() => {
    const img = document.getElementById('test-gif');
    return {
      hidden: img.style.display === 'none',
      canvasNext: img.nextElementSibling?.tagName === 'CANVAS'
    };
  });
  expect(frozen.hidden).toBe(true);
  expect(frozen.canvasNext).toBe(true);
  await expect.poll(() => page.evaluate(() =>
    document.getElementById('test-motion-video').getAttribute('data-acc-motion-paused'))).toBe('true');

  await page.locator('.acc-btn[data-key="pause-motion"]').click();
  await expect.poll(() => page.evaluate(() =>
    document.getElementById('test-gif').getAttribute('data-acc-gif-frozen'))).toBe(null);
  const restored = await page.evaluate(() => {
    const img = document.getElementById('test-gif');
    return {
      display: img.style.display,
      canvasNext: img.nextElementSibling?.tagName === 'CANVAS'
    };
  });
  expect(restored.display).toBe('');
  expect(restored.canvasNext).toBe(false);
  await expect.poll(() => page.evaluate(() =>
    document.getElementById('test-motion-video').getAttribute('data-acc-motion-paused'))).toBe(null);
});

test('TTS page-level styles are registered at document level', async ({ page }) => {
  await page.goto('index.html');
  const staticCss = await page.evaluate(() => {
    const fromElement = document.getElementById('acc-static-styles')?.textContent || '';
    const fromAdopted = (document.adoptedStyleSheets || [])
      .map((sheet) => Array.from(sheet.cssRules).map((rule) => rule.cssText).join('\n'))
      .join('\n');
    return fromElement + fromAdopted;
  });
  // These selectors target light-DOM page content, so they must be
  // document-level (adopted stylesheet or <style> in <head>) — inside the
  // widget shadow root they can never match.
  expect(staticCss).toContain('.acc-tts-active-block');
  expect(staticCss).toContain('acc-tts-click-mode');
});

test('page structure panel lists headings and navigates to them', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  await page.locator('.acc-btn[data-key="page-structure"]').click();
  const panel = page.locator('.acc-structure-panel');
  await expect(panel).toBeVisible();
  // The menu closes when a panel opens so their focus traps never compete.
  await expect(page.locator('.acc-menu')).toBeHidden();
  const items = panel.locator('.acc-structure-item');
  expect(await items.count()).toBeGreaterThan(0);

  await items.first().click();
  await expect(panel).toBeHidden();
});

test('text magnifier shows enlarged text for hovered blocks', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  await page.locator('.acc-btn[data-key="text-magnifier"]').click();
  await page.keyboard.press('Escape');

  const paragraph = page.locator('main p, .container p, p').first();
  await paragraph.hover();
  const magnifier = page.locator('.acc-text-magnifier');
  await expect(magnifier).toHaveClass(/acc-visible/);
  expect((await magnifier.textContent()).length).toBeGreaterThan(0);
});

test('switching to Arabic flips the menu to RTL and back', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  await page.locator('.acc-header-lang-toggle').click();
  await page.locator('.acc-lang-item[data-lang="ar"]').click();
  await expect(page.locator('.acc-menu')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('#acc-current-language')).toHaveText('AR');

  await page.locator('.acc-header-lang-toggle').click();
  await page.locator('.acc-lang-item[data-lang="en"]').click();
  await expect(page.locator('.acc-menu')).toHaveAttribute('dir', 'ltr');
});

test('interaction options render as compact rows like the other sections', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  const rows = page.locator('.acc-option-category-interaction .acc-btn.acc-text-inline');
  await expect(rows).toHaveCount(4);
  await expect(page.locator('.acc-btn[data-key="large-pointer"]')).toBeVisible();
  const height = await page.locator('.acc-btn[data-key="mute-sounds"]').evaluate((el) => el.getBoundingClientRect().height);
  expect(height).toBeLessThan(70);
});

test('wheel scrolling past the end of the menu leaves the page in place', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  const box = await page.locator('.acc-menu-content').boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  for (let i = 0; i < 10; i++) {
    await page.mouse.wheel(0, 400);
  }

  await expect
    .poll(() => page.evaluate(() => document.getElementById('acc-widget-host').shadowRoot.querySelector('.acc-menu-content').scrollTop))
    .toBeGreaterThan(0);
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test('mouse clicks leave no focus ring while keyboard focus shows one', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  const option = page.locator('.acc-btn[data-key="line-spacing"]');
  await option.click();
  expect(await option.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe('none');

  await page.keyboard.press('Tab');
  const focusedOutline = await page.evaluate(() => {
    const active = document.getElementById('acc-widget-host').shadowRoot.activeElement;
    return active ? getComputedStyle(active).outlineStyle : '';
  });
  expect(focusedOutline).toBe('solid');
});

test('Escape closes the language list before the menu and keeps focus in the dialog', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  const languageToggle = page.locator('.acc-header-lang-toggle');
  const languageModal = page.locator('#acc-lang-modal');

  await languageToggle.click();
  await expect(languageModal).not.toHaveAttribute('hidden', '');
  await page.keyboard.press('Escape');
  await expect(languageModal).toHaveAttribute('hidden', '');
  await expect(page.locator('.acc-menu')).toBeVisible();
  await expect(languageToggle).toBeFocused();

  // Picking a language also hands focus back to the language button, and
  // the widget declares its UI language for screen readers.
  await languageToggle.click();
  await page.locator('.acc-lang-item[data-lang="es"]').click();
  await expect(languageToggle).toBeFocused();
  expect(await page.evaluate(() => document.getElementById('acc-widget-host').shadowRoot.querySelector('.acc-container').getAttribute('lang'))).toBe('es');

  await page.keyboard.press('Escape');
  await expect(page.locator('.acc-menu')).toBeHidden();
});

test('text magnifier banner is not capped at half the viewport', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  await page.locator('.acc-btn[data-key="text-magnifier"]').click();
  await page.keyboard.press('Escape');

  await page.locator('.hero-subtitle').hover();
  const magnifier = page.locator('.acc-text-magnifier');
  await expect(magnifier).toHaveClass(/acc-visible/);
  const box = await magnifier.boundingBox();
  const viewport = page.viewportSize();
  expect(box.width).toBeGreaterThan(viewport.width / 2);
});

test('landscape phones get a compact header and a one-row footer', async ({ page }) => {
  await page.setViewportSize({ width: 750, height: 342 });
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  const header = await page.locator('.acc-menu-header').boundingBox();
  const reset = await page.locator('.acc-footer-reset').boundingBox();
  const brand = await page.locator('.acc-footer-brand').boundingBox();
  const content = await page.locator('.acc-menu-content').boundingBox();
  expect(header.height).toBeLessThanOrEqual(48);
  expect(Math.abs((reset.y + reset.height / 2) - (brand.y + brand.height / 2))).toBeLessThan(2);
  expect(content.height).toBeGreaterThan(200);
});

test('closing by click leaves the toggle unringed; closing by keyboard keeps the ring', async ({ page }) => {
  await page.goto('index.html');
  const toggle = page.locator('.acc-toggle-btn');
  const ringState = () => toggle.evaluate((el) => ({
    focused: el.matches(':focus'),
    outline: getComputedStyle(el).outlineStyle
  }));

  await toggle.click();
  await page.locator('.acc-menu-close').click();
  expect(await ringState()).toEqual({ focused: true, outline: 'none' });

  await page.keyboard.press('Enter');
  await expect(page.locator('.acc-menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.acc-menu')).toBeHidden();
  expect(await ringState()).toEqual({ focused: true, outline: 'solid' });
});

test('cycling buttons name both the control and the active level', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  const region = page.locator('#acc-live-region');

  const controls = [
    { key: 'contrast-toggle', name: 'Contrast', levels: ['Light', 'Dark'] },
    { key: 'saturation-toggle', name: 'Saturation', levels: ['Low', 'High'] },
    { key: 'readable-text', name: 'Readable Font', levels: ['Dyslexia Font', 'Legible Font', 'Lexend'] }
  ];
  for (const { key, name, levels } of controls) {
    const button = page.locator(`.acc-btn[data-key="${key}"]`);
    await expectButtonName(button, name);
    for (const level of levels) {
      await button.click();
      await expectButtonName(button, `${name}: ${level}`);
      // The visible label still shows only the level.
      await expect(button.locator('.acc-label')).toHaveText(level);
      await expect(region).toHaveText(`${name}: ${level} On`);
    }
    await button.click();
    await expectButtonName(button, name);
    await expect(button.locator('.acc-label')).toHaveText(name);
    await expect(region).toHaveText(`${name} Off`);
  }
});

test('switching language re-translates both parts of a cycling button name', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  const contrast = page.locator('.acc-btn[data-key="contrast-toggle"]');
  const saturation = page.locator('.acc-btn[data-key="saturation-toggle"]');
  const readableFont = page.locator('.acc-btn[data-key="readable-text"]');
  const switchLanguage = async (code) => {
    await page.locator('.acc-header-lang-toggle').click();
    await page.locator(`.acc-lang-item[data-lang="${code}"]`).click();
  };

  await contrast.click();
  // Dyslexia Font → Legible Font → Lexend.
  for (let i = 0; i < 3; i++) {
    await readableFont.click();
  }
  await expectButtonName(contrast, 'Contrast: Light');
  await expectButtonName(readableFont, 'Readable Font: Lexend');

  await switchLanguage('es');
  await expectButtonName(contrast, 'Contraste: Claro');
  await expect(contrast.locator('.acc-label')).toHaveText('Claro');
  // Lexend is a font name and stays untranslated.
  await expectButtonName(readableFont, 'Fuente Legible: Lexend');
  await expectButtonName(saturation, 'Saturación');

  await contrast.click();
  await expectButtonName(contrast, 'Contraste: Oscuro');
  await expect(page.locator('#acc-live-region')).toHaveText('Contraste: Oscuro Activado');

  // A saturation level replaces the active contrast filter.
  await saturation.click();
  await expectButtonName(saturation, 'Saturación: Baja');
  await expectButtonName(contrast, 'Contraste');

  await switchLanguage('en');
  await expectButtonName(saturation, 'Saturation: Low');
  await expectButtonName(readableFont, 'Readable Font: Lexend');
  await expectButtonName(contrast, 'Contrast');
});

test('saved cycling levels are named in the configured language on load', async ({ page }) => {
  await page.addInitScript(() => {
    window.AccessibleWebWidgetOptions = { lang: 'es' };
    localStorage.setItem('accweb', JSON.stringify({
      states: { 'dark-contrast': true, 'readable-text': 'dyslexic' }
    }));
  });
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  await expectButtonName(page.locator('.acc-btn[data-key="contrast-toggle"]'), 'Contraste: Oscuro');
  await expectButtonName(page.locator('.acc-btn[data-key="readable-text"]'), 'Fuente Legible: Fuente para Dislexia');
  await expectButtonName(page.locator('.acc-btn[data-key="saturation-toggle"]'), 'Saturación');
});
