import { test, expect } from '@playwright/test';

const readStates = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('accweb') || '{}').states || {});

// Profile tiles live in the Profiles row of the top card, collapsed by default.
const openProfiles = (page) => page.locator('.acc-profiles-row').click();

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
  await expect(page.locator('.acc-action-reset')).toBeVisible();
});

test('profile applies and clears its bundled feature states', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  await openProfiles(page);

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
  await openProfiles(page);
  const profileBtn = page.locator('.acc-btn[data-key="profile-dyslexia"]');
  await profileBtn.click();
  await profileBtn.click();

  const states = await readStates(page);
  // The visitor's own pick, the first Line Height level, comes back.
  expect(states['line-spacing']).toBe(2);
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
  await openProfiles(page);
  const profileBtn = page.locator('.acc-btn[data-key="profile-seizure-safe"]');
  await profileBtn.click();
  await profileBtn.click();

  const states = await readStates(page);
  expect(states['pause-motion']).toBe(true);
});

test('disabling a profile leaves a manually chosen color filter active', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  await openProfiles(page);

  const profileBtn = page.locator('.acc-btn[data-key="profile-seizure-safe"]');
  await profileBtn.click();
  // Manually switch to a different color filter after the profile set its own.
  await page.locator('.acc-btn[data-key="invert-colors"]').click();
  let states = await readStates(page);
  expect(states['invert-colors']).toBe(true);
  expect(states['low-saturation']).toBe(false);

  await profileBtn.click();
  states = await readStates(page);
  expect(states['invert-colors']).toBe(true);
});

test('seizure safe profile activates the low saturation color filter', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  await openProfiles(page);

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

test('Dyslexia Font has its own tile; Readable Font steps through the other two fonts', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  const dyslexia = page.locator('.acc-btn[data-key="dyslexia-font"]');
  const btn = page.locator('.acc-btn[data-key="readable-text"]');
  await expect(dyslexia.locator('.acc-label')).toHaveText('Dyslexia Font');
  await expect(dyslexia).toHaveAttribute('aria-pressed', 'false');

  // Dyslexia Font: one click on, one click off.
  await dyslexia.click();
  await expect(dyslexia).toHaveAttribute('aria-pressed', 'true');
  await expect(btn).toHaveAttribute('data-readable-font-mode', 'off');
  await expect(page.locator('#acc-live-region')).toHaveText('Dyslexia Font On');
  let states = await readStates(page);
  expect(states['readable-text']).toBe('dyslexic');
  // The page changes once the font file is in (see combinations.spec.js).
  await expect(page.locator('html')).toHaveClass(/acc-readable-text/);
  expect(await page.locator('main p').first().evaluate((element) => window.getComputedStyle(element).fontFamily))
    .toContain('OpenDyslexic');
  await expect(page.locator('.acc-reset-count')).toHaveText('1');

  // One reading font at a time: picking another switches Dyslexia Font off.
  await btn.click();
  await expect(btn).toHaveAttribute('data-readable-font-mode', 'legible');
  await expect(dyslexia).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.acc-reset-count')).toHaveText('1');
  await btn.click();
  await expect(btn).toHaveAttribute('data-readable-font-mode', 'lexend');
  states = await readStates(page);
  expect(states['readable-text']).toBe('lexend');

  // And the other way round.
  await dyslexia.click();
  await expect(dyslexia).toHaveAttribute('aria-pressed', 'true');
  await expect(btn).toHaveAttribute('data-readable-font-mode', 'off');
  await expect(btn).toHaveAttribute('aria-pressed', 'false');
  await dyslexia.click();
  await expect(dyslexia).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('#acc-live-region')).toHaveText('Dyslexia Font Off');
  states = await readStates(page);
  expect(states['readable-text']).toBe(false);
  expect(await page.evaluate(() =>
    document.documentElement.classList.contains('acc-readable-text'))).toBe(false);

  // Readable Font alone: Legible Font, Lexend, off.
  await btn.click();
  await btn.click();
  await btn.click();
  await expect(btn).toHaveAttribute('data-readable-font-mode', 'off');
  expect((await readStates(page))['readable-text']).toBe(false);

  // The choice survives a reload, on the right tile.
  await dyslexia.click();
  await page.reload();
  await page.locator('.acc-toggle-btn').click();
  await expect(dyslexia).toHaveAttribute('aria-pressed', 'true');
  await expect(btn).toHaveAttribute('aria-pressed', 'false');
});

test('legacy readable-text boolean state maps to the dyslexia font', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('accweb', JSON.stringify({ states: { 'readable-text': true } }));
  });
  await page.goto('index.html');
  await expect.poll(() => page.evaluate(() =>
    document.documentElement.classList.contains('acc-readable-text'))).toBe(true);
  await page.locator('.acc-toggle-btn').click();
  await expect(page.locator('.acc-btn[data-key="dyslexia-font"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.acc-btn[data-key="readable-text"]')).toHaveAttribute('data-readable-font-mode', 'off');
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
  // The menu stays open behind the window (see combinations.spec.js).
  await expect(page.locator('.acc-menu')).toBeVisible();
  const items = panel.locator('.acc-structure-item');
  expect(await items.count()).toBeGreaterThan(0);

  // Picking a place closes the window; the menu stays (see
  // combinations.spec.js for the keyboard).
  await items.first().click();
  await expect(panel).toBeHidden();
  await expect(page.locator('.acc-menu')).toBeVisible();
});

test('page structure names landmarks in plain words, with their own names', async ({ page }) => {
  await page.goto('index.html');
  await page.evaluate(() => {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Related pages');
    nav.innerHTML = '<a href="#top">Top</a>';
    const article = document.createElement('article');
    article.innerHTML = '<header><p>An article has its own header</p></header>';
    document.querySelector('main').append(nav, article);
  });
  await page.locator('.acc-toggle-btn').click();
  await page.locator('.acc-btn[data-key="page-structure"]').click();

  const labels = await page.locator('.acc-structure-panel .acc-structure-item').allTextContents();
  expect(labels).toContain('Main content');
  expect(labels).toContain('Footer');
  expect(labels).toContain('Navigation: Related pages');
  // Tag names are not shown, and an article's header is not a page landmark.
  expect(labels).not.toContain('main');
  expect(labels).not.toContain('nav');
  expect(labels.filter((label) => label.startsWith('Header'))).toHaveLength(1);
});

test('page structure landmark names follow the menu language', async ({ page }) => {
  await page.addInitScript(() => {
    window.AccessibleWebWidgetOptions = { lang: 'es' };
  });
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  await page.locator('.acc-btn[data-key="page-structure"]').click();
  const labels = await page.locator('.acc-structure-panel .acc-structure-item').allTextContents();
  expect(labels).toContain('Contenido principal');
  expect(labels).toContain('Pie de página');
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

  await page.locator('.acc-lang-row').click();
  await page.locator('.acc-lang-item[data-lang="ar"]').click();
  await expect(page.locator('.acc-menu')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('#acc-current-language')).toHaveText('العربية');

  await page.locator('.acc-lang-row').click();
  await page.locator('.acc-lang-item[data-lang="en"]').click();
  await expect(page.locator('.acc-menu')).toHaveAttribute('dir', 'ltr');
});

test('interaction options close the tile grid, Big Cursor included on desktop', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  const keys = await page.locator('.acc-options .acc-btn').evaluateAll((tiles) => tiles.map((tile) => tile.dataset.key));
  expect(keys.slice(-4)).toEqual(['hide-images', 'large-pointer', 'pause-motion', 'mute-sounds']);
  await expect(page.locator('.acc-btn[data-key="large-pointer"]')).toBeVisible();
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
  const languageToggle = page.locator('.acc-lang-row');
  const languagePanel = page.locator('#acc-lang-panel');

  await languageToggle.click();
  await expect(languagePanel).not.toHaveAttribute('hidden', '');
  await page.keyboard.press('Escape');
  await expect(languagePanel).toHaveAttribute('hidden', '');
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

test('landscape phones get a compact header and a thin footer', async ({ page }) => {
  await page.setViewportSize({ width: 750, height: 342 });
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  const header = await page.locator('.acc-menu-header').boundingBox();
  const content = await page.locator('.acc-menu-content').boundingBox();
  const footer = await page.locator('.acc-footer').boundingBox();
  expect(header.height).toBeLessThanOrEqual(48);
  expect(footer.height).toBeLessThanOrEqual(52);
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
    { key: 'contrast-toggle', name: 'Contrast', levels: ['Smart Contrast', 'Dark Contrast', 'Light Contrast'] },
    { key: 'saturation-toggle', name: 'Saturation', levels: ['Low Saturation', 'High Saturation', 'Monochrome'] },
    { key: 'readable-text', name: 'Readable Font', levels: ['Legible Font', 'Lexend'] }
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
    await page.locator('.acc-lang-row').click();
    await page.locator(`.acc-lang-item[data-lang="${code}"]`).click();
  };

  await contrast.click();
  // Legible Font → Lexend.
  for (let i = 0; i < 2; i++) {
    await readableFont.click();
  }
  await expectButtonName(contrast, 'Contrast: Smart Contrast');
  await expectButtonName(readableFont, 'Readable Font: Lexend');

  await switchLanguage('es');
  await expectButtonName(contrast, 'Contraste: Contraste Inteligente');
  await expect(contrast.locator('.acc-label')).toHaveText('Contraste Inteligente');
  // Lexend is a font name and stays untranslated.
  await expectButtonName(readableFont, 'Fuente Legible: Lexend');
  await expectButtonName(saturation, 'Saturación');

  await contrast.click();
  await expectButtonName(contrast, 'Contraste: Contraste Oscuro');
  await expect(page.locator('#acc-live-region')).toHaveText('Contraste: Contraste Oscuro Activado');

  // Saturation is its own choice; the Contrast choice stays on beside it.
  await saturation.click();
  await expectButtonName(saturation, 'Saturación: Baja Saturación');
  await expectButtonName(contrast, 'Contraste: Contraste Oscuro');

  await switchLanguage('en');
  await expectButtonName(saturation, 'Saturation: Low Saturation');
  await expectButtonName(readableFont, 'Readable Font: Lexend');
  await expectButtonName(contrast, 'Contrast: Dark Contrast');
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

  await expectButtonName(page.locator('.acc-btn[data-key="contrast-toggle"]'), 'Contraste: Contraste Oscuro');
  await expectButtonName(page.locator('.acc-btn[data-key="dyslexia-font"]'), 'Fuente para Dislexia');
  await expect(page.locator('.acc-btn[data-key="dyslexia-font"]')).toHaveAttribute('aria-pressed', 'true');
  await expectButtonName(page.locator('.acc-btn[data-key="readable-text"]'), 'Fuente Legible');
  await expectButtonName(page.locator('.acc-btn[data-key="saturation-toggle"]'), 'Saturación');
});

test('the report lists each result as a card that opens on its own, with code to copy', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  // The audit engine from the repo, so the test needs no network.
  await page.addInitScript(() => {
    window.AccessibleWebWidgetOptions = { axeCoreUrl: '../platforms/wordpress/js/axe.min.js' };
  });
  await page.goto('audit.html?acc-dev=true');
  await page.locator('.acc-toggle-btn').click();
  await page.locator('.acc-btn[data-key="accessibility-report"]').click();

  const report = page.locator('.acc-report-panel.acc-report-visible');
  await expect(report.locator('.acc-report-stat')).toHaveCount(4);
  // What passed is the heading over the tiles, not a tile.
  await expect(report.locator('.acc-report-passed')).toContainText('Passed Tests');
  await expect(report.locator('.acc-report-header .acc-report-powered')).toHaveText('Powered by axe-core');

  // The page plants one image with no description for this demo.
  // The first section is the tiles; the results follow it.
  const cards = report.locator('.acc-report-section').nth(1).locator('.acc-report-violation');
  await expect(cards).toHaveCount(2);
  const first = cards.nth(0).locator('.acc-report-violation-header');
  const second = cards.nth(1).locator('.acc-report-violation-header');
  await expect(first).toHaveAttribute('aria-expanded', 'false');

  // Opening with the keyboard, and one card does not close another.
  await first.focus();
  await page.keyboard.press('Enter');
  await second.click();
  await expect(first).toHaveAttribute('aria-expanded', 'true');
  await expect(second).toHaveAttribute('aria-expanded', 'true');

  const code = cards.nth(0).locator('.acc-report-node-html');
  await expect(code).toContainText('acc-dev-demo-issue');
  await expect(code.locator('.acc-code-tag').first()).toHaveText('img');

  const copy = cards.nth(0).locator('.acc-report-copy');
  await copy.click();
  await expect(copy).toHaveAttribute('aria-label', 'Copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('acc-dev-demo-issue');
});
