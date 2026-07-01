/** @typedef {import('../index.js').default} AccessibleWebWidget */

const MAX_ANNOTATIONS = 50;

/** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
export const annotationMethods = {

  ensureAnnotationLayer() {
    if (this.annotationLayer && document.body.contains(this.annotationLayer)) {
      return this.annotationLayer;
    }
    const layer = document.createElement('div');
    layer.className = 'acc-annotation-layer acc-container';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);
    this.annotationLayer = layer;
    return layer;
  },

  resolveAnnotationTarget(selector) {
    if (!selector || typeof selector !== 'string') return null;
    try {
      const element = document.querySelector(selector);
      if (!element || element.closest('.acc-container')) return null;
      return element;
    } catch {
      return null;
    }
  },

  buildAnnotationEntries(results = {}) {
    const violations = Array.isArray(results.violations) ? results.violations : [];
    const entries = [];
    const seen = new Set();

    violations.forEach((violation) => {
      const nodes = Array.isArray(violation.nodes) ? violation.nodes : [];
      nodes.forEach((node) => {
        const targets = Array.isArray(node.target) ? node.target : [];
        const selector = targets.find((target) => typeof target === 'string' && target.trim().length);
        if (!selector) return;
        const key = `${selector}::${violation.id || violation.help || ''}`;
        if (seen.has(key)) return;

        const element = this.resolveAnnotationTarget(selector);
        if (!element) return;
        seen.add(key);
        entries.push({
          selector,
          element,
          impact: violation.impact || 'minor',
          title: violation.help || this.translate('Issue'),
          description: violation.description || '',
          helpUrl: violation.helpUrl || '',
          failureSummary: node.failureSummary || ''
        });
      });
    });

    return entries.slice(0, MAX_ANNOTATIONS);
  },

  createAnnotationMarker(annotation) {
    const marker = document.createElement('button');
    marker.type = 'button';
    marker.className = 'acc-annotation-marker';
    marker.dataset.impact = annotation.impact || 'minor';
    marker.setAttribute('aria-label', annotation.title);
    marker.title = annotation.title;
    marker.innerHTML = '';

    marker.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.showAnnotationPopup(annotation, marker);
    });

    return marker;
  },

  positionAnnotationPopup(popup, marker) {
    if (!popup || !marker) return;
    const markerRect = marker.getBoundingClientRect();
    const popupWidth = popup.offsetWidth || 300;
    const popupHeight = popup.offsetHeight || 180;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const gap = 10;

    let left = window.scrollX + markerRect.left + gap;
    let top = window.scrollY + markerRect.bottom + gap;

    if (left + popupWidth > window.scrollX + viewportWidth - gap) {
      left = window.scrollX + viewportWidth - popupWidth - gap;
    }
    if (left < window.scrollX + gap) {
      left = window.scrollX + gap;
    }

    if (top + popupHeight > window.scrollY + viewportHeight - gap) {
      top = window.scrollY + markerRect.top - popupHeight - gap;
    }
    if (top < window.scrollY + gap) {
      top = window.scrollY + gap;
    }

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
  },

  clearAnnotationPopup() {
    if (this.annotationPopup) {
      this.annotationPopup.remove();
      this.annotationPopup = null;
    }
  },

  showAnnotationPopup(annotation, marker) {
    if (!annotation || !marker || !this.annotationLayer) return;
    this.clearAnnotationPopup();

    const safeHelpUrl = this.sanitizeUrl(annotation.helpUrl);
    const popup = document.createElement('div');
    popup.className = 'acc-annotation-popup';
    popup.innerHTML = `
      <div class="acc-annotation-popup-header">
        <h3 class="acc-annotation-popup-title">${this.escapeHtml(annotation.title)}</h3>
        <button type="button" class="acc-annotation-popup-close" aria-label="${this.translate('Close')}">${this.widgetIcons.close}</button>
      </div>
      <p><strong>${this.translate(this.capitalizeFirst(annotation.impact))}</strong></p>
      <p>${this.escapeHtml(annotation.description)}</p>
      ${annotation.failureSummary ? `<p><strong>${this.translate('Issue')}:</strong> ${this.escapeHtml(annotation.failureSummary)}</p>` : ''}
      ${safeHelpUrl ? `<p><a href="${safeHelpUrl}" target="_blank" rel="noopener">${this.translate('How to Fix')} →</a></p>` : ''}
    `;
    popup.__accMarker = marker;

    const closeButton = popup.querySelector('.acc-annotation-popup-close');
    closeButton?.addEventListener('click', () => this.clearAnnotationPopup());

    this.annotationLayer.appendChild(popup);
    this.annotationPopup = popup;
    this.positionAnnotationPopup(popup, marker);
  },

  positionAnnotations() {
    if (!Array.isArray(this.annotationItems) || !this.annotationItems.length) return;

    this.annotationItems.forEach((item) => {
      if (!item?.target || !item?.marker) return;
      if (!document.contains(item.target)) {
        item.marker.hidden = true;
        return;
      }

      const rect = item.target.getBoundingClientRect();
      const outOfView = (
        rect.width <= 0 ||
        rect.height <= 0 ||
        rect.bottom < 0 ||
        rect.top > window.innerHeight ||
        rect.right < 0 ||
        rect.left > window.innerWidth
      );

      if (outOfView) {
        item.marker.hidden = true;
        return;
      }

      item.marker.hidden = false;
      item.marker.style.top = `${window.scrollY + rect.top + Math.min(16, rect.height / 2)}px`;
      item.marker.style.left = `${window.scrollX + rect.right}px`;
    });

    if (this.annotationPopup?.__accMarker && !this.annotationPopup.__accMarker.hidden) {
      this.positionAnnotationPopup(this.annotationPopup, this.annotationPopup.__accMarker);
    }
  },

  enableAnnotations(enable = false) {
    if (!enable) {
      this.disableAnnotations();
      return;
    }

    const requestId = ++this.annotationRequestId;
    this.disableAnnotations({ cancelPending: false });
    const layer = this.ensureAnnotationLayer();

    this.runBackgroundAxeScan()
      .then((results) => {
        if (requestId !== this.annotationRequestId || !this.retrieveState('annotations')) {
          return;
        }
        const annotations = this.buildAnnotationEntries(results);
        this.annotationItems = annotations.map((annotation) => {
          const marker = this.createAnnotationMarker(annotation);
          layer.appendChild(marker);
          return {
            marker,
            target: annotation.element,
            data: annotation
          };
        });

        if (!this.annotationRepositionHandler) {
          this.annotationRepositionHandler = this.throttle(() => this.positionAnnotations(), 80);
        }
        window.addEventListener('scroll', this.annotationRepositionHandler, { passive: true });
        window.addEventListener('resize', this.annotationRepositionHandler, { passive: true });

        if (!this.annotationOutsideHandler) {
          this.annotationOutsideHandler = (event) => {
            if (!this.annotationPopup) return;
            const clickedPopup = this.annotationPopup.contains(event.target);
            const clickedMarker = event.target?.closest?.('.acc-annotation-marker');
            if (!clickedPopup && !clickedMarker) {
              this.clearAnnotationPopup();
            }
          };
        }
        document.addEventListener('click', this.annotationOutsideHandler, true);

        this.positionAnnotations();
      })
      .catch((error) => {
        console.warn('Failed to render annotations:', error);
      });
  },

  disableAnnotations({ cancelPending = true } = {}) {
    if (cancelPending) {
      this.annotationRequestId += 1;
    }
    this.clearAnnotationPopup();

    if (this.annotationOutsideHandler) {
      document.removeEventListener('click', this.annotationOutsideHandler, true);
    }
    if (this.annotationRepositionHandler) {
      window.removeEventListener('scroll', this.annotationRepositionHandler);
      window.removeEventListener('resize', this.annotationRepositionHandler);
    }

    if (this.annotationLayer) {
      this.annotationLayer.remove();
      this.annotationLayer = null;
    }

    this.annotationItems = [];
  },

};
