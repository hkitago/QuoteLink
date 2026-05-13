(() => {
  const getPageTitle = async (
    defaultTitle = location.hostname,
    timeout = 3000
  ) => {
    const initialTitle = document.title?.trim();
    if (initialTitle) return initialTitle;

    const head = document.head;
    if (!head) return defaultTitle;

    return new Promise((resolve) => {
      let settled = false;

      const finish = (title) => {
        if (settled) return;

        settled = true;

        observer.disconnect();
        clearTimeout(timer);

        resolve(title || defaultTitle);
      };

      const observer = new MutationObserver(() => {
        const title = document.title?.trim();

        if (title) finish(title);
      });

      observer.observe(head, {
        childList: true,
        subtree: true,
        characterData: true,
      });

      const timer = setTimeout(() => {
        finish(document.title?.trim());
      }, timeout);
    });
  };

  const updatePageInfo = async (selection) => {
    try {
      const pageTitle = await getPageTitle();

      await browser.runtime.sendMessage({
        action: 'UPDATE_PAGE_INFO',
        text: selection,
        title: pageTitle,
        url: window.location.href
      });
    } catch (error) {
      console.error('[QuoteLinkExtension] Failed to send UPDATE_PAGE_INFO message:', error);
    }
  };

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const getCleanSelection = () => {
    return window.getSelection().toString().trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  };

  const updateSelectionAndPageInfo = debounce(async () => {
    const currentSelection = getCleanSelection();
    try {
      const result = await browser.storage.local.get('lastSelection');
      const lastSelection = result.lastSelection || '';
      if (currentSelection !== lastSelection) {
        await browser.storage.local.set({ lastSelection: currentSelection });
        await updatePageInfo(currentSelection);
      }
    } catch (error) {
      console.error('[QuoteLinkExtension] Failed to send UPDATE_PAGE_INFO message:', error);
    }
  }, 300);

  // ========================================
  // Event listeners
  // ========================================
  document.addEventListener('selectionchange', updateSelectionAndPageInfo);

  // Using history back or forward
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      updatePageInfo(getCleanSelection());
    } else if (document.readyState !== 'loading') {
      updatePageInfo(getCleanSelection());
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        updatePageInfo(getCleanSelection());
      });
    }
  });

  const getPageInfoPayload = async () => {
    const selectedText = getCleanSelection();
    const pageTitle = await getPageTitle();
    return {
      selectedText,
      pageTitle,
      currentUrl: window.location.href
    };
  };

  // Switching tabs from background.js
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'GET_PAGE_INFO') {
      updatePageInfo(getCleanSelection());
    }

    if (message.action === 'REQUEST_PAGE_INFO') {
      getPageInfoPayload()
        .then(sendResponse)
        .catch((error) => {
          console.error('[QuoteLinkExtension] Failed to build page info payload:', error);
          sendResponse(null);
        });
      return true;
    }
  });

  // ========================================
  // Initialization
  // ========================================
  const initializeContent = () => {
    updatePageInfo(getCleanSelection());
  };

  if (document.readyState !== 'loading') {
    initializeContent();
  } else {
    document.addEventListener('DOMContentLoaded', initializeContent, { once: true });
  }
})();
