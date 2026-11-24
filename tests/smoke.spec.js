import { test, expect } from '@playwright/test';

// Developer mode needs the site owner's key (devTools: true) plus ?acc-dev.
const allowDevTools = (page) => page.addInitScript(() => {
  window.AccessibleWebWidgetOptions = { devTools: true };
});

const readStates = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('accweb') || '{}').states || {});

// Records every utterance handed to a mocked speechSynthesis; call before goto.
const mockSpeech = (page) => page.addInitScript(() => {
  class MockUtterance {
    constructor(text) {
      this.text = text;
      this.lang = '';
      this.voice = null;
      this.rate = 1;
      this.pitch = 1;
    }
  }
  window.__speakPayloads = [];
  const synth = {
    speaking: false,
    paused: false,
    getVoices: () => [{ name: 'Samantha', lang: 'en-US', default: true, localService: true }],
    speak: (utterance) => {
      window.__speakPayloads.push({ text: utterance.text, rate: utterance.rate });
      if (typeof utterance.onend === 'function') setTimeout(() => utterance.onend(), 0);
    },
    cancel: () => {},
    pause: () => {},
    resume: () => {}
  };
  Object.defineProperty(window, 'speechSynthesis', { configurable: true, get: () => synth });
  Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, writable: true, value: MockUtterance });
});

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

test('menu docks to the left when the button is bottom-left', async ({ page }) => {
  await page.addInitScript(() => {
    window.AccessibleWebWidgetOptions = { position: 'bottom-left' };
  });
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  const menu = page.locator('.acc-menu');
  await expect(menu).toBeVisible();
  const styles = await menu.evaluate((el) => ({ left: el.style.left, right: el.style.right }));
  expect(styles.right).toBe('auto');
  expect(styles.left).not.toBe('auto');
  expect(styles.left).not.toBe('');
});

test('menu closes via the header close button', async ({ page }) => {
  await page.goto('index.html');
  const toggle = page.locator('.acc-toggle-btn');
  await toggle.click();
  const menu = page.locator('.acc-menu');
  await expect(menu).toBeVisible();
  await page.locator('.acc-menu-close').click();
  await expect(menu).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('header holds the title, the more button and the close button', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  await expect(page.locator('.acc-menu-header button')).toHaveCount(2);
  await expect(page.locator('.acc-menu-header .acc-menu-close')).toBeVisible();

  // The more button drops down Move widget and Hide widget; Escape
  // closes the drop-down first and leaves the menu open.
  const more = page.locator('.acc-menu-more');
  await expect(more).toHaveAttribute('aria-expanded', 'false');
  await more.click();
  await expect(more).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.acc-more-item')).toHaveCount(2);
  await expect(page.locator('.acc-more-move')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('.acc-more-panel')).toBeHidden();
  await expect(more).toBeFocused();
  await expect(page.locator('.acc-menu')).toBeVisible();

  // So does a click elsewhere in the menu.
  await more.click();
  await page.locator('.acc-menu-title').click();
  await expect(page.locator('.acc-more-panel')).toBeHidden();
});

test('Language row expands in place, searches, and switches language', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  const languageRow = page.locator('.acc-lang-row');
  const languagePanel = page.locator('#acc-lang-panel');
  await expect(languageRow).toHaveAttribute('aria-expanded', 'false');
  await expect(languagePanel).toHaveAttribute('hidden', '');
  await expect(page.locator('#acc-current-language')).toHaveText('English');
  await expect(languageRow).toHaveAccessibleName('Language English');

  await languageRow.click();
  await expect(languageRow).toHaveAttribute('aria-expanded', 'true');
  await expect(languagePanel).toBeVisible();
  // The list sits inside the card, above the Profiles row.
  const panelBox = await languagePanel.boundingBox();
  const profilesBox = await page.locator('.acc-profiles-row').boundingBox();
  expect(panelBox.y + panelBox.height).toBeLessThanOrEqual(profilesBox.y + 1);
  await expect(page.locator('.acc-lang-item')).toHaveCount(54);

  const search = page.locator('#acc-lang-search');
  await expect(search).toBeFocused();
  await search.fill('deutsch');
  await expect(page.locator('.acc-lang-item:visible')).toHaveCount(1);
  await page.locator('.acc-lang-item[data-lang="de"]').click();

  await expect(languagePanel).toHaveAttribute('hidden', '');
  await expect(languageRow).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#acc-current-language')).toHaveText('Deutsch');
  await expect(page.locator('.acc-menu-title')).toHaveText('Optionen für Barrierefreiheit');
  await expect(languageRow).toHaveAccessibleName('Sprache Deutsch');

  // Reopening shows the full list again.
  await languageRow.click();
  await expect(search).toHaveValue('');
  await expect(page.locator('.acc-lang-item:visible')).toHaveCount(54);
});

test('Profiles row expands to the profile tiles and names the active profile', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  const profilesRow = page.locator('.acc-profiles-row');
  const profilesPanel = page.locator('#acc-profiles-panel');
  const summary = page.locator('.acc-profiles-summary');
  await expect(profilesRow).toHaveAttribute('aria-expanded', 'false');
  await expect(profilesPanel).toBeHidden();
  await expect(summary).toHaveText('');

  await profilesRow.click();
  await expect(profilesRow).toHaveAttribute('aria-expanded', 'true');
  const tiles = profilesPanel.locator('.acc-btn');
  await expect(tiles).toHaveCount(4);
  // Two by two, each a short row with the icon before the name, and no
  // name broken onto a second line.
  const [first, second, third] = await Promise.all([0, 1, 2].map((i) => tiles.nth(i).boundingBox()));
  expect(Math.abs(first.y - second.y)).toBeLessThan(1);
  expect(third.y).toBeGreaterThan(first.y + first.height - 1);
  expect(first.height).toBeLessThan(first.width / 2);
  const icon = await tiles.nth(0).locator('svg').boundingBox();
  const label = await tiles.nth(0).locator('.acc-label').boundingBox();
  expect(icon.x + icon.width).toBeLessThanOrEqual(label.x);
  for (let i = 0; i < 4; i += 1) {
    expect((await tiles.nth(i).locator('.acc-label').boundingBox()).height).toBeLessThan(22);
  }

  await page.locator('.acc-btn[data-key="profile-vision"]').click();
  await expect(summary).toHaveText('Vision Impaired');
  await page.locator('.acc-btn[data-key="profile-adhd"]').click();
  await expect(summary).toHaveText('2');
  await expect(profilesRow).toHaveAccessibleName('Profiles 2');

  await page.reload();
  await page.locator('.acc-toggle-btn').click();
  await expect(summary).toHaveText('2');
  await expect(profilesPanel).toBeHidden();
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

test('a tile with level dots lines up with a tile without them', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  const place = (key) => page.locator(`.acc-btn[data-key="${key}"]`).evaluate((tile) => {
    const box = tile.getBoundingClientRect();
    const dots = tile.querySelector('.acc-progress-indicator');
    return {
      icon: Math.round(tile.querySelector('svg').getBoundingClientRect().top - box.top),
      label: Math.round(tile.querySelector('.acc-label').getBoundingClientRect().top - box.top),
      labelEnd: tile.querySelector('.acc-label').getBoundingClientRect().bottom,
      dotsStart: dots ? dots.getBoundingClientRect().top : null,
      dotsEnd: dots ? dots.getBoundingClientRect().bottom : null,
      tileEnd: box.bottom
    };
  });
  const withDots = await place('text-scale');
  const without = await place('bold-text');

  expect(withDots.dotsStart).not.toBeNull();
  expect(without.dotsStart).toBeNull();
  expect(withDots.icon).toBe(without.icon);
  expect(withDots.label).toBe(without.label);
  // The dots stay under the label and inside the tile.
  expect(withDots.dotsStart).toBeGreaterThan(withDots.labelEnd);
  expect(withDots.dotsEnd).toBeLessThan(withDots.tileEnd);
});

test('Line Height steps through 2, 2.5 and 3, with headings held tighter, then off', async ({ page }) => {
  const lineRatio = (selector) => page.locator(selector).first().evaluate((element) => {
    const style = window.getComputedStyle(element);
    return parseFloat(style.lineHeight) / parseFloat(style.fontSize);
  });

  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  const tile = page.locator('.acc-btn[data-key="line-spacing"]');
  const region = page.locator('#acc-live-region');
  await expect(tile.locator('.acc-progress-dot')).toHaveCount(3);

  for (const [index, level] of [2, 2.5, 3].entries()) {
    await tile.click();
    await expect(tile).toHaveAttribute('aria-pressed', 'true');
    await expect(tile.locator('.acc-progress-dot.active')).toHaveAttribute('data-level', String(index));
    // The name stays plain and the dots show the step; the step number
    // is in the spoken name and the announcement.
    await expect(tile.locator('.acc-label')).toHaveText('Line Height');
    await expect(tile).toHaveAccessibleName(`Line Height: ${index + 1}`);
    await expect(region).toHaveText(`Line Height: ${index + 1} On`);
    expect((await readStates(page))['line-spacing']).toBe(level);
    await expect.poll(() => lineRatio('.hero-subtitle')).toBeCloseTo(level, 1);
    // Three quarters of the level, so a large headline does not fly apart.
    await expect.poll(() => lineRatio('h1')).toBeCloseTo(level * 0.75, 1);
  }

  await page.reload();
  await expect.poll(() => lineRatio('.hero-subtitle')).toBeCloseTo(3, 1);
  await page.locator('.acc-toggle-btn').click();
  await expect(tile.locator('.acc-progress-dot.active')).toHaveAttribute('data-level', '2');

  await tile.click();
  await expect(tile).toHaveAttribute('aria-pressed', 'false');
  await expect(tile.locator('.acc-label')).toHaveText('Line Height');
  await expect(region).toHaveText('Line Height Off');
  await expect(page.locator('html')).not.toHaveClass(/acc-line-spacing/);
  expect((await readStates(page))['line-spacing']).toBe(false);
});

test('Letter Spacing steps through three levels and spaces words too', async ({ page }) => {
  const spacing = () => page.locator('.hero-subtitle').evaluate((element) => {
    const style = window.getComputedStyle(element);
    const size = parseFloat(style.fontSize);
    return { letter: parseFloat(style.letterSpacing) / size, word: parseFloat(style.wordSpacing) / size };
  });

  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  const tile = page.locator('.acc-btn[data-key="letter-spacing"]');
  const region = page.locator('#acc-live-region');
  await expect(tile.locator('.acc-progress-dot')).toHaveCount(3);

  for (const level of [1, 2, 3]) {
    await tile.click();
    await expect(tile).toHaveAttribute('aria-pressed', 'true');
    await expect(tile.locator('.acc-progress-dot.active')).toHaveAttribute('data-level', String(level - 1));
    await expect(tile.locator('.acc-label')).toHaveText('Letter Spacing');
    await expect(tile).toHaveAccessibleName(`Letter Spacing: ${level}`);
    await expect(region).toHaveText(`Letter Spacing: ${level} On`);
    expect((await readStates(page))['letter-spacing']).toBe(level);
    await expect.poll(async () => (await spacing()).letter).toBeCloseTo(0.12 * level, 2);
    await expect.poll(async () => (await spacing()).word).toBeCloseTo(0.16 * level, 2);
  }

  await tile.click();
  await expect(tile).toHaveAttribute('aria-pressed', 'false');
  await expect(tile).toHaveAccessibleName('Letter Spacing');
  await expect(region).toHaveText('Letter Spacing Off');
  await expect(page.locator('html')).not.toHaveClass(/acc-letter-spacing/);
});

test('a saved "on" from before the levels existed lands on the first level', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('accweb', JSON.stringify({ states: { 'line-spacing': true, 'letter-spacing': true } }));
  });
  await page.goto('index.html');
  await expect.poll(() => page.locator('.hero-subtitle').evaluate((element) => {
    const style = window.getComputedStyle(element);
    return parseFloat(style.lineHeight) / parseFloat(style.fontSize);
  })).toBeCloseTo(2, 1);
  await page.locator('.acc-toggle-btn').click();
  await expect(page.locator('.acc-btn[data-key="line-spacing"] .acc-progress-dot.active')).toHaveAttribute('data-level', '0');
  await expect(page.locator('.acc-btn[data-key="letter-spacing"] .acc-progress-dot.active')).toHaveAttribute('data-level', '0');
});

test('Font Size tile cycles 110%, 125%, 150% and back to off, and persists', async ({ page }) => {
  const textTarget = page.locator('.hero-subtitle');
  const readFontSize = () => textTarget.evaluate((element) => parseFloat(window.getComputedStyle(element).fontSize));

  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  await expect(page.locator('.acc-text-scale-range')).toHaveCount(0);
  const tile = page.locator('.acc-btn[data-key="text-scale"]');
  const region = page.locator('#acc-live-region');
  await expect(tile.locator('.acc-progress-dot')).toHaveCount(3);
  await expect(tile).toHaveAttribute('aria-pressed', 'false');
  const baseSize = await readFontSize();
  expect(baseSize).toBeGreaterThan(0);

  for (const [index, value] of [1.1, 1.25, 1.5].entries()) {
    await tile.click();
    await expect(tile).toHaveAttribute('aria-pressed', 'true');
    await expect(tile.locator('.acc-progress-dot.active')).toHaveAttribute('data-level', String(index));
    // The name stays plain and the dots show the step; the step number
    // is in the spoken name and the announcement.
    await expect(tile.locator('.acc-label')).toHaveText('Font Size');
    await expect(tile).toHaveAccessibleName(`Font Size: ${index + 1}`);
    await expect(region).toHaveText(`Font Size: ${index + 1} On`);
    expect((await readStates(page))['text-scale']).toBe(value);
    await expect.poll(readFontSize).toBeCloseTo(baseSize * value, 0);
  }

  await page.reload();
  await expect.poll(readFontSize).toBeCloseTo(baseSize * 1.5, 0);
  await page.locator('.acc-toggle-btn').click();
  await expect(tile.locator('.acc-progress-dot.active')).toHaveAttribute('data-level', '2');

  await tile.click();
  await expect(tile).toHaveAttribute('aria-pressed', 'false');
  await expect(tile.locator('.acc-progress-dot.active')).toHaveCount(0);
  await expect(tile).toHaveAccessibleName('Font Size');
  await expect(tile.locator('.acc-label')).toHaveText('Font Size');
  await expect(region).toHaveText('Font Size Off');
  expect((await readStates(page))['text-scale']).toBe(1);
  expect(Math.abs(await readFontSize() - baseSize)).toBeLessThan(0.2);
});

test('a font size saved by the old slider snaps to the nearest level', async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('seeded')) {
      sessionStorage.setItem('seeded', '1');
      localStorage.setItem('accweb', JSON.stringify({ states: { 'text-scale': 1.4 } }));
    }
  });
  await page.goto('index.html');
  const scaled = await page.locator('.hero-subtitle').evaluate((element) => ({
    base: parseFloat(element.getAttribute('data-acc-baseSize')),
    size: parseFloat(window.getComputedStyle(element).fontSize)
  }));
  expect(scaled.size).toBeCloseTo(scaled.base * 1.5, 0);

  await page.locator('.acc-toggle-btn').click();
  const tile = page.locator('.acc-btn[data-key="text-scale"]');
  await expect(tile.locator('.acc-progress-dot.active')).toHaveAttribute('data-level', '2');
  await expect(tile).toHaveAccessibleName('Font Size: 3');
  // The next tap goes on from the snapped level: off.
  await tile.click();
  await expect(tile).toHaveAttribute('aria-pressed', 'false');

  // Values below 100% are off.
  await page.evaluate(() => localStorage.setItem('accweb', JSON.stringify({ states: { 'text-scale': 0.8 } })));
  await page.reload();
  await page.locator('.acc-toggle-btn').click();
  await expect(tile).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.hero-subtitle')).not.toHaveAttribute('data-acc-baseSize', /.*/);
});

test('Vision Impaired sets the largest Font Size level', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  await page.locator('.acc-profiles-row').click();
  await page.locator('.acc-btn[data-key="profile-vision"]').click();
  expect((await readStates(page))['text-scale']).toBe(1.5);
  await expect(page.locator('.acc-btn[data-key="text-scale"] .acc-progress-dot.active')).toHaveAttribute('data-level', '2');
});

test('text scale computes consistent base size for nested DOM elements', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  // 110% → 125% → 150%.
  const fontSizeTile = page.locator('.acc-btn[data-key="text-scale"]');
  for (let i = 0; i < 3; i++) {
    await fontSizeTile.click();
  }

  const footerLinkData = await page.locator('.footer-links a[href*="github.com/ifrederico"]').first().evaluate((link) => {
    const span = link.querySelector('span');
    return {
      linkBase: link.getAttribute('data-acc-baseSize'),
      spanBase: span ? span.getAttribute('data-acc-baseSize') : null,
      linkFontSize: parseFloat(window.getComputedStyle(link).fontSize),
      spanFontSize: span ? parseFloat(window.getComputedStyle(span).fontSize) : null,
    };
  });

  expect(footerLinkData.linkBase).toBeTruthy();
  expect(footerLinkData.spanBase).toBeTruthy();
  expect(footerLinkData.linkBase).toBe(footerLinkData.spanBase);
  expect(footerLinkData.linkFontSize).toBe(footerLinkData.spanFontSize);
});

// Regression for #28: content inserted later inside an already-scaled
// element inherited the scaled size, recorded it as its base, and ended up
// scaled twice.
test('text added inside an already-scaled element is scaled only once', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  // 110% → 125%.
  const fontSizeTile = page.locator('.acc-btn[data-key="text-scale"]');
  await fontSizeTile.click();
  await fontSizeTile.click();

  const link = page.locator('.footer-links a[href*="github.com/ifrederico"]').first();
  const readSizes = () => link.evaluate((element) => {
    const sibling = element.querySelector('span');
    const late = element.querySelector('.late-span');
    return {
      siblingBase: sibling.getAttribute('data-acc-baseSize'),
      lateBase: late.getAttribute('data-acc-baseSize'),
      siblingFontSize: parseFloat(getComputedStyle(sibling).fontSize),
      lateFontSize: parseFloat(getComputedStyle(late).fontSize)
    };
  });

  await link.evaluate(async (element) => {
    // Nested two deep, so every level sits under a scaled ancestor.
    const wrapper = document.createElement('em');
    const late = document.createElement('span');
    late.className = 'late-span';
    late.textContent = 'Late';
    wrapper.append(late);
    element.append(wrapper);
    // The scaling MutationObserver runs right after this task.
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  let sizes = await readSizes();
  expect(sizes.lateBase).toBe(sizes.siblingBase);
  expect(sizes.lateFontSize).toBe(sizes.siblingFontSize);

  // And it keeps tracking the Font Size level afterwards (150%).
  await fontSizeTile.click();
  sizes = await readSizes();
  expect(sizes.lateBase).toBe(sizes.siblingBase);
  expect(sizes.lateFontSize).toBe(sizes.siblingFontSize);
});

test('dev mode exposes accessibility report tool only when enabled', async ({ page }) => {
  await allowDevTools(page);
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
    const cs = window.getComputedStyle(element);
    return {
      top: style.top,
      right: style.right,
      left: style.left,
      width: cs.width,
      height: cs.height,
      buttonSizeVar: style.getPropertyValue('--acc-button-size').trim()
    };
  });

  expect(computed.top).toBe('40px');
  expect(computed.right).toBe('32px');
  expect(computed.left).toBe('auto');
  expect(computed.buttonSizeVar).toBe('58px');
  expect(computed.width).toBe('58px');
  expect(computed.height).toBe('58px');
});

test('Contrast is one tile that steps through Smart, Dark and Light', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  // No tiles of their own for the old High Contrast, or for Monochrome.
  await expect(page.locator('.acc-btn[data-key="high-contrast-mode"]')).toHaveCount(0);
  await expect(page.locator('.acc-btn[data-key="monochrome"]')).toHaveCount(0);
  const contrastButton = page.locator('.acc-btn[data-key="contrast-toggle"]');
  await expect(contrastButton).toHaveCount(1);
  await expect(contrastButton.locator('.acc-progress-dot')).toHaveCount(3);
  await expect(contrastButton).toHaveAttribute('title', 'Contrast');
  await expect(contrastButton).toHaveAttribute('data-contrast-mode', 'off');

  // Each choice is stored under its own key; Light keeps the old High Contrast key.
  const choices = [
    { label: 'Smart Contrast', mode: 'smart-contrast', state: 'smart-contrast' },
    { label: 'Dark Contrast', mode: 'dark-contrast', state: 'dark-contrast' },
    { label: 'Light Contrast', mode: 'light-contrast', state: 'high-contrast-mode' }
  ];
  for (const [index, choice] of choices.entries()) {
    await contrastButton.click();
    await expect(contrastButton).toHaveClass(/acc-selected/);
    await expect(contrastButton.locator('.acc-progress-dot.active')).toHaveAttribute('data-level', String(index));
    await expect(contrastButton).toHaveAttribute('title', `Contrast: ${choice.label}`);
    await expect(contrastButton.locator('.acc-label')).toHaveText(choice.label);
    await expect(contrastButton).toHaveAttribute('data-contrast-mode', choice.mode);
    const states = await readStates(page);
    for (const other of choices) {
      expect(!!states[other.state]).toBe(other.state === choice.state);
    }
  }

  await contrastButton.click();
  await expect(contrastButton).not.toHaveClass(/acc-selected/);
  await expect(contrastButton.locator('.acc-progress-dot.active')).toHaveCount(0);
  await expect(contrastButton).toHaveAttribute('title', 'Contrast');
  await expect(contrastButton).toHaveAttribute('data-contrast-mode', 'off');
  const states = await readStates(page);
  for (const choice of choices) {
    expect(states[choice.state]).toBeFalsy();
  }
});

test('Dark Contrast makes a black page with light text and yellow links', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  const contrastButton = page.locator('.acc-btn[data-key="contrast-toggle"]');
  await contrastButton.click();
  await contrastButton.click();
  await expect(page.locator('html')).toHaveClass(/acc-dark-contrast/);

  const colors = (selector) => page.locator(selector).first().evaluate((element) => {
    const style = window.getComputedStyle(element);
    return { color: style.color, background: style.backgroundColor };
  });
  expect(await colors('body')).toEqual({ color: 'rgb(255, 255, 255)', background: 'rgb(0, 0, 0)' });
  expect(await colors('.hero-subtitle')).toEqual({ color: 'rgb(255, 255, 255)', background: 'rgb(0, 0, 0)' });
  expect((await colors('nav a')).color).toBe('rgb(255, 255, 0)');
  // The widget keeps its own colors.
  expect((await colors('.acc-menu')).background).not.toBe('rgb(0, 0, 0)');

  // It stays on beside a Saturation level, and comes back after a reload.
  await page.locator('.acc-btn[data-key="saturation-toggle"]').click();
  await expect(contrastButton).toHaveAttribute('data-contrast-mode', 'dark-contrast');
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/acc-dark-contrast/);
  expect((await colors('body')).background).toBe('rgb(0, 0, 0)');

  await page.locator('.acc-toggle-btn').click();
  await page.locator('.acc-action-reset').click();
  await expect(page.locator('html')).not.toHaveClass(/acc-dark-contrast/);
  expect((await colors('body')).background).not.toBe('rgb(0, 0, 0)');
});

test('Smart Contrast recolors only the text that is hard to read, and puts it back', async ({ page }) => {
  await page.goto('index.html');
  await page.evaluate(() => {
    const box = document.createElement('div');
    box.id = 'contrast-samples';
    box.innerHTML = `
      <p id="weak-on-white" style="color: rgb(170, 170, 170); background: rgb(255, 255, 255);">Pale grey on white</p>
      <p id="weak-on-dark" style="color: rgb(90, 90, 90); background: rgb(20, 20, 20);">Dark grey on near black</p>
      <p id="fine" style="color: rgb(30, 30, 30); background: rgb(255, 255, 255);">Dark on white</p>
      <div style="background: rgb(255, 255, 255);"><span id="inherits" style="color: rgb(200, 200, 60);">Yellow on a white parent</span></div>
      <p id="on-gradient" style="color: rgb(200, 200, 200); background-image: linear-gradient(#fff, #eee);">Over a light gradient</p>
      <p id="on-wide-gradient" style="color: rgb(120, 120, 120); background-image: linear-gradient(90deg, #fff, #000);">Over white fading to black</p>
      <p id="on-picture" style="color: rgb(200, 200, 200); background-image: url(data:image/gif;base64,R0lGODlhAQABAAAAACw=);">Over a picture</p>`;
    document.querySelector('main').prepend(box);
  });
  const ratio = (selector) => page.locator(selector).evaluate((element) => {
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
    const a = luminance(window.getComputedStyle(element).color);
    const b = luminance(background);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  });
  const color = (selector) => page.locator(selector).evaluate((element) => window.getComputedStyle(element).color);

  expect(await ratio('#weak-on-white')).toBeLessThan(4.5);
  expect(await ratio('#weak-on-dark')).toBeLessThan(4.5);

  await page.locator('.acc-toggle-btn').click();
  const contrastButton = page.locator('.acc-btn[data-key="contrast-toggle"]');
  await contrastButton.click();
  await expect(contrastButton).toHaveAttribute('data-contrast-mode', 'smart-contrast');
  await expect(page.locator('html')).toHaveClass(/acc-smart-contrast/);

  // Weak text now passes, by the smallest change that gets it there.
  expect(await ratio('#weak-on-white')).toBeGreaterThanOrEqual(4.5);
  expect(await ratio('#weak-on-white')).toBeLessThan(5);
  expect(await ratio('#weak-on-dark')).toBeGreaterThanOrEqual(4.5);
  expect(await ratio('#inherits')).toBeGreaterThanOrEqual(4.5);
  // Over a gradient the text must read against its lightest color too.
  const [red] = (await color('#on-gradient')).match(/\d+/g).map(Number);
  expect(red).toBeLessThan(120);
  // One grey does read on both white and black, and it is a step away.
  const [wide] = (await color('#on-wide-gradient')).match(/\d+/g).map(Number);
  expect(wide).toBeLessThan(120);
  expect(wide).toBeGreaterThan(100);
  // Text that was fine, and text over a picture, are left alone.
  expect(await color('#fine')).toBe('rgb(30, 30, 30)');
  expect(await color('#on-picture')).toBe('rgb(200, 200, 200)');
  await expect(page.locator('#fine')).not.toHaveAttribute('data-acc-smart-contrast');

  // Text added later is checked too.
  await page.evaluate(() => {
    const late = document.createElement('p');
    late.id = 'late';
    late.style.cssText = 'color: rgb(170, 170, 170); background: rgb(255, 255, 255);';
    late.textContent = 'Arrived later';
    document.getElementById('contrast-samples').append(late);
  });
  await expect.poll(() => ratio('#late')).toBeGreaterThanOrEqual(4.5);

  // Dark Contrast takes over, and nothing of Smart Contrast is left behind.
  await contrastButton.click();
  await expect(page.locator('[data-acc-smart-contrast]')).toHaveCount(0);
  await expect(page.locator('html')).not.toHaveClass(/acc-smart-contrast/);

  // Off again: every color is as the page wrote it.
  await contrastButton.click();
  await contrastButton.click();
  await expect(contrastButton).toHaveAttribute('data-contrast-mode', 'off');
  expect(await color('#weak-on-white')).toBe('rgb(170, 170, 170)');
  expect(await color('#weak-on-dark')).toBe('rgb(90, 90, 90)');
  expect(await page.locator('#weak-on-white').getAttribute('style')).toContain('rgb(170, 170, 170)');
});

test('text laid over a picture keeps the picture, and icons drawn as masks survive Dark Contrast', async ({ page }) => {
  await page.goto('index.html');
  await page.evaluate(() => {
    const box = document.createElement('div');
    box.id = 'banner-sample';
    box.style.cssText = 'position: relative; width: 400px; height: 200px;';
    box.innerHTML = `
      <img alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" style="position: absolute; inset: 0; width: 400px; height: 200px;">
      <div id="over-picture" style="position: absolute; inset: 0;"><p id="banner-text" style="color: rgb(255, 255, 255);">White text on a photo</p></div>`;
    const icon = document.createElement('span');
    icon.id = 'mask-icon';
    icon.style.cssText = 'display: inline-block; width: 20px; height: 20px; background-color: rgb(10, 10, 10); -webkit-mask-image: linear-gradient(#000, #000); mask-image: linear-gradient(#000, #000);';
    document.querySelector('main').prepend(box, icon);
  });
  const style = (selector, property) => page.locator(selector).evaluate((element, name) => window.getComputedStyle(element)[name], property);

  await page.locator('.acc-toggle-btn').click();
  const contrastButton = page.locator('.acc-btn[data-key="contrast-toggle"]');

  // Smart Contrast cannot see the photo, so it leaves the white text white.
  await contrastButton.click();
  await expect(page.locator('#over-picture')).toHaveAttribute('data-acc-over-media', '');
  expect(await style('#banner-text', 'color')).toBe('rgb(255, 255, 255)');
  await expect(page.locator('#banner-text')).not.toHaveAttribute('data-acc-smart-contrast');

  // Dark Contrast dims the photo behind the text instead of covering it.
  await contrastButton.click();
  expect(await style('#over-picture', 'backgroundColor')).toBe('rgba(0, 0, 0, 0.65)');
  expect(await style('#banner-text', 'backgroundColor')).toBe('rgba(0, 0, 0, 0)');
  // An icon drawn as a mask takes the text color instead of turning black on black.
  await expect(page.locator('#mask-icon')).toHaveAttribute('data-acc-mask-icon', 'self');
  expect(await style('#mask-icon', 'backgroundColor')).toBe('rgb(255, 255, 255)');

  // Light Contrast fades the photo the other way.
  await contrastButton.click();
  expect(await style('#over-picture', 'backgroundColor')).toBe('rgba(255, 255, 255, 0.85)');
  await expect(page.locator('#mask-icon')).not.toHaveAttribute('data-acc-mask-icon');

  // Off: no marks are left on the page.
  await contrastButton.click();
  await expect(page.locator('[data-acc-over-media]')).toHaveCount(0);
});

test('Hide Images keeps the layout, the icons inside controls, and embedded frames', async ({ page }) => {
  await page.goto('index.html');
  await page.evaluate(() => {
    const box = document.createElement('div');
    box.id = 'hide-samples';
    box.innerHTML = `
      <button id="icon-button" type="button" aria-label="Menu"><svg width="24" height="24" viewBox="0 0 24 24"><path d="M3 6h18v2H3z"/></svg></button>
      <svg id="loose-drawing" width="24" height="24" viewBox="0 0 24 24"><path d="M3 6h18v2H3z"/></svg>
      <iframe id="frame" title="Embedded form" srcdoc="<p>form</p>" width="200" height="60"></iframe>`;
    document.querySelector('main').prepend(box);
  });
  const visibility = (selector) => page.locator(selector).first().evaluate((element) => window.getComputedStyle(element).visibility);
  const pageHeight = () => page.evaluate(() => document.documentElement.scrollHeight);
  const before = await pageHeight();

  await page.locator('.acc-toggle-btn').click();
  await page.locator('.acc-btn[data-key="hide-images"]').click();
  await expect(page.locator('html')).toHaveClass(/acc-hide-images/);

  expect(await visibility('main img')).toBe('hidden');
  expect(await visibility('#loose-drawing')).toBe('hidden');
  expect(await visibility('#icon-button svg')).toBe('visible');
  expect(await visibility('#frame')).toBe('visible');
  // Hidden pictures keep their space, so nothing on the page moves.
  expect(await pageHeight()).toBe(before);
});

test('Tooltips shows the hidden name of a control or picture, on hover and on focus', async ({ page }) => {
  await page.goto('index.html');
  await page.evaluate(() => {
    const box = document.createElement('div');
    box.id = 'tooltip-samples';
    box.style.cssText = 'display: flex; gap: 40px; padding: 20px;';
    box.innerHTML = `
      <button id="named-icon" type="button" aria-label="Open the shopping cart"><svg width="24" height="24" viewBox="0 0 24 24"><path d="M3 6h18v2H3z"/></svg></button>
      <a id="titled" href="#top" title="Back to the top of the page">Top</a>
      <a id="same" href="#top" aria-label="Plain link">Plain link</a>
      <img id="pictured" alt="A tray of small cakes" width="40" height="40" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">
      <p id="nothing">No hidden text here</p>`;
    document.querySelector('main').prepend(box);
  });
  const bubble = page.locator('.acc-tooltip-bubble');

  await page.locator('.acc-toggle-btn').click();
  await page.locator('.acc-btn[data-key="tooltips"]').click();
  await expect(page.locator('.acc-btn[data-key="tooltips"]')).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape');
  await expect(bubble).toBeHidden();

  // Hovering the drawing inside the button names the button.
  await page.locator('#named-icon svg').hover();
  await expect(bubble).toBeVisible();
  await expect(bubble).toHaveText('Open the shopping cart');
  // A screen reader already has this name; it must not hear it twice.
  await expect(bubble).toHaveAttribute('aria-hidden', 'true');
  const [button, shown] = await Promise.all([page.locator('#named-icon').boundingBox(), bubble.boundingBox()]);
  expect(shown.y).toBeGreaterThanOrEqual(button.y + button.height);
  expect(shown.x).toBeGreaterThanOrEqual(0);

  await page.locator('#pictured').hover();
  await expect(bubble).toHaveText('A tray of small cakes');

  // The element's own title is held back while ours shows, then returned.
  await page.locator('#titled').hover();
  await expect(bubble).toHaveText('Back to the top of the page');
  await expect(page.locator('#titled')).not.toHaveAttribute('title');
  await page.locator('#nothing').hover();
  await expect(bubble).toBeHidden();
  await expect(page.locator('#titled')).toHaveAttribute('title', 'Back to the top of the page');

  // A name that only repeats the visible text adds nothing.
  await page.locator('#same').hover();
  await expect(bubble).toBeHidden();

  // Keyboard focus shows it too, and Escape puts it away.
  await page.locator('#named-icon').focus();
  await expect(bubble).toHaveText('Open the shopping cart');
  await page.keyboard.press('Escape');
  await expect(bubble).toBeHidden();

  await page.locator('.acc-toggle-btn').click();
  await page.locator('.acc-btn[data-key="tooltips"]').click();
  await expect(bubble).toHaveCount(0);
});

test('saturation is a single cycling tile', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  await expect(page.locator('.acc-btn[data-key="low-saturation"]')).toHaveCount(0);
  await expect(page.locator('.acc-btn[data-key="high-saturation"]')).toHaveCount(0);

  const saturationButton = page.locator('.acc-btn[data-key="saturation-toggle"]');
  await expect(saturationButton).toHaveCount(1);
  await expect(saturationButton.locator('.acc-progress-dot')).toHaveCount(3);
  await expect(saturationButton).toHaveAttribute('title', 'Saturation');
  await expect(saturationButton).toHaveAttribute('data-saturation-mode', 'off');

  await saturationButton.click();
  await expect(saturationButton).toHaveClass(/acc-selected/);
  await expect(saturationButton.locator('.acc-progress-dot.active')).toHaveAttribute('data-level', '0');
  await expect(saturationButton).toHaveAttribute('title', 'Saturation: Low Saturation');
  await expect(saturationButton).toHaveAttribute('data-saturation-mode', 'low-saturation');
  let states = await page.evaluate(() => JSON.parse(localStorage.getItem('accweb') || '{}').states || {});
  expect(states['low-saturation']).toBe(true);
  expect(states['high-saturation']).toBeFalsy();

  await saturationButton.click();
  await expect(saturationButton.locator('.acc-progress-dot.active')).toHaveAttribute('data-level', '1');
  await expect(saturationButton).toHaveAttribute('title', 'Saturation: High Saturation');
  await expect(saturationButton).toHaveAttribute('data-saturation-mode', 'high-saturation');
  states = await page.evaluate(() => JSON.parse(localStorage.getItem('accweb') || '{}').states || {});
  expect(states['high-saturation']).toBe(true);
  expect(states['low-saturation']).toBeFalsy();

  await saturationButton.click();
  await expect(saturationButton.locator('.acc-progress-dot.active')).toHaveAttribute('data-level', '2');
  await expect(saturationButton).toHaveAttribute('title', 'Saturation: Monochrome');
  await expect(saturationButton).toHaveAttribute('data-saturation-mode', 'monochrome');
  states = await page.evaluate(() => JSON.parse(localStorage.getItem('accweb') || '{}').states || {});
  expect(states['monochrome']).toBe(true);
  expect(states['high-saturation']).toBeFalsy();

  await saturationButton.click();
  await expect(saturationButton).not.toHaveClass(/acc-selected/);
  await expect(saturationButton.locator('.acc-progress-dot.active')).toHaveCount(0);
  await expect(saturationButton).toHaveAttribute('title', 'Saturation');
  await expect(saturationButton).toHaveAttribute('data-saturation-mode', 'off');
  states = await page.evaluate(() => JSON.parse(localStorage.getItem('accweb') || '{}').states || {});
  expect(states['low-saturation']).toBeFalsy();
  expect(states['high-saturation']).toBeFalsy();
  expect(states['monochrome']).toBeFalsy();
});

test('monochrome grays out page content, persists, and clears on reset', async ({ page }) => {
  const contentFilter = () => page.locator('main').evaluate((el) => window.getComputedStyle(el).filter);

  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  const saturationButton = page.locator('.acc-btn[data-key="saturation-toggle"]');
  // Low → High → Monochrome.
  for (let i = 0; i < 3; i++) {
    await saturationButton.click();
  }
  await expect(saturationButton).toHaveAttribute('data-saturation-mode', 'monochrome');
  await expect(page.locator('#acc-live-region')).toHaveText('Saturation: Monochrome On');
  await expect.poll(contentFilter).toBe('grayscale(1)');
  // The widget itself keeps its colors.
  const hostFilter = await page.locator('#acc-widget-host').evaluate((el) => window.getComputedStyle(el).filter);
  expect(hostFilter).toBe('none');

  await page.reload();
  await expect.poll(contentFilter).toBe('grayscale(1)');
  await page.locator('.acc-toggle-btn').click();
  await expect(saturationButton).toHaveAttribute('data-saturation-mode', 'monochrome');
  await expect(saturationButton).toHaveAttribute('aria-pressed', 'true');

  await page.locator('.acc-action-reset').click();
  await expect.poll(contentFilter).toBe('none');
  await expect(saturationButton).toHaveAttribute('data-saturation-mode', 'off');
  const states = await page.evaluate(() => JSON.parse(localStorage.getItem('accweb') || '{}').states || {});
  expect(states['monochrome']).toBeFalsy();
});

test('menu renders one tile grid with the group names kept for screen readers', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  const headings = page.locator('.acc-options h2');
  await expect(headings).toHaveText(['Speech', 'Text', 'Color & Contrast', 'Reading Aids', 'Interaction']);
  // Visually hidden: no layout box of their own.
  for (const box of await headings.evaluateAll((elements) => elements.map((el) => el.getBoundingClientRect()))) {
    expect(box.width).toBeLessThanOrEqual(1);
    expect(box.height).toBeLessThanOrEqual(1);
  }

  const keys = await page.locator('.acc-options .acc-btn').evaluateAll((tiles) => tiles.map((tile) => tile.dataset.key));
  expect(keys).toEqual([
    'text-to-speech', 'text-scale', 'line-spacing', 'letter-spacing', 'bold-text', 'dyslexia-font', 'readable-text',
    'contrast-toggle', 'saturation-toggle', 'invert-colors',
    'highlight-links', 'reading-aid', 'simple-layout', 'text-magnifier', 'tooltips', 'page-structure',
    'hide-images', 'large-pointer', 'pause-motion', 'mute-sounds'
  ]);
});

test('tiles sit three to a row at desktop width', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  const tiles = page.locator('.acc-options .acc-btn');
  const boxes = await Promise.all([0, 1, 2, 3].map((i) => tiles.nth(i).boundingBox()));
  expect(Math.abs(boxes[0].y - boxes[2].y)).toBeLessThan(1);
  expect(boxes[1].x).toBeGreaterThan(boxes[0].x);
  expect(boxes[2].x).toBeGreaterThan(boxes[1].x);
  expect(boxes[3].y).toBeGreaterThan(boxes[0].y + boxes[0].height - 1);
  expect(boxes[0].height).toBeGreaterThanOrEqual(112);
  // Tiles are wider than tall, and the panel is wide enough that no
  // English label breaks onto a second line.
  expect(boxes[0].height).toBeLessThan(boxes[0].width);
  const wrapped = await page.locator('.acc-options .acc-btn .acc-label').evaluateAll((labels) => (
    labels.filter((label) => label.getClientRects().length > 1 || label.getBoundingClientRect().height > 22)
      .map((label) => label.textContent.trim())
  ));
  expect(wrapped).toEqual([]);
});

test('an option that is on shows a check badge and a primary label', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  const tile = page.locator('.acc-btn[data-key="bold-text"]');
  const badge = () => tile.evaluate((el) => {
    const style = getComputedStyle(el, '::before');
    return { content: style.content, width: style.width, background: style.backgroundColor };
  });

  expect((await badge()).content).toBe('none');
  await tile.click();
  await expect(tile).toHaveAttribute('aria-pressed', 'true');
  const on = await badge();
  expect(on.content).not.toBe('none');
  expect(on.width).toBe('18px');
  expect(on.background).toBe('rgb(0, 114, 228)');
  expect(await tile.locator('.acc-label').evaluate((el) => getComputedStyle(el).color)).toBe('rgb(0, 114, 228)');
  // No On/Off text on the tile itself.
  await expect(tile).toHaveText('Font Weight');
});

test('reset shows how many options are on and is disabled when none are', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  const reset = page.locator('.acc-action-reset');
  const count = reset.locator('.acc-reset-count');
  await expect(reset).toBeDisabled();
  await expect(count).toBeHidden();
  await expect(reset).toHaveAccessibleName('Reset settings');
  const labelLeft = async () => (await reset.locator('.acc-label').boundingBox()).x;
  const labelLeftBefore = await labelLeft();

  await page.locator('.acc-btn[data-key="bold-text"]').click();
  await expect(reset).toBeEnabled();
  await expect(count).toHaveText('1');
  // The label stays where it was when the count appears beside it.
  expect(await labelLeft()).toBe(labelLeftBefore);
  await page.locator('.acc-btn[data-key="text-scale"]').click();
  await page.locator('.acc-btn[data-key="contrast-toggle"]').click();
  await expect(count).toHaveText('3');
  await expect(reset).toHaveAccessibleName('Reset settings 3');

  // The count survives a reload.
  await page.reload();
  await page.locator('.acc-toggle-btn').click();
  await expect(count).toHaveText('3');

  await reset.click();
  await expect(reset).toBeDisabled();
  await expect(count).toBeHidden();
  await expect(page.locator('#acc-live-region')).toHaveText('Settings reset');
  await expect(page.locator('.acc-btn.acc-selected')).toHaveCount(0);
  // Focus stays inside the dialog.
  expect(await page.evaluate(() => document.getElementById('acc-widget-host').shadowRoot.activeElement?.className)).toContain('acc-menu');
});

test('reset settings lives in footer instead of header button', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  await expect(page.locator('.acc-reset-btn')).toHaveCount(0);
  await expect(page.locator('.acc-header-reset')).toHaveCount(0);
  const footerReset = page.locator('.acc-action-reset');
  await expect(footerReset).toHaveCount(1);
  await expect(footerReset).toBeVisible();
  await expect(page.locator('.acc-footer-brand')).toBeVisible();
});

test('Hide widget asks for how long, hides for the visit, and can be undone from the menu', async ({ page }) => {
  await page.goto('index.html');
  const launcher = page.locator('.acc-toggle-btn');
  await launcher.click();

  const more = page.locator('.acc-menu-more');
  const hide = page.locator('.acc-more-hide');
  await expect(hide).toBeHidden();
  await more.click();
  await expect(hide).toBeVisible();
  await expect(hide).toHaveAccessibleName('Hide widget');

  // Clicking Hide does not hide yet: it asks for how long.
  await hide.click();
  expect(await launcher.evaluate((el) => el.hidden)).toBe(false);
  await expect(page.locator('.acc-more-list')).toBeHidden();
  const choices = page.getByRole('radio');
  await expect(choices).toHaveCount(4);
  await expect(page.getByRole('radio', { name: 'This visit' })).toBeChecked();
  await expect(page.getByRole('radio', { name: 'This visit' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio', { name: 'One day' })).toBeChecked();
  await page.keyboard.press('ArrowUp');
  // Whatever the choice, one line says how to get the button back early,
  // and a screen reader hears it with the choices.
  const note = page.locator('.acc-hide-note');
  await expect(note).toBeVisible();
  await expect(note).toHaveText("To bring it back sooner, clear this site's data in your browser.");
  await expect(page.getByRole('radiogroup')).toHaveAccessibleDescription("To bring it back sooner, clear this site's data in your browser.");

  // Close backs out without hiding.
  await page.locator('.acc-hide-cancel').click();
  await expect(page.locator('.acc-hide-panel')).toBeHidden();
  await expect(hide).toBeFocused();
  expect(await launcher.evaluate((el) => el.hidden)).toBe(false);

  await hide.click();
  await page.locator('.acc-hide-confirm').click();
  await expect(page.locator('.acc-menu')).toBeHidden();
  await expect(launcher).toBeHidden();

  // Still hidden on the next page of the same visit.
  await page.reload();
  await expect(launcher).toBeHidden();

  // The menu still opens another way; its Hide button now shows as on,
  // and clicking it brings the floating button back.
  await page.evaluate(() => window.AccessibleWebWidget.instance.open());
  await expect(hide).toHaveAttribute('aria-pressed', 'true');
  await more.click();
  await hide.click();
  expect(await launcher.evaluate((el) => el.hidden)).toBe(false);
  await expect(hide).toHaveAttribute('aria-pressed', 'false');
  await page.evaluate(() => window.AccessibleWebWidget.instance.close());
  await expect(launcher).toBeVisible();
  await page.reload();
  await expect(launcher).toBeVisible();
});

test('Hide widget for one day outlasts the visit and ends on its own', async ({ page, context }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  await page.locator('.acc-menu-more').click();
  await page.locator('.acc-more-hide').click();
  await page.getByRole('radio', { name: 'One day' }).click();
  await page.locator('.acc-hide-confirm').click();
  await expect(page.locator('.acc-toggle-btn')).toBeHidden();

  // A new tab is a new visit: a one-day hide still holds there.
  const second = await context.newPage();
  await second.goto(page.url());
  await expect(second.locator('.acc-toggle-btn')).toBeHidden();

  // Two days on, the button is back.
  await second.clock.install({ time: Date.now() + 2 * 24 * 60 * 60 * 1000 });
  await second.reload();
  await expect(second.locator('.acc-toggle-btn')).toBeVisible();

  // showButton() ends a timed hide at once.
  await page.evaluate(() => window.AccessibleWebWidget.instance.showButton());
  await page.reload();
  await expect(page.locator('.acc-toggle-btn')).toBeVisible();
});

test('hiding the widget always warns first and survives a new visit', async ({ page, context }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  await page.locator('.acc-menu-more').click();
  await page.locator('.acc-more-hide').click();
  await page.getByRole('radio', { name: 'Always' }).click();

  // The first click on Hide only explains how to undo it.
  const warning = page.locator('.acc-hide-warning');
  await expect(warning).toBeHidden();
  await page.locator('.acc-hide-confirm').click();
  await expect(warning).toBeVisible();
  await expect(warning).toContainText('clear this site');
  // The warning says it all; the small line leaves with the choices.
  await expect(page.locator('.acc-hide-note')).toBeHidden();
  await expect(page.locator('.acc-menu')).toBeVisible();
  expect(await page.locator('.acc-toggle-btn').evaluate((el) => el.hidden)).toBe(false);

  // Close backs out; opening the step again starts from the choices.
  await page.locator('.acc-hide-cancel').click();
  await page.locator('.acc-more-hide').click();
  await expect(warning).toBeHidden();
  await expect(page.getByRole('radio')).toHaveCount(4);

  await page.locator('.acc-hide-confirm').click();
  await page.locator('.acc-hide-confirm').click();
  await expect(page.locator('.acc-toggle-btn')).toBeHidden();

  // Still hidden a year later, in a new tab.
  const second = await context.newPage();
  await second.clock.install({ time: Date.now() + 365 * 24 * 60 * 60 * 1000 });
  await second.goto(page.url());
  await expect(second.locator('.acc-toggle-btn')).toBeHidden();
});

test('Move widget flips the button and the menu to the other side and remembers it', async ({ page }) => {
  await page.goto('index.html');
  const launcher = page.locator('.acc-toggle-btn');
  const viewport = page.viewportSize();
  const startsRight = (await launcher.boundingBox()).x > viewport.width / 2;
  await launcher.click();

  const move = page.locator('.acc-more-move');
  await page.locator('.acc-menu-more').click();
  await expect(move).toHaveAccessibleName('Move widget');
  await expect(move).toHaveAttribute('aria-pressed', 'false');
  await move.click();
  await expect(move).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.acc-menu')).toBeVisible();

  const menuBox = await page.locator('.acc-menu').boundingBox();
  const launcherBox = await launcher.boundingBox();
  expect(launcherBox.x > viewport.width / 2).toBe(!startsRight);
  expect(menuBox.x + menuBox.width / 2 > viewport.width / 2).toBe(!startsRight);

  await page.reload();
  expect((await launcher.boundingBox()).x > viewport.width / 2).toBe(!startsRight);

  // A second click puts it back.
  await launcher.click();
  await page.locator('.acc-menu-more').click();
  await move.click();
  await expect(move).toHaveAttribute('aria-pressed', 'false');
  expect((await launcher.boundingBox()).x > viewport.width / 2).toBe(startsRight);
});

test('there is no Hide widget button when the site owner removed the floating button', async ({ page }) => {
  await page.addInitScript(() => {
    window.AccessibleWebWidgetOptions = { hideButton: true };
  });
  await page.goto('index.html');
  await page.evaluate(() => window.AccessibleWebWidget.instance.open());
  await expect(page.locator('.acc-action-reset')).toBeVisible();
  await expect(page.locator('.acc-more-hide')).toHaveCount(0);
  await expect(page.locator('.acc-more-move')).toHaveCount(0);
  await expect(page.locator('.acc-menu-more')).toHaveCount(0);
});

test('the footer links to the accessibility statement, in the menu language', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  const statement = page.locator('.acc-footer-statement');
  await expect(statement).toBeVisible();
  await expect(statement).toHaveAttribute('href', 'https://accessibleweb.pages.dev/statement');
  await expect(statement).toHaveText('Accessibility Statement');

  await page.locator('.acc-lang-row').click();
  await page.locator('.acc-lang-item[data-lang="de"]').click();
  await expect(statement).toHaveText('Erklärung zur Barrierefreiheit');
});

test('hideAttribution removes the footer link but keeps reset', async ({ page }) => {
  await page.addInitScript(() => {
    window.AccessibleWebWidgetOptions = { hideAttribution: true };
  });
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  await expect(page.locator('.acc-action-reset')).toBeVisible();
  await expect(page.locator('.acc-footer')).toHaveCount(0);
  await expect(page.locator('.acc-footer-brand')).toHaveCount(0);
  await expect(page.locator('.acc-footer-statement')).toHaveCount(0);
});

test('the menu uses its own font, fetched from beside the script only once it opens', async ({ page }) => {
  const fontRequests = [];
  page.on('request', (request) => {
    if (/\/fonts\/inter-[a-z-]+\.woff2$/.test(request.url())) fontRequests.push(new URL(request.url()).pathname);
  });
  await page.goto('index.html');
  await page.waitForLoadState('networkidle');
  expect(fontRequests).toEqual([]);

  const loaded = page.waitForResponse((response) => response.url().endsWith('/dist/fonts/inter-latin.woff2') && response.ok());
  await page.locator('.acc-toggle-btn').click();
  await loaded;
  await expect(page.locator('.acc-menu')).toHaveClass(/acc-menu-inter/);
  const family = await page.locator('.acc-btn .acc-label').first().evaluate((el) => getComputedStyle(el).fontFamily);
  expect(family.startsWith('"AccessibleWeb Inter"')).toBe(true);
  // English needs only the Latin part of the font.
  expect(fontRequests).toEqual(['/dist/fonts/inter-latin.woff2']);
});

test('menuFont "system" keeps the device font and fetches nothing', async ({ page }) => {
  const fontRequests = [];
  page.on('request', (request) => {
    if (/\/fonts\/inter-/.test(request.url())) fontRequests.push(request.url());
  });
  await page.addInitScript(() => {
    window.AccessibleWebWidgetOptions = { menuFont: 'system' };
  });
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  await expect(page.locator('.acc-menu')).not.toHaveClass(/acc-menu-inter/);
  const family = await page.locator('.acc-btn .acc-label').first().evaluate((el) => getComputedStyle(el).fontFamily);
  expect(family).not.toContain('AccessibleWeb Inter');
  await page.waitForLoadState('networkidle');
  expect(fontRequests).toEqual([]);
});

test('Text to Speech is the first tile', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  const firstTile = page.locator('.acc-options .acc-btn').first();
  await expect(firstTile).toHaveAttribute('data-key', 'text-to-speech');
  await expect(firstTile.locator('.acc-progress-dot')).toHaveCount(3);
});

test('Text to Speech cycles normal, slow, fast, off and remembers the speed', async ({ page }) => {
  await mockSpeech(page);
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  const tile = page.locator('.acc-btn[data-key="text-to-speech"]');
  const region = page.locator('#acc-live-region');
  const lastSpoken = () => page.evaluate(() => window.__speakPayloads[window.__speakPayloads.length - 1]);
  // The demo page sets ttsRate: 0.9, which becomes the normal speed.
  const speeds = [
    { key: 'normal', rate: 0.9 },
    { key: 'slow', rate: 0.72 },
    { key: 'fast', rate: 1.17 }
  ];
  for (const [index, { key, rate }] of speeds.entries()) {
    await tile.click();
    await expect(tile).toHaveAttribute('aria-pressed', 'true');
    await expect(tile.locator('.acc-progress-dot.active')).toHaveAttribute('data-level', String(index));
    await expect(tile.locator('.acc-label')).toHaveText('Text to Speech');
    await expect(tile).toHaveAccessibleName(`Text to Speech: ${index + 1}`);
    await expect(region).toHaveText(`Text to Speech: ${index + 1} On`);
    expect((await readStates(page))['text-to-speech']).toBe(key);
    // The spoken cue plays at the new speed.
    expect(await lastSpoken()).toEqual({ text: 'Text to Speech On', rate });
  }

  await tile.click();
  await expect(tile).toHaveAttribute('aria-pressed', 'false');
  await expect(region).toHaveText('Text to Speech Off');
  await expect(tile.locator('.acc-label')).toHaveText('Text to Speech');
  expect(await lastSpoken()).toEqual({ text: 'Text to Speech Off', rate: 0.9 });

  // Normal, then slow; after a reload the speed is remembered and used for reading.
  await tile.click();
  await tile.click();
  await page.reload();
  await page.locator('.acc-toggle-btn').click();
  await expect(tile.locator('.acc-progress-dot.active')).toHaveAttribute('data-level', '1');
  await page.keyboard.press('Escape');
  await page.locator('.hero-subtitle').click();
  await expect.poll(lastSpoken).toMatchObject({ rate: 0.72 });
});

test('a legacy Text to Speech on state means normal speed', async ({ page }) => {
  await mockSpeech(page);
  await page.addInitScript(() => {
    localStorage.setItem('accweb', JSON.stringify({ states: { 'text-to-speech': true } }));
  });
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  const tile = page.locator('.acc-btn[data-key="text-to-speech"]');
  await expect(tile).toHaveAttribute('aria-pressed', 'true');
  await expect(tile.locator('.acc-progress-dot.active')).toHaveAttribute('data-level', '0');
  // The next tap moves on to slow.
  await tile.click();
  expect((await readStates(page))['text-to-speech']).toBe('slow');
});

test('Spanish menu translates speech and layout controls', async ({ page }) => {
  await page.addInitScript(() => {
    window.AccessibleWebWidgetOptions = { lang: 'es' };
  });
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  await expect(page.locator('.acc-btn[data-key="text-to-speech"] .acc-label')).toHaveText('Texto a voz');
  await expect(page.locator('.acc-btn[data-key="simple-layout"] .acc-label')).toHaveText('Simplificar diseño');
});

test('reset clears text styling while Simplify Layout is active', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  await page.locator('.acc-btn[data-key="line-spacing"]').click();
  await page.locator('.acc-btn[data-key="simple-layout"]').click();
  await expect(page.locator('html')).toHaveClass(/acc-line-spacing/);
  await expect(page.locator('body')).toHaveClass(/acc-simple-layout-enabled/);

  await page.locator('.acc-action-reset').click();
  await expect(page.locator('html')).not.toHaveClass(/acc-line-spacing/);
  await expect(page.locator('body')).not.toHaveClass(/acc-simple-layout-enabled/);
});

test('saturation neutral icon differs from low saturation icon', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  const saturationButton = page.locator('.acc-btn[data-key="saturation-toggle"]');
  const neutralPath = await saturationButton.locator('path').first().getAttribute('d');

  await saturationButton.click();
  const lowPath = await saturationButton.locator('path').first().getAttribute('d');

  expect(neutralPath).toBeTruthy();
  expect(lowPath).toBeTruthy();
  expect(lowPath).not.toBe(neutralPath);
});

test('violation bubble appears for serious and critical issues', async ({ page }) => {
  await allowDevTools(page);
  await page.goto('index.html?acc-dev=true');
  await page.evaluate(() => {
    window.AccessibleWebWidget.prototype.runBackgroundAxeScan = async function () {
      const results = {
        violations: [
          { impact: 'critical', nodes: [{}, {}] },
          { impact: 'serious', nodes: [{}] }
        ]
      };
      this.axeScanResults = results;
      this.updateViolationBubble(results);
      return results;
    };
  });

  await page.locator('.acc-toggle-btn').click();
  await page.locator('.acc-btn[data-key="accessibility-report"]').click();
  const bubble = page.locator('.acc-violation-bubble');
  await expect(bubble).toBeVisible();
  await expect(bubble).toHaveAttribute('data-severity', 'critical');
  await expect(bubble).toHaveText('2');
});

test('axe-core never loads and bubble stays hidden outside dev mode', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  await page.waitForTimeout(400);
  await expect(page.locator('script[data-acc-axe-core]')).toHaveCount(0);
  await expect(page.locator('.acc-violation-bubble')).toBeHidden();
});

test('persisted annotations state does not load axe-core outside dev mode', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('accweb', JSON.stringify({ states: { annotations: true } }));
  });
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  await page.waitForTimeout(400);
  await expect(page.locator('script[data-acc-axe-core]')).toHaveCount(0);
  await expect(page.locator('.acc-annotation-layer')).toHaveCount(0);
});

const AUDIT_ENGINE_REQUEST = /cdn\.jsdelivr\.net|axe(\.min)?\.js/;
const DEV_TOOLS_HINT = "AccessibleWeb Widget: developer tools are off on this site. Add data-acc-dev-tools to the widget's script tag (or devTools: true to its options) to use ?acc-dev.";

// Records audit-engine requests and the dev tools hint; call before goto.
const watchDevMode = (page) => {
  const watched = { engineRequests: [], hints: 0 };
  page.on('request', (request) => {
    if (AUDIT_ENGINE_REQUEST.test(request.url())) watched.engineRequests.push(request.url());
  });
  page.on('console', (message) => {
    if (message.type() === 'info' && message.text() === DEV_TOOLS_HINT) watched.hints += 1;
  });
  return watched;
};

// Opens the menu and waits past the start-up scan and its post-load rerun.
const openMenuAndSettle = async (page) => {
  await page.locator('.acc-toggle-btn').click();
  await expect(page.locator('.acc-menu')).toBeVisible();
  await page.waitForTimeout(800);
};

const expectDevToolsOff = async (page, watched) => {
  await expect(page.locator('.acc-btn[data-key="annotations"]')).toHaveCount(0);
  await expect(page.locator('.acc-btn[data-key="accessibility-report"]')).toHaveCount(0);
  await expect(page.locator('.acc-violation-bubble')).toBeHidden();
  await expect(page.locator('script[data-acc-axe-core]')).toHaveCount(0);
  expect(watched.engineRequests).toEqual([]);
};

test('?acc-dev=true alone does not turn on dev tools and logs one hint', async ({ page }) => {
  const watched = watchDevMode(page);
  await page.goto('index.html?acc-dev=true');
  await openMenuAndSettle(page);
  await expectDevToolsOff(page, watched);
  expect(watched.hints).toBe(1);
});

test('bare data-acc-dev-tools plus ?acc-dev turns on dev tools', async ({ page }) => {
  await page.goto('fixtures/dev-tools.html?acc-dev');
  await page.locator('.acc-toggle-btn').click();
  await expect(page.locator('.acc-btn[data-key="annotations"]')).toHaveCount(1);
  await expect(page.locator('.acc-btn[data-key="accessibility-report"]')).toHaveCount(1);
});

test('devTools option plus ?acc-dev=true turns on dev tools', async ({ page }) => {
  await allowDevTools(page);
  await page.goto('index.html?acc-dev=true');
  await page.locator('.acc-toggle-btn').click();
  await expect(page.locator('.acc-btn[data-key="annotations"]')).toHaveCount(1);
  await expect(page.locator('.acc-btn[data-key="accessibility-report"]')).toHaveCount(1);
});

test('owner key without ?acc-dev keeps dev tools off and logs no hint', async ({ page }) => {
  const watched = watchDevMode(page);
  await page.goto('fixtures/dev-tools.html');
  await openMenuAndSettle(page);
  await expectDevToolsOff(page, watched);
  expect(watched.hints).toBe(0);
});

test('data-acc-dev-tools="false" keeps dev tools off with ?acc-dev=true', async ({ page }) => {
  const watched = watchDevMode(page);
  await page.goto('fixtures/dev-tools-false.html?acc-dev=true');
  await openMenuAndSettle(page);
  await expectDevToolsOff(page, watched);
  expect(watched.hints).toBe(1);
});

test('owner key with ?acc-dev=false keeps dev tools off', async ({ page }) => {
  const watched = watchDevMode(page);
  await page.goto('fixtures/dev-tools.html?acc-dev=false');
  await openMenuAndSettle(page);
  await expectDevToolsOff(page, watched);
  expect(watched.hints).toBe(0);
});

test('violation bubble stays hidden when no violations exist', async ({ page }) => {
  await allowDevTools(page);
  await page.goto('index.html?acc-dev=true');
  await page.evaluate(() => {
    window.AccessibleWebWidget.prototype.runBackgroundAxeScan = async function () {
      const results = { violations: [] };
      this.axeScanResults = results;
      this.updateViolationBubble(results);
      return results;
    };
  });

  await page.locator('.acc-toggle-btn').click();
  await page.locator('.acc-btn[data-key="accessibility-report"]').click();
  await expect(page.locator('.acc-violation-bubble')).toBeHidden();
});

test('annotation markers render when page annotations is enabled', async ({ page }) => {
  await allowDevTools(page);
  await page.goto('index.html?acc-dev=true');
  await page.evaluate(() => {
    window.AccessibleWebWidget.prototype.runBackgroundAxeScan = async function () {
      const results = {
        violations: [{
          id: 'mock-id',
          impact: 'moderate',
          help: 'Mock heading issue',
          description: 'Mock issue description',
          helpUrl: 'https://example.com/help',
          nodes: [{ target: ['h1'], failureSummary: 'Mock failure summary' }]
        }]
      };
      this.axeScanResults = results;
      this.updateViolationBubble(results);
      return results;
    };
  });

  await page.locator('.acc-toggle-btn').click();
  await page.locator('.acc-btn[data-key="annotations"]').click();
  await expect(page.locator('.acc-annotation-marker')).toHaveCount(1);
});

test('text-to-speech tool is hidden when speech synthesis is unsupported', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      get: () => undefined
    });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      configurable: true,
      writable: true,
      value: undefined
    });
  });

  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  await expect(page.locator('.acc-btn[data-key="text-to-speech"]')).toHaveCount(0);
});

test('text-to-speech waits for click and does not auto-play', async ({ page }) => {
  await page.addInitScript(() => {
    class MockUtterance {
      constructor(text) {
        this.text = text;
        this.lang = '';
        this.voice = null;
        this.rate = 1;
        this.pitch = 1;
        this.onstart = null;
        this.onpause = null;
        this.onresume = null;
        this.onend = null;
        this.onerror = null;
      }
    }

    window.__nativeSpeakPayloads = [];
    const synth = {
      speaking: false,
      paused: false,
      getVoices: () => [{ name: 'Samantha', lang: 'en-US', default: true, localService: true }],
      speak: (utterance) => {
        window.__nativeSpeakPayloads.push({
          text: utterance.text,
          lang: utterance.lang,
          voice: utterance.voice?.name || '',
          rate: utterance.rate,
          pitch: utterance.pitch
        });
        synth.speaking = true;
        if (typeof utterance.onstart === 'function') utterance.onstart();
        setTimeout(() => {
          synth.speaking = false;
          if (typeof utterance.onend === 'function') utterance.onend();
        }, 0);
      },
      cancel: () => {
        synth.speaking = false;
      },
      pause: () => {
        synth.paused = true;
      },
      resume: () => {
        synth.paused = false;
      }
    };

    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      get: () => synth
    });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      configurable: true,
      writable: true,
      value: MockUtterance
    });
  });

  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  await page.locator('.acc-btn[data-key="text-to-speech"]').click();
  await page.keyboard.press('Escape');

  await page.waitForTimeout(200);
  // The announcement ("Text to Speech On") may have fired; record the count
  const countBeforeClick = await page.evaluate(() => window.__nativeSpeakPayloads.length);

  await page.locator('.hero-subtitle').click();
  await expect.poll(async () => page.evaluate(() => window.__nativeSpeakPayloads.length)).toBeGreaterThan(countBeforeClick);
  const payload = await page.evaluate((idx) => window.__nativeSpeakPayloads[idx], countBeforeClick);
  expect(typeof payload.text).toBe('string');
  expect(payload.text.length).toBeGreaterThan(0);
});

test('text-to-speech uses configured native voice and has no control bar', async ({ page }) => {
  await page.addInitScript(() => {
    window.AccessibleWebWidgetOptions = {
      ttsNativeVoiceName: 'Samantha',
      ttsNativeVoiceLang: 'en-US',
      ttsRate: 0.9,
      ttsPitch: 1
    };

    class MockUtterance {
      constructor(text) {
        this.text = text;
        this.lang = '';
        this.voice = null;
        this.rate = 1;
        this.pitch = 1;
        this.onstart = null;
        this.onpause = null;
        this.onresume = null;
        this.onend = null;
        this.onerror = null;
      }
    }

    const voices = [
      { name: 'Thomas', lang: 'fr-FR', default: false, localService: true },
      { name: 'Samantha', lang: 'en-US', default: true, localService: true }
    ];

    window.__nativeSpeakPayloads = [];
    const synth = {
      speaking: false,
      paused: false,
      getVoices: () => voices,
      speak: (utterance) => {
        window.__nativeSpeakPayloads.push({
          text: utterance.text,
          lang: utterance.lang,
          voice: utterance.voice?.name || '',
          rate: utterance.rate,
          pitch: utterance.pitch
        });
        synth.speaking = true;
        if (typeof utterance.onstart === 'function') utterance.onstart();
        setTimeout(() => {
          synth.speaking = false;
          if (typeof utterance.onend === 'function') utterance.onend();
        }, 0);
      },
      cancel: () => {
        synth.speaking = false;
      },
      pause: () => {
        synth.paused = true;
      },
      resume: () => {
        synth.paused = false;
      }
    };

    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      get: () => synth
    });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      configurable: true,
      writable: true,
      value: MockUtterance
    });
  });

  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  await page.locator('.acc-btn[data-key="text-to-speech"]').click();
  await page.keyboard.press('Escape');
  // Record count after announcement, then click content
  const countBeforeClick = await page.evaluate(() => window.__nativeSpeakPayloads.length);
  await page.locator('.container p').first().click();

  await expect.poll(async () => page.evaluate(() => window.__nativeSpeakPayloads.length)).toBeGreaterThan(countBeforeClick);

  const payload = await page.evaluate((idx) => window.__nativeSpeakPayloads[idx], countBeforeClick);
  expect(payload.voice).toBe('Samantha');
  expect(payload.lang).toBe('en-US');
  expect(payload.rate).toBeCloseTo(0.9, 1);
  expect(payload.pitch).toBe(1);

  await expect(page.locator('.acc-tts-bar')).toHaveCount(0);
});

test('simplify layout isolates primary content root', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  await page.locator('.acc-btn[data-key="simple-layout"]').click();

  await expect(page.locator('body')).toHaveClass(/acc-simple-layout-enabled/);
  const layoutRoot = page.locator('.acc-simple-layout-root');
  await expect(layoutRoot).toHaveCount(1);
  const rootStyles = await layoutRoot.first().evaluate((element) => {
    const styles = window.getComputedStyle(element);
    return {
      maxWidth: styles.maxWidth,
      background: styles.backgroundColor
    };
  });
  expect(parseFloat(rootStyles.maxWidth)).toBeGreaterThan(600);
});

// Regression for #22: simplify layout hid every direct body child, which
// swept up the reading guide overlay and made it vanish. The two features
// are independent and must work together.
test('reading guide survives Simplify Layout', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  await page.locator('.acc-btn[data-key="reading-aid"]').click();

  const guide = page.locator('.acc-rg-container');
  await expect(guide).toHaveCount(1);

  await page.locator('.acc-btn[data-key="simple-layout"]').click();
  await expect(page.locator('body')).toHaveClass(/acc-simple-layout-enabled/);

  await expect(guide).toHaveCount(1);
  await expect(guide).not.toHaveClass(/acc-simple-layout-hidden/);
  await expect
    .poll(() => guide.evaluate(element => getComputedStyle(element).display))
    .not.toBe('none');
});

test('system preferences only auto-enable pause motion', async ({ page }) => {
  await page.addInitScript(() => {
    window.matchMedia = (query) => {
      const normalized = String(query || '');
      const matches = (
        normalized === '(prefers-reduced-motion: reduce)' ||
        normalized === '(prefers-color-scheme: dark)'
      );
      return {
        media: normalized,
        matches,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false
      };
    };
  });

  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();
  await expect(page.locator('.acc-btn[data-key="pause-motion"]')).toHaveClass(/acc-selected/);
  await expect(page.locator('.acc-btn[data-key="contrast-toggle"]')).not.toHaveClass(/acc-selected/);

  await page.locator('.acc-action-reset').click();

  const statesAfterReset = await page.evaluate(() => {
    const raw = localStorage.getItem('accweb');
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed.states || {};
  });
  expect(statesAfterReset['pause-motion']).toBe(true);
  expect(statesAfterReset['light-contrast']).toBeFalsy();
  expect(statesAfterReset['dark-contrast']).toBeFalsy();
});

// Light Contrast is the old High Contrast: same rules, same saved key.
const pickLightContrast = async (page) => {
  const contrastButton = page.locator('.acc-btn[data-key="contrast-toggle"]');
  for (let i = 0; i < 3; i++) {
    await contrastButton.click();
  }
  await expect(contrastButton).toHaveAttribute('data-contrast-mode', 'light-contrast');
  return contrastButton;
};

test('Light Contrast applies styles and toggles cleanly', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  const contrastButton = await pickLightContrast(page);
  await expect(page.locator('body')).toHaveClass(/acc-high-contrast-mode/);

  // Verify CSS overrides on page content
  const styles = await page.locator('.container p').first().evaluate((el) => {
    const cs = window.getComputedStyle(el);
    return { color: cs.color, backgroundColor: cs.backgroundColor };
  });
  expect(styles.color).toBe('rgb(0, 0, 0)');
  expect(styles.backgroundColor).toBe('rgb(255, 255, 255)');

  // Widget menu should NOT be affected
  const menuStyles = await page.locator('.acc-menu').evaluate((el) => {
    const cs = window.getComputedStyle(el);
    return { color: cs.color };
  });
  expect(menuStyles.color).not.toBe('rgb(0, 0, 0)');

  // The next click turns Contrast off
  await contrastButton.click();
  await expect(page.locator('body')).not.toHaveClass(/acc-high-contrast-mode/);
});

test('Light Contrast persists and works with other features', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  // Enable Light Contrast + bold text + highlight links simultaneously
  const contrastButton = await pickLightContrast(page);
  await page.locator('.acc-btn[data-key="bold-text"]').click();
  await page.locator('.acc-btn[data-key="highlight-links"]').click();

  await expect(contrastButton).toHaveClass(/acc-selected/);
  await expect(page.locator('.acc-btn[data-key="bold-text"]')).toHaveClass(/acc-selected/);
  await expect(page.locator('.acc-btn[data-key="highlight-links"]')).toHaveClass(/acc-selected/);

  // Persists after reload
  await page.reload();
  await page.locator('.acc-toggle-btn').click();
  await expect(contrastButton).toHaveClass(/acc-selected/);
  await expect(contrastButton.locator('.acc-label')).toHaveText('Light Contrast');
  await expect(page.locator('body')).toHaveClass(/acc-high-contrast-mode/);

  // Reset clears everything
  await page.locator('.acc-action-reset').click();
  await expect(page.locator('body')).not.toHaveClass(/acc-high-contrast-mode/);
  await expect(contrastButton).not.toHaveClass(/acc-selected/);
});

test('saved choices from the old Contrast and High Contrast tiles still mean something', async ({ page }) => {
  // The old tile's faint "light-contrast" filter is now Light Contrast.
  await page.addInitScript(() => {
    if (!window.localStorage.getItem('accweb')) {
      window.localStorage.setItem('accweb', JSON.stringify({ states: { 'light-contrast': true } }));
    }
  });
  await page.goto('index.html');
  await expect(page.locator('body')).toHaveClass(/acc-high-contrast-mode/);
  await page.locator('.acc-toggle-btn').click();
  const contrastButton = page.locator('.acc-btn[data-key="contrast-toggle"]');
  await expect(contrastButton.locator('.acc-label')).toHaveText('Light Contrast');

  // One more click is off, and the old key is cleared with it.
  await contrastButton.click();
  await expect(page.locator('body')).not.toHaveClass(/acc-high-contrast-mode/);
  const states = await readStates(page);
  expect(states['light-contrast']).toBeFalsy();
  expect(states['high-contrast-mode']).toBeFalsy();
});
