import { test, expect } from '@playwright/test';

const readStates = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('accweb') || '{}').states || {});

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
  expect(states['readable-text']).toBe(true);
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
