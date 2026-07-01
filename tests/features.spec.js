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
  expect(states['readable-text']).toBe(false);
  expect(states['line-spacing']).toBe(false);
  await expect(profileBtn).toHaveAttribute('aria-pressed', 'false');
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

test('page structure panel lists headings and navigates to them', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  await page.locator('.acc-btn[data-key="page-structure"]').click();
  const panel = page.locator('.acc-structure-panel');
  await expect(panel).toBeVisible();
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

  await page.locator('.acc-footer-lang-toggle').click();
  await page.locator('.acc-lang-item[data-lang="ar"]').click();
  await expect(page.locator('.acc-menu')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('#acc-current-language')).toHaveText('AR');

  await page.locator('.acc-footer-lang-toggle').click();
  await page.locator('.acc-lang-item[data-lang="en"]').click();
  await expect(page.locator('.acc-menu')).toHaveAttribute('dir', 'ltr');
});
