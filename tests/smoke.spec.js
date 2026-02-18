import { test, expect } from '@playwright/test';

test('auto-init renders exactly one toggle button', async ({ page }) => {
  await page.goto('index.html');
  await expect(page.locator('.acc-toggle-btn')).toHaveCount(1);
});

test('global constructor is exposed', async ({ page }) => {
  await page.goto('index.html');
  const constructorType = await page.evaluate(() => typeof window.AccessibleWebWidget);
  expect(constructorType).toBe('function');
});

test('menu opens and closes with Escape', async ({ page }) => {
  await page.goto('index.html');
  const toggle = page.locator('.acc-toggle-btn');
  await toggle.click();
  const menu = page.locator('.acc-menu');
  await expect(menu).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
});

test('state persists after reload (bold text toggle)', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  const boldButton = page.locator('.acc-btn[data-key="bold-text"]');
  await boldButton.click();
  await expect(boldButton).toHaveClass(/acc-selected/);

  await page.reload();
  await page.locator('.acc-toggle-btn').click();
  await expect(page.locator('.acc-btn[data-key="bold-text"]')).toHaveClass(/acc-selected/);
});

test('dev mode exposes accessibility report tool only when enabled', async ({ page }) => {
  await page.goto('index.html?acc-dev=true');
  await page.locator('.acc-toggle-btn').click();
  await expect(page.locator('.acc-btn[data-key="accessibility-report"]')).toHaveCount(1);

  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  await expect(page.locator('.acc-btn[data-key="accessibility-report"]')).toHaveCount(0);
});

test('data attributes for position, offset, and size are applied', async ({ page }) => {
  await page.goto('fixtures/custom-options.html');
  const toggle = page.locator('.acc-toggle-btn');
  await expect(toggle).toBeVisible();

  const computed = await toggle.evaluate((element) => {
    const style = element.style;
    return {
      top: style.top,
      right: style.right,
      left: style.left,
      width: style.width,
      height: style.height
    };
  });

  expect(computed.top).toBe('40px');
  expect(computed.right).toBe('32px');
  expect(computed.left).toBe('auto');
  expect(computed.width).toBe('58px');
  expect(computed.height).toBe('58px');
});
