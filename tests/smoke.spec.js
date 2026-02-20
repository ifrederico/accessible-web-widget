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

test('violation bubble appears for serious and critical issues', async ({ page }) => {
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

test('violation bubble stays hidden when no violations exist', async ({ page }) => {
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

  await page.locator('h1').first().click();
  await expect.poll(async () => page.evaluate(() => window.__nativeSpeakPayloads.length)).toBeGreaterThan(countBeforeClick);
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
  await expect(page.locator('.container')).toHaveClass(/acc-simple-layout-root/);
  const rootStyles = await page.locator('.container').evaluate((element) => {
    const styles = window.getComputedStyle(element);
    return {
      maxWidth: styles.maxWidth,
      background: styles.backgroundColor
    };
  });
  expect(parseFloat(rootStyles.maxWidth)).toBeGreaterThan(600);
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
  await expect(page.locator('.acc-btn[data-key="dark-contrast"]')).not.toHaveClass(/acc-selected/);

  await page.locator('.acc-reset-btn').click();

  const statesAfterReset = await page.evaluate(() => {
    const raw = localStorage.getItem('accweb');
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed.states || {};
  });
  expect(statesAfterReset['pause-motion']).toBe(true);
  expect(statesAfterReset['dark-contrast']).toBeFalsy();
});

test('high contrast mode applies styles and toggles cleanly', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  // Enable high contrast
  await page.locator('.acc-btn[data-key="high-contrast-mode"]').click();
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

  // Toggle off
  await page.locator('.acc-btn[data-key="high-contrast-mode"]').click();
  await expect(page.locator('body')).not.toHaveClass(/acc-high-contrast-mode/);
});

test('high contrast mode persists and works with other features', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.acc-toggle-btn').click();

  // Enable high contrast + bold text + highlight links simultaneously
  await page.locator('.acc-btn[data-key="high-contrast-mode"]').click();
  await page.locator('.acc-btn[data-key="bold-text"]').click();
  await page.locator('.acc-btn[data-key="highlight-links"]').click();

  await expect(page.locator('.acc-btn[data-key="high-contrast-mode"]')).toHaveClass(/acc-selected/);
  await expect(page.locator('.acc-btn[data-key="bold-text"]')).toHaveClass(/acc-selected/);
  await expect(page.locator('.acc-btn[data-key="highlight-links"]')).toHaveClass(/acc-selected/);

  // Persists after reload
  await page.reload();
  await page.locator('.acc-toggle-btn').click();
  await expect(page.locator('.acc-btn[data-key="high-contrast-mode"]')).toHaveClass(/acc-selected/);
  await expect(page.locator('body')).toHaveClass(/acc-high-contrast-mode/);

  // Reset clears everything
  await page.locator('.acc-reset-btn').click();
  await expect(page.locator('body')).not.toHaveClass(/acc-high-contrast-mode/);
  await expect(page.locator('.acc-btn[data-key="high-contrast-mode"]')).not.toHaveClass(/acc-selected/);
});
