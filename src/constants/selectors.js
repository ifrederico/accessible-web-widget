export const TARGET_SELECTORS = {
      ALL: ['', '*:not(.material-icons,.acc-menu,.acc-menu *)'],
      LINKS: ["a[href]"],
      HEADERS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', '.wsite-headline', '.wsite-content-title'],
      TEXT: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', '.wsite-headline', '.wsite-content-title', 'img', 'p', 'i', 'svg', 'a', 'button:not(.acc-btn)', 'label', 'li', 'ol']
    };

export const PAGE_CONTENT_SELECTOR = 'body > *:not(.acc-container):not(.acc-rg-container):not(#acc-skip-link)';
