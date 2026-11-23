import { test, expect } from '@playwright/test';

// Options used together. Each test here is a mix that once went wrong:
// two tiles fighting over the same text, a profile on top of a tile, or a
// page option leaking into the widget's own menu.

const readStates = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('accweb') || '{}').states || {});
const tile = (page, key) => page.locator(`.acc-btn[data-key="${key}"]`);
const openMenu = (page) => page.locator('.acc-toggle-btn').click();
const openProfiles = (page) => page.locator('.acc-profiles-row').click();
const computed = (page, selector, property) => page.locator(selector).first()
  .evaluate((element, name) => window.getComputedStyle(element)[name], property);

// A few paragraphs with known colors and sizes, at the top of the page.
const addSamples = (page) => page.evaluate(() => {
  const box = document.createElement('div');
  box.id = 'mix-samples';
  box.style.cssText = 'background: rgb(255, 255, 255); padding: 8px;';
  box.innerHTML = `
    <p id="mix-plain" style="margin: 0;">Plain paragraph with enough words in it to be read as a line of text.</p>
    <p id="mix-weak" style="color: rgb(170, 170, 170);">Pale grey on white</p>
    <p id="mix-weak-large" style="color: rgb(153, 153, 153); font-size: 17px;">Mid grey, a little larger</p>
    <p id="mix-forced-light" style="color: rgb(187, 187, 187) !important;">Light text the page forces</p>
    <p id="mix-forced-dark" style="color: rgb(51, 51, 51) !important;">Dark text the page forces</p>
    <p id="mix-sized" style="font-size: 20px;">A size written on the element</p>`;
  document.querySelector('main').prepend(box);
});

// Contrast of an element's text against the first solid background behind it.
const ratio = (page, selector) => page.locator(selector).evaluate((element) => {
  const channel = (value) => {
    const unit = value / 255;
    return unit <= 0.03928 ? unit / 12.92 : Math.pow((unit + 0.055) / 1.055, 2.4);
  };
  const luminance = (text) => {
    const [r, g, b] = text.match(/[\d.]+/g).map(Number);
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  };
  let node = element;
  let background = 'rgba(0, 0, 0, 0)';
  while (node && /rgba\(.*, 0\)$/.test(background)) {
    background = window.getComputedStyle(node).backgroundColor;
    node = node.parentElement;
  }
  if (/rgba\(.*, 0\)$/.test(background)) background = 'rgb(255, 255, 255)';
  const a = luminance(window.getComputedStyle(element).color);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
});

test('Letter Spacing, Font Weight and Readable Font leave the menu and Page Structure as they are', async ({ page }) => {
  await page.goto('index.html');
  await openMenu(page);
  const label = '.acc-btn[data-key="bold-text"] .acc-label';
  const before = {
    word: await computed(page, label, 'wordSpacing'),
    letter: await computed(page, label, 'letterSpacing'),
    family: await computed(page, label, 'fontFamily')
  };

  for (let step = 0; step < 3; step++) await tile(page, 'letter-spacing').click();
  await tile(page, 'bold-text').click();
  await tile(page, 'dyslexia-font').click();
  await expect(page.locator('html')).toHaveClass(/acc-letter-spacing/);
  await expect(page.locator('html')).toHaveClass(/acc-readable-text/);

  // The menu keeps its own word gaps, letter gaps and font.
  await expect.poll(() => computed(page, label, 'wordSpacing')).toBe(before.word);
  expect(await computed(page, label, 'letterSpacing')).toBe(before.letter);
  expect(await computed(page, label, 'fontFamily')).toBe(before.family);

  // So does the Page Structure window: its title stays semi-bold, its
  // list stays regular, and neither takes the reading font.
  await tile(page, 'page-structure').click();
  const panel = page.locator('.acc-structure-panel');
  await expect(panel).toBeVisible();
  expect(await computed(page, '.acc-structure-panel .acc-report-title', 'fontWeight')).toBe('600');
  expect(await computed(page, '.acc-structure-panel .acc-structure-item', 'fontWeight')).toBe('400');
  expect(await computed(page, '.acc-structure-panel .acc-structure-item', 'wordSpacing')).toBe('0px');
  expect(await computed(page, '.acc-structure-panel .acc-structure-item', 'fontFamily')).not.toContain('OpenDyslexic');

  // The page itself did change.
  expect(await computed(page, 'main p', 'fontWeight')).toBe('700');
});

test('Page Structure opens over the menu and closing it comes back to its tile', async ({ page }) => {
  await page.goto('index.html');
  await openMenu(page);
  const structureTile = tile(page, 'page-structure');
  const panel = page.locator('.acc-structure-panel');

  await structureTile.focus();
  await page.keyboard.press('Enter');
  await expect(panel).toBeVisible();
  await expect(page.locator('.acc-menu')).toBeVisible();

  // Tab stays inside the window; the menu behind it does not pull focus.
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => !!document.activeElement.closest('.acc-structure-panel'))).toBe(true);

  // Escape closes the window only, and focus is back on the tile.
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(page.locator('.acc-menu')).toBeVisible();
  await expect(structureTile).toBeFocused();

  // A second Escape closes the menu, as before.
  await page.keyboard.press('Escape');
  await expect(page.locator('.acc-menu')).toBeHidden();

  // Going to a heading closes both, so the page is in view.
  await openMenu(page);
  await structureTile.click();
  await panel.locator('.acc-structure-item').first().click();
  await expect(panel).toBeHidden();
  await expect(page.locator('.acc-menu')).toBeHidden();
});

test('Reading Guide has a 120px window with a line along each edge and follows the mouse', async ({ page }) => {
  await page.goto('index.html');
  await openMenu(page);
  await tile(page, 'reading-aid').click();

  const edges = () => page.evaluate(() => {
    const top = document.querySelector('.acc-rg-top').getBoundingClientRect();
    const bottom = document.querySelector('.acc-rg-bottom').getBoundingClientRect();
    return { top: Math.round(top.bottom), bottom: Math.round(bottom.top) };
  });

  // Over the page beside the open menu the window follows the pointer.
  await page.mouse.move(200, 300);
  await expect.poll(edges).toEqual({ top: 240, bottom: 360 });
  // Over the menu itself it stays where it was put.
  const menuBox = await page.locator('.acc-menu').boundingBox();
  await page.mouse.move(menuBox.x + menuBox.width / 2, menuBox.y + 200);
  await page.waitForTimeout(80);
  expect(await edges()).toEqual({ top: 240, bottom: 360 });

  // It lands exactly where a quick movement ends, not short of it.
  await page.keyboard.press('Escape');
  await page.mouse.move(200, 500, { steps: 6 });
  await expect.poll(edges).toEqual({ top: 440, bottom: 560 });

  // A line along each edge of the window.
  expect(await computed(page, '.acc-rg-top', 'borderBottomWidth')).toBe('3px');
  expect(await computed(page, '.acc-rg-bottom', 'borderTopWidth')).toBe('3px');
  expect(await computed(page, '.acc-rg-top', 'borderBottomStyle')).toBe('solid');
});

test('Dark Contrast and Simplify Layout read the same whichever was switched on first', async ({ page }) => {
  for (const order of [['contrast-toggle', 'simple-layout'], ['simple-layout', 'contrast-toggle']]) {
    await page.goto('index.html');
    await page.evaluate(() => localStorage.clear());
    await page.goto('index.html');
    await addSamples(page);
    await openMenu(page);
    for (const key of order) {
      await tile(page, key).click();
      // Contrast: Smart, then Dark.
      if (key === 'contrast-toggle') await tile(page, key).click();
    }
    await expect(page.locator('body')).toHaveClass(/acc-simple-layout-enabled/);
    await expect(page.locator('html')).toHaveClass(/acc-dark-contrast/);
    expect(await computed(page, 'body', 'backgroundColor')).toBe('rgb(0, 0, 0)');
    expect(await computed(page, '#mix-plain', 'color')).toBe('rgb(255, 255, 255)');
    expect(await ratio(page, '#mix-plain')).toBeGreaterThan(15);
    expect(await ratio(page, '#mix-weak')).toBeGreaterThan(15);
  }
});

test('Font Size, Line Height and Letter Spacing work under Simplify Layout, also after a reload', async ({ page }) => {
  await page.goto('index.html');
  await addSamples(page);
  await openMenu(page);
  await tile(page, 'simple-layout').click();
  const plain = () => page.locator('#mix-plain').evaluate((element) => {
    const style = window.getComputedStyle(element);
    const size = parseFloat(style.fontSize);
    return { size, line: parseFloat(style.lineHeight) / size, letter: parseFloat(style.letterSpacing) / size };
  });
  const base = (await plain()).size;

  await tile(page, 'text-scale').click();
  await tile(page, 'text-scale').click();
  await tile(page, 'line-spacing').click();
  await tile(page, 'letter-spacing').click();
  let now = await plain();
  expect(now.size).toBeCloseTo(base * 1.25, 1);
  expect(now.line).toBeCloseTo(2, 1);
  expect(now.letter).toBeCloseTo(0.12, 2);

  // The same after a reload, where the options are applied in another order.
  await page.reload();
  await addSamples(page);
  await expect(page.locator('body')).toHaveClass(/acc-simple-layout-enabled/);
  // Text added after the load is picked up by Font Size shortly after.
  await expect.poll(async () => (await plain()).size).toBeCloseTo(base * 1.25, 1);
  now = await plain();
  expect(now.line).toBeCloseTo(2, 1);
  expect(now.letter).toBeCloseTo(0.12, 2);

  // Simplify Layout off: Font Size starts again from the page's own size.
  const pageSize = 16;
  await openMenu(page);
  await tile(page, 'simple-layout').click();
  const size = await page.locator('main p:not(#mix-samples p)').first().evaluate((element) => ({
    now: parseFloat(window.getComputedStyle(element).fontSize),
    base: parseFloat(element.getAttribute('data-acc-baseSize'))
  }));
  expect(size.base).toBeGreaterThan(0);
  expect(size.now).toBeCloseTo(size.base * 1.25, 1);
  expect(pageSize).toBe(16);
});

test('Font Size gives back a size the page wrote on an element', async ({ page }) => {
  await page.goto('index.html');
  await addSamples(page);
  await openMenu(page);
  const sizeTile = tile(page, 'text-scale');
  for (let step = 0; step < 3; step++) await sizeTile.click();
  expect(parseFloat(await computed(page, '#mix-sized', 'fontSize'))).toBeCloseTo(30, 1);
  await sizeTile.click();
  await expect(sizeTile).toHaveAttribute('aria-pressed', 'false');
  expect(await page.locator('#mix-sized').evaluate((element) => element.style.fontSize)).toBe('20px');
  expect(await computed(page, '#mix-sized', 'fontSize')).toBe('20px');
});

test('Smart Contrast keeps up when Invert Colors or Font Size changes', async ({ page }) => {
  await page.goto('index.html');
  await addSamples(page);
  await openMenu(page);

  // Invert first, then Smart Contrast: measured in the page's own colors.
  await tile(page, 'invert-colors').click();
  await tile(page, 'contrast-toggle').click();
  expect(await ratio(page, '#mix-weak')).toBeGreaterThanOrEqual(4.5);
  await tile(page, 'invert-colors').click();
  expect(await ratio(page, '#mix-weak')).toBeGreaterThanOrEqual(4.5);
  // Text that was fine was not touched while the page was inverted.
  await expect(page.locator('#mix-plain')).not.toHaveAttribute('data-acc-smart-contrast');

  // Large text needs less contrast. When Font Size goes off, the text is
  // small again and has to meet the stricter measure.
  for (let step = 0; step < 3; step++) await tile(page, 'text-scale').click();
  expect(parseFloat(await computed(page, '#mix-weak-large', 'fontSize'))).toBeGreaterThanOrEqual(24);
  expect(await ratio(page, '#mix-weak-large')).toBeGreaterThanOrEqual(3);
  await tile(page, 'text-scale').click();
  expect(await ratio(page, '#mix-weak-large')).toBeGreaterThanOrEqual(4.5);
});

test('Dark and Light Contrast also fix a color the page forces on an element, and give it back', async ({ page }) => {
  await page.goto('index.html');
  await addSamples(page);
  await openMenu(page);
  const contrast = tile(page, 'contrast-toggle');

  await contrast.click();
  await contrast.click();
  await expect(contrast).toHaveAttribute('data-contrast-mode', 'dark-contrast');
  expect(await ratio(page, '#mix-forced-dark')).toBeGreaterThanOrEqual(7);

  await contrast.click();
  await expect(contrast).toHaveAttribute('data-contrast-mode', 'light-contrast');
  expect(await ratio(page, '#mix-forced-light')).toBeGreaterThanOrEqual(7);

  await contrast.click();
  await expect(contrast).toHaveAttribute('data-contrast-mode', 'off');
  await expect(page.locator('[data-acc-smart-contrast]')).toHaveCount(0);
  for (const [id, color] of [['#mix-forced-light', 'rgb(187, 187, 187)'], ['#mix-forced-dark', 'rgb(51, 51, 51)']]) {
    expect(await computed(page, id, 'color')).toBe(color);
    expect(await page.locator(id).evaluate((element) => element.style.getPropertyPriority('color'))).toBe('important');
  }
});

test('a color given back to an element loses its "important" where it had none', async ({ page }) => {
  await page.goto('index.html');
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.textContent = '#mix-ruled { color: rgb(34, 34, 34) !important; }';
    document.head.append(style);
    const box = document.createElement('div');
    box.style.cssText = 'background: rgb(17, 17, 17) !important; padding: 8px;';
    box.innerHTML = '<p id="mix-ruled" style="color: rgb(238, 238, 238);">Ruled dark by the page, on a box it forces dark</p>';
    document.querySelector('main').prepend(box);
  });
  await openMenu(page);
  const contrast = tile(page, 'contrast-toggle');
  // Light Contrast cannot turn the box white, so the net lightens the text.
  for (let step = 0; step < 3; step++) await contrast.click();
  await expect(contrast).toHaveAttribute('data-contrast-mode', 'light-contrast');
  expect(await ratio(page, '#mix-ruled')).toBeGreaterThanOrEqual(7);
  // Off: the page's important rule wins over the plain inline color again.
  await contrast.click();
  expect(await computed(page, '#mix-ruled', 'color')).toBe('rgb(34, 34, 34)');
  expect(await page.locator('#mix-ruled').evaluate((element) => element.style.color)).toBe('rgb(238, 238, 238)');
});

test('two profiles that share an option give it back when both are off', async ({ page }) => {
  for (const offOrder of [['profile-seizure-safe', 'profile-adhd'], ['profile-adhd', 'profile-seizure-safe']]) {
    await page.goto('index.html');
    await page.evaluate(() => localStorage.clear());
    await page.goto('index.html');
    await openMenu(page);
    await openProfiles(page);
    await tile(page, 'profile-seizure-safe').click();
    await tile(page, 'profile-adhd').click();
    expect((await readStates(page))['pause-motion']).toBe(true);

    await tile(page, offOrder[0]).click();
    // Still held by the profile that is left.
    expect((await readStates(page))['pause-motion']).toBe(true);
    await tile(page, offOrder[1]).click();
    expect((await readStates(page))['pause-motion']).toBeFalsy();
    await expect(page.locator('html')).not.toHaveClass(/acc-pause-motion/);
    await expect(tile(page, 'pause-motion')).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('.acc-action-reset')).toBeDisabled();
  }
});

test('a profile gives back the color filter and keeps the level that were on before it', async ({ page }) => {
  await page.goto('index.html');
  await openMenu(page);
  await openProfiles(page);

  // Invert Colors, then Seizure Safe on and off: Invert Colors is back.
  await tile(page, 'invert-colors').click();
  await tile(page, 'profile-seizure-safe').click();
  expect((await readStates(page))['low-saturation']).toBe(true);
  expect((await readStates(page))['invert-colors']).toBeFalsy();
  await tile(page, 'profile-seizure-safe').click();
  expect((await readStates(page))['invert-colors']).toBe(true);
  await expect(tile(page, 'invert-colors')).toHaveAttribute('aria-pressed', 'true');
  await tile(page, 'invert-colors').click();

  // Monochrome has less color than the profile asks for; it stays.
  const saturation = tile(page, 'saturation-toggle');
  for (let step = 0; step < 3; step++) await saturation.click();
  await expect(saturation).toHaveAttribute('data-saturation-mode', 'monochrome');
  await tile(page, 'profile-seizure-safe').click();
  await expect(saturation).toHaveAttribute('data-saturation-mode', 'monochrome');
  await tile(page, 'profile-seizure-safe').click();
  await expect(saturation).toHaveAttribute('data-saturation-mode', 'monochrome');
  await saturation.click();

  // A Line Height level already chosen is not lowered by Dyslexia Friendly.
  const lineHeight = tile(page, 'line-spacing');
  for (let step = 0; step < 3; step++) await lineHeight.click();
  expect((await readStates(page))['line-spacing']).toBe(3);
  await tile(page, 'profile-dyslexia').click();
  expect((await readStates(page))['line-spacing']).toBe(3);
  expect((await readStates(page))['letter-spacing']).toBe(true);
  await tile(page, 'profile-dyslexia').click();
  expect((await readStates(page))['line-spacing']).toBe(3);
  expect((await readStates(page))['letter-spacing']).toBeFalsy();
});

test('a color filter follows the body color when Dark Contrast is switched on under it', async ({ page }) => {
  await page.goto('index.html');
  await openMenu(page);
  await tile(page, 'invert-colors').click();
  const contrast = tile(page, 'contrast-toggle');
  await contrast.click();
  await contrast.click();
  await expect(contrast).toHaveAttribute('data-contrast-mode', 'dark-contrast');
  // A black page, inverted, is a white page: the body must match what the
  // filter does to everything inside it.
  expect(await computed(page, 'body', 'backgroundColor')).toBe('rgb(255, 255, 255)');
  await tile(page, 'invert-colors').click();
  expect(await computed(page, 'body', 'backgroundColor')).toBe('rgb(0, 0, 0)');
});

test('Reset after Invert Colors and Dark Contrast leaves nothing that misleads Smart Contrast later', async ({ page }) => {
  await page.goto('index.html');
  await addSamples(page);
  await openMenu(page);
  const contrast = tile(page, 'contrast-toggle');
  await contrast.click();
  await contrast.click();
  await tile(page, 'invert-colors').click();
  await page.locator('.acc-action-reset').click();
  await expect(contrast).toHaveAttribute('data-contrast-mode', 'off');

  // Smart Contrast now: the page is white again, so dark text is fine
  // and stays as it is, and the pale text is fixed.
  await contrast.click();
  await expect(contrast).toHaveAttribute('data-contrast-mode', 'smart-contrast');
  await expect(page.locator('#mix-plain')).not.toHaveAttribute('data-acc-smart-contrast');
  expect(await ratio(page, '#mix-plain')).toBeGreaterThan(10);
  expect(await ratio(page, '#mix-weak')).toBeGreaterThanOrEqual(4.5);
});

test('Smart Contrast reads the settled color of text whose color is animated', async ({ page }) => {
  await page.goto('index.html');
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.textContent = '#mix-fading { color: rgb(20, 40, 60); transition: color 2s linear; }';
    document.head.append(style);
    const paragraph = document.createElement('p');
    paragraph.id = 'mix-fading';
    paragraph.textContent = 'Text whose color fades when it changes';
    document.querySelector('main').prepend(paragraph);
  });
  await openMenu(page);
  const contrast = tile(page, 'contrast-toggle');
  await contrast.click();
  await contrast.click();
  await expect(contrast).toHaveAttribute('data-contrast-mode', 'dark-contrast');
  // Dark Contrast makes this text white. Part-way through the fade it
  // would look too dark and be "fixed" to a grey; it must be left alone.
  await expect(page.locator('#mix-fading')).not.toHaveAttribute('data-acc-smart-contrast');
  await expect.poll(() => computed(page, '#mix-fading', 'color')).toBe('rgb(255, 255, 255)');
});
