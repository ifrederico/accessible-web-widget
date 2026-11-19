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

// Drags one finger by yDistance with raw touch events (negative drags upward,
// scrolling content down). Input.synthesizeScrollGesture's touch source does
// nothing in headless Chromium on Linux, so CI never scrolled with it.
const touchScroll = async (page, x, y, yDistance) => {
  const cdp = await page.context().newCDPSession(page);
  const steps = 10;
  const point = (i) => [{ x: Math.round(x), y: Math.round(y + (yDistance * i) / steps) }];
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: point(0) });
  for (let i = 1; i <= steps; i++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: point(i) });
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  // Let any fling or scroll chaining settle before reading positions.
  await page.waitForTimeout(300);
};

test('phone menu spans the screen with tiles two to a row', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').tap();
  const menu = page.locator('.acc-menu');
  await expect(menu).toBeVisible();

  // Three square tiles would be too narrow here for the longer labels to
  // stay on one line, so a phone gets two per row at a fixed height.
  const tiles = page.locator('.acc-options .acc-btn');
  const [first, second, third] = await Promise.all([0, 1, 2].map((i) => tiles.nth(i).boundingBox()));
  expect(Math.abs(first.y - second.y)).toBeLessThan(1);
  expect(second.x).toBeGreaterThan(first.x);
  expect(third.y).toBeGreaterThan(first.y + first.height);
  expect(first.height).toBeGreaterThanOrEqual(112);
  expect(first.height).toBeLessThan(first.width);

  // The panel spans the screen between small gaps.
  const box = await menu.boundingBox();
  expect(box.width).toBeGreaterThan(phone.viewport.width - 24);
});

test('narrow phones also show two tiles per row', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').tap();

  const tiles = page.locator('.acc-options .acc-btn');
  const [first, second, third] = await Promise.all([0, 1, 2].map((i) => tiles.nth(i).boundingBox()));
  expect(Math.abs(first.y - second.y)).toBeLessThan(1);
  expect(third.y).toBeGreaterThan(first.y + first.height);
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

  // Well past the end of the options: each drag spans most of the list.
  for (let i = 0; i < 4; i++) {
    await touchScroll(page, content.x + content.width / 2, content.y + content.height - 20, -(content.height - 40));
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
  await page.locator('.acc-lang-row').tap();
  await expect(page.locator('#acc-lang-panel')).not.toHaveAttribute('hidden', '');

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
