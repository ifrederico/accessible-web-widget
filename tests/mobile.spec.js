import { test, expect, devices } from '@playwright/test';

// Touch-only phone: coarse pointer, no hover, real touch events.
const phone = devices['Pixel 7'];
test.use({
  viewport: phone.viewport,
  userAgent: phone.userAgent,
  deviceScaleFactor: phone.deviceScaleFactor,
  isMobile: phone.isMobile,
  hasTouch: phone.hasTouch
});

const readScroll = (page) => page.evaluate(() => ({
  menu: document.getElementById('acc-widget-host').shadowRoot.querySelector('.acc-menu-content').scrollTop,
  page: window.scrollY
}));

const touchScroll = async (page, x, y, yDistance) => {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Input.synthesizeScrollGesture', {
    x: Math.round(x),
    y: Math.round(y),
    yDistance,
    gestureSourceType: 'touch',
    speed: 3000
  });
};

test('phone menu keeps compact two-column rows', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').tap();
  const menu = page.locator('.acc-menu');
  await expect(menu).toBeVisible();

  const first = await page.locator('.acc-btn[data-key="profile-seizure-safe"]').boundingBox();
  const second = await page.locator('.acc-btn[data-key="profile-vision"]').boundingBox();
  // Side by side, as short rows rather than tall tiles.
  expect(Math.abs(first.y - second.y)).toBeLessThan(1);
  expect(first.height).toBeLessThan(80);

  // The panel spans the screen between small gaps.
  const box = await menu.boundingBox();
  expect(box.width).toBeGreaterThan(phone.viewport.width - 24);
});

test('Big Cursor is hidden on touch-only devices', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').tap();
  await expect(page.locator('.acc-btn[data-key="pause-motion"]')).toBeVisible();
  await expect(page.locator('.acc-btn[data-key="large-pointer"]')).toHaveCount(0);
});

test('touch scrolling the menu never scrolls the page behind it', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').tap();
  const content = await page.locator('.acc-menu-content').boundingBox();

  // Well past the end of the options.
  for (let i = 0; i < 4; i++) {
    await touchScroll(page, content.x + content.width / 2, content.y + content.height / 2, -800);
  }
  let scroll = await readScroll(page);
  expect(scroll.menu).toBeGreaterThan(0);
  expect(scroll.page).toBe(0);

  // Dragging the header does not pan the page either.
  const header = await page.locator('.acc-menu-header').boundingBox();
  await touchScroll(page, header.x + 40, header.y + header.height / 2, -300);
  scroll = await readScroll(page);
  expect(scroll.page).toBe(0);
});

test('tapping options leaves no stuck focus ring', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').tap();
  const option = page.locator('.acc-btn[data-key="line-spacing"]');
  await option.tap();
  await expect(option).toHaveAttribute('aria-pressed', 'true');
  expect(await option.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe('none');
});

test('language list opens without raising the on-screen keyboard', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').tap();
  await page.locator('.acc-header-lang-toggle').tap();
  await expect(page.locator('#acc-lang-modal')).not.toHaveAttribute('hidden', '');

  const focused = await page.evaluate(() => {
    const active = document.getElementById('acc-widget-host').shadowRoot.activeElement;
    return active ? active.className : '';
  });
  expect(focused).toContain('acc-lang-item');
  expect(focused).toContain('selected');
});

test('reading guide shows right away and moves to a tap', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').tap();
  await page.locator('.acc-btn[data-key="reading-aid"]').tap();

  // Visible before any pointer movement: touch has no hover to reveal it.
  const shade = page.locator('.acc-rg-top');
  await expect(shade).toBeVisible();
  await page.locator('.acc-menu-close').tap();

  const title = await page.locator('.hero-title').boundingBox();
  const tapY = Math.round(title.y + title.height / 2);
  await page.touchscreen.tap(Math.round(title.x + 20), tapY);
  await expect
    .poll(() => shade.evaluate((el) => Math.round(el.getBoundingClientRect().height)))
    .toBe(tapY - 50);
});

test('text magnifier responds to a tap and stays within the screen', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').tap();
  await page.locator('.acc-btn[data-key="text-magnifier"]').tap();
  await page.locator('.acc-menu-close').tap();

  await page.locator('.hero-subtitle').tap();
  const magnifier = page.locator('.acc-text-magnifier');
  await expect(magnifier).toHaveClass(/acc-visible/);

  const box = await magnifier.boundingBox();
  expect(box.width).toBeGreaterThan(phone.viewport.width * 0.6);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.height).toBeLessThan(phone.viewport.height * 0.5);
});
