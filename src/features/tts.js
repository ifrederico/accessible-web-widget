/** @typedef {import('../index.js').default} AccessibleWebWidget */

/** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
export const ttsMethods = {

  supportsSpeechSynthesis() {
    if (typeof window === 'undefined') return false;
    return (
      'speechSynthesis' in window &&
      typeof window.SpeechSynthesisUtterance !== 'undefined'
    );
  },

  supportsTextToSpeech() {
    return this.supportsSpeechSynthesis();
  },

  normalizeSpeechLanguage(languageCode = 'en') {
    const code = String(languageCode || 'en').toLowerCase();
    const languageMap = {
      en: 'en-US',
      pt: 'pt-BR',
      it: 'it-IT',
      fr: 'fr-FR',
      de: 'de-DE',
      es: 'es-ES',
      ru: 'ru-RU',
      pl: 'pl-PL',
      ro: 'ro-RO',
      nl: 'nl-NL',
      uk: 'uk-UA',
      ar: 'ar-SA',
      he: 'he-IL'
    };
    return languageMap[code] || code;
  },

  getNativeTtsRate() {
    const configured = Number(this.nativeTtsConfig?.rate);
    if (!Number.isFinite(configured)) return 1;
    return Math.min(2, Math.max(0.5, configured));
  },

  getNativeTtsPitch() {
    const configured = Number(this.nativeTtsConfig?.pitch);
    if (!Number.isFinite(configured)) return 1;
    return Math.min(2, Math.max(0, configured));
  },

  isElementVisibleForTts(element) {
    if (!(element instanceof Element)) return false;
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') {
      return false;
    }
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  },

  isTtsExcludedElement(element, { allowLandmarkRegions = false } = {}) {
    if (!(element instanceof Element)) return true;
    if (element.closest('.acc-container')) return true;
    if (element.closest('script,style,noscript,template')) return true;
    if (element.closest('[aria-hidden="true"]')) return true;
    if (
      !allowLandmarkRegions &&
      element.closest(
        'nav,header,footer,aside,form,dialog,[role="navigation"],[role="complementary"],[role="search"],[role="menu"],[role="dialog"],[role="alert"],[aria-live]'
      )
    ) {
      return true;
    }
    return false;
  },

  normalizeReadableText(text = '') {
    return String(text)
      .replace(/\s+/g, ' ')
      .replace(/[ \t]+([,.;!?])/g, '$1')
      .trim();
  },

  getTtsCandidateRoots() {
    const selectors = [
      'article',
      'main',
      '[role="main"]',
      '.content',
      '.post',
      '.entry-content',
      '#content'
    ];
    const roots = [];
    const seen = new Set();

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        if (!(element instanceof Element)) return;
        if (this.isTtsExcludedElement(element) || !this.isElementVisibleForTts(element)) return;
        if (seen.has(element)) return;
        seen.add(element);
        roots.push(element);
      });
    });

    return roots;
  },

  getPrimaryContentRoot() {
    if (typeof document === 'undefined') return null;
    const candidates = this.getTtsCandidateRoots();
    if (!candidates.length) {
      const explicitCandidates = Array.from(
        document.querySelectorAll('main,article,[role="main"],#content,.content,.post,.entry-content')
      ).filter((element) =>
        element instanceof Element &&
        !this.isTtsExcludedElement(element) &&
        this.isElementVisibleForTts(element)
      );

      if (explicitCandidates.length) {
        let explicitBest = explicitCandidates[0];
        let explicitBestScore = -1;
        explicitCandidates.forEach((candidate) => {
          const textLength = this.normalizeReadableText(candidate.innerText || candidate.textContent || '').length;
          const rect = candidate.getBoundingClientRect();
          const score = textLength + (rect.width * rect.height * 0.0025);
          if (score > explicitBestScore) {
            explicitBestScore = score;
            explicitBest = candidate;
          }
        });
        return explicitBest;
      }

      if (document.body) {
        const topLevelCandidates = Array.from(document.body.children).filter((element) =>
          element instanceof Element &&
          !element.classList.contains('acc-container') &&
          this.isElementVisibleForTts(element)
        );

        if (topLevelCandidates.length) {
          let best = topLevelCandidates[0];
          let bestScore = -1;
          topLevelCandidates.forEach((candidate) => {
            const textLength = this.normalizeReadableText(candidate.innerText || candidate.textContent || '').length;
            const rect = candidate.getBoundingClientRect();
            const score = textLength + (rect.width * rect.height * 0.0025);
            if (score > bestScore) {
              bestScore = score;
              best = candidate;
            }
          });
          return best;
        }
      }

      return document.body;
    }

    let bestRoot = candidates[0];
    let bestScore = -1;
    candidates.forEach((candidate) => {
      const blocks = this.extractReadableBlocks(candidate);
      const score = blocks.join(' ').length;
      if (score > bestScore) {
        bestScore = score;
        bestRoot = candidate;
      }
    });
    return bestRoot;
  },

  extractReadableBlocks(root) {
    if (!(root instanceof Element)) return [];
    const blockSelector = 'h1,h2,h3,h4,h5,h6,p,li,dt,dd,blockquote,figcaption,caption,th,td';
    const blocks = [];
    root.querySelectorAll(blockSelector).forEach((element) => {
      if (!(element instanceof Element)) return;
      if (this.isTtsExcludedElement(element) || !this.isElementVisibleForTts(element)) return;
      const text = this.normalizeReadableText(element.innerText || element.textContent || '');
      if (text.length < 15) return;
      blocks.push(text);
    });
    return blocks;
  },

  getReadableContent() {
    if (typeof document === 'undefined') return '';
    const candidateRoots = this.getTtsCandidateRoots();
    let bestBlocks = [];
    let bestScore = -1;

    candidateRoots.forEach((root) => {
      const blocks = this.extractReadableBlocks(root);
      if (!blocks.length) return;
      const characterCount = blocks.join(' ').length;
      const score = (blocks.length * 60) + characterCount;
      if (score > bestScore) {
        bestScore = score;
        bestBlocks = blocks;
      }
    });

    if (!bestBlocks.length && document.body) {
      bestBlocks = this.extractReadableBlocks(document.body);
    }

    if (!bestBlocks.length && document.body) {
      const fallback = this.normalizeReadableText(document.body.innerText || document.body.textContent || '');
      return fallback.slice(0, 30000);
    }

    return bestBlocks.join('\n\n').slice(0, 30000);
  },

  splitLongSpeechSegment(segment, maxLength = 240) {
    if (!segment) return [];
    if (segment.length <= maxLength) return [segment];

    const parts = [];
    let remaining = segment;
    while (remaining.length > maxLength) {
      let splitIndex = remaining.lastIndexOf(',', maxLength);
      if (splitIndex < Math.floor(maxLength * 0.5)) {
        splitIndex = remaining.lastIndexOf(' ', maxLength);
      }
      if (splitIndex < Math.floor(maxLength * 0.5)) {
        splitIndex = maxLength;
      }
      parts.push(remaining.slice(0, splitIndex).trim());
      remaining = remaining.slice(splitIndex).trim();
    }
    if (remaining.length) {
      parts.push(remaining);
    }
    return parts.filter(Boolean);
  },

  buildSpeechQueue(text = '') {
    const normalized = this.normalizeReadableText(text);
    if (!normalized) return [];

    const paragraphCandidates = text
      .split(/\n{2,}/)
      .map((paragraph) => this.normalizeReadableText(paragraph))
      .filter(Boolean);

    const paragraphs = paragraphCandidates.length ? paragraphCandidates : [normalized];
    const queue = [];

    paragraphs.forEach((paragraph) => {
      const sentences = paragraph.split(/(?<=[.!?])\s+/).filter(Boolean);
      const sentenceList = sentences.length ? sentences : [paragraph];
      let chunk = '';

      sentenceList.forEach((sentence) => {
        const next = chunk ? `${chunk} ${sentence}` : sentence;
        if (next.length <= 240) {
          chunk = next;
          return;
        }
        if (chunk) {
          queue.push(...this.splitLongSpeechSegment(chunk, 240));
        }
        chunk = sentence;
      });

      if (chunk) {
        queue.push(...this.splitLongSpeechSegment(chunk, 240));
      }
    });

    return queue.slice(0, 300);
  },

  resolveSpeechVoice(languageCode) {
    if (!this.supportsSpeechSynthesis()) return null;
    const synth = window.speechSynthesis;
    const voices = synth.getVoices?.() || [];
    if (!voices.length) return null;

    const preferredVoiceName = String(this.nativeTtsConfig?.preferredVoiceName || '').trim().toLowerCase();
    if (preferredVoiceName) {
      const byExactName = voices.find((voice) => String(voice.name || '').trim().toLowerCase() === preferredVoiceName);
      if (byExactName) return byExactName;
      const byNameContains = voices.find((voice) => String(voice.name || '').toLowerCase().includes(preferredVoiceName));
      if (byNameContains) return byNameContains;
    }

    const configuredVoiceLang = String(this.nativeTtsConfig?.preferredVoiceLang || '').trim();
    const targetLanguage = configuredVoiceLang || languageCode;
    const normalized = this.normalizeSpeechLanguage(targetLanguage).toLowerCase();
    const primary = normalized.split('-')[0];
    const localExact = voices.find((voice) => (
      voice.localService &&
      String(voice.lang || '').toLowerCase() === normalized
    ));
    const exact = voices.find((voice) => String(voice.lang || '').toLowerCase() === normalized);
    const localByPrimary = voices.find((voice) => (
      voice.localService &&
      String(voice.lang || '').toLowerCase().startsWith(primary)
    ));
    const byPrimary = voices.find((voice) => String(voice.lang || '').toLowerCase().startsWith(primary));
    const defaultVoice = voices.find((voice) => voice.default);
    return localExact || exact || localByPrimary || byPrimary || defaultVoice || voices[0];
  },

  getSpeechTargetFromEvent(event) {
    const target = event?.target;
    if (!(target instanceof Element)) return null;
    if (target.closest('.acc-container')) return null;

    const block = target.closest('h1,h2,h3,h4,h5,h6,p,li,dt,dd,blockquote,figcaption,caption,th,td,div,section');
    if (!(block instanceof Element)) return null;
    if (this.isTtsExcludedElement(block, { allowLandmarkRegions: true }) || !this.isElementVisibleForTts(block)) return null;

    const text = this.normalizeReadableText(block.innerText || block.textContent || '');
    if (text.length < 2) return null;

    return {
      element: block,
      text: text.slice(0, 30000)
    };
  },

  setActiveSpeechTarget(element = null) {
    if (this.ttsActiveTarget && this.ttsActiveTarget !== element) {
      this.ttsActiveTarget.classList.remove('acc-tts-active-block');
    }
    this.ttsActiveTarget = element;
    if (this.ttsActiveTarget) {
      this.ttsActiveTarget.classList.add('acc-tts-active-block');
    }
  },

  startTtsClickMode() {
    if (typeof document === 'undefined' || this.ttsClickListener) return;
    this.ttsClickListener = (event) => {
      this.handleTtsClick(event);
    };
    document.addEventListener('click', this.ttsClickListener, true);
    document.body?.classList.add('acc-tts-click-mode');
  },

  stopTtsClickMode() {
    if (typeof document === 'undefined') return;
    if (this.ttsClickListener) {
      document.removeEventListener('click', this.ttsClickListener, true);
      this.ttsClickListener = null;
    }
    document.body?.classList.remove('acc-tts-click-mode');
    this.setActiveSpeechTarget(null);
  },

  handleTtsClick(event) {
    if (!this.retrieveState('text-to-speech')) return;
    const target = this.getSpeechTargetFromEvent(event);
    if (!target) return;

    this.setActiveSpeechTarget(target.element);
    this.ttsTextCache = target.text;
    this.startSpeechPlayback({ restart: true });
  },

  ensureTtsQueue() {
    const text = this.ttsTextCache || this.getReadableContent();
    if (!text) {
      this.ttsQueue = [];
      this.ttsQueueIndex = 0;
      return false;
    }
    this.ttsTextCache = text;
    this.ttsQueue = this.buildSpeechQueue(text);
    this.ttsQueueIndex = 0;
    return this.ttsQueue.length > 0;
  },

  speakNextTtsChunk(sessionId) {
    if (!this.supportsSpeechSynthesis()) return;
    if (sessionId !== this.ttsSessionId) return;

    if (this.ttsQueueIndex >= this.ttsQueue.length) {
      this.ttsStatus = 'stopped';
      this.setActiveSpeechTarget(null);
      return;
    }

    const synth = window.speechSynthesis;
    const chunk = this.ttsQueue[this.ttsQueueIndex];
    if (!chunk) {
      this.ttsQueueIndex += 1;
      this.speakNextTtsChunk(sessionId);
      return;
    }

    const utterance = new window.SpeechSynthesisUtterance(chunk);
    utterance.lang = this.normalizeSpeechLanguage(this.loadConfig().lang || 'en');
    if (!this.ttsVoice || this.ttsVoice.lang?.toLowerCase() !== utterance.lang.toLowerCase()) {
      this.ttsVoice = this.resolveSpeechVoice(utterance.lang);
    }
    if (this.ttsVoice) {
      utterance.voice = this.ttsVoice;
    }
    utterance.rate = this.getNativeTtsRate();
    utterance.pitch = this.getNativeTtsPitch();

    utterance.onstart = () => {
      if (sessionId !== this.ttsSessionId) return;
      this.ttsStatus = 'reading';
    };
    utterance.onpause = () => {
      if (sessionId !== this.ttsSessionId) return;
      this.ttsStatus = 'paused';
    };
    utterance.onresume = () => {
      if (sessionId !== this.ttsSessionId) return;
      this.ttsStatus = 'reading';
    };
    utterance.onend = () => {
      if (sessionId !== this.ttsSessionId) return;
      this.ttsQueueIndex += 1;
      this.speakNextTtsChunk(sessionId);
    };
    utterance.onerror = () => {
      if (sessionId !== this.ttsSessionId) return;
      this.ttsStatus = 'stopped';
      this.setActiveSpeechTarget(null);
    };

    this.ttsUtterance = utterance;
    synth.speak(utterance);
  },

  startNativeSpeechPlayback({ restart = false } = {}) {
    if (!this.supportsSpeechSynthesis()) return;
    const synth = window.speechSynthesis;

    if (!restart && synth.paused) {
      synth.resume();
      this.ttsStatus = 'reading';
      return;
    }

    const hasQueue = restart || !this.ttsQueue.length || this.ttsQueueIndex >= this.ttsQueue.length
      ? this.ensureTtsQueue()
      : true;
    if (!hasQueue) {
      this.stopSpeech();
      return;
    }

    const sessionId = this.ttsSessionId + 1;
    this.ttsSessionId = sessionId;
    synth.cancel();
    this.ttsStatus = 'reading';
    this.speakNextTtsChunk(sessionId);
  },

  startSpeechPlayback({ restart = false } = {}) {
    this.startNativeSpeechPlayback({ restart });
  },



  stopSpeech() {
    const synth = this.supportsSpeechSynthesis() ? window.speechSynthesis : null;
    this.ttsSessionId += 1;
    if (synth && (synth.speaking || synth.paused)) {
      synth.cancel();
    }
    this.ttsUtterance = null;
    this.ttsQueueIndex = 0;
    this.ttsStatus = 'stopped';
    this.setActiveSpeechTarget(null);
  },

  enableTextToSpeech(enable = false) {
    if (!this.supportsTextToSpeech()) return;
    const isUserToggle = this.userInitiatedToggleKey === 'text-to-speech';

    if (!enable) {
      if (isUserToggle) this.announceTtsState(false);
      this.stopSpeech();
      this.stopTtsClickMode();
      return;
    }

    const synth = window.speechSynthesis;
    if (synth?.getVoices) {
      synth.getVoices();
    }

    this.startTtsClickMode();
    this.ttsStatus = 'idle';
    if (isUserToggle) this.announceTtsState(true);
  },

  announceTtsState(active) {
    if (!this.supportsTextToSpeech()) return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    const msg = active
      ? this.translate('Text to Speech On')
      : this.translate('Text to Speech Off');
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(msg);
    const lang = this.normalizeSpeechLanguage(this.loadConfig().lang || 'en');
    utterance.lang = lang;
    const voice = this.resolveSpeechVoice(lang);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = this.getNativeTtsRate();
    utterance.pitch = this.getNativeTtsPitch();
    synth.speak(utterance);
  },

};
