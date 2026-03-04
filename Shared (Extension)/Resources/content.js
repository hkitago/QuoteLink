(() => {
  const getCleanSelection = () => {
    return window.getSelection().toString().trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  };

  const getPageTitle = async (defaultFilename = 'Untitled') => {
    let pageTitle = document.title;
    if (pageTitle) return pageTitle;

    try {
      pageTitle = await new Promise((resolve) => {
        const headElement = document.querySelector('head');
        if (!headElement) {
          resolve('');
          return;
        }

        const observer = new MutationObserver((mutations, obs) => {
          const titleElement = document.querySelector('title');
          if (titleElement && document.title) {
            obs.disconnect();
            resolve(document.title);
          }
        });

        observer.observe(headElement, { childList: true, subtree: true });

        setTimeout(() => {
          observer.disconnect();
          resolve(document.title || defaultFilename);
        }, 3000);
      });

      return pageTitle;
    } catch (error) {
      console.error('[QuoteLinkExtension] Failed to get page title:', error);
      return defaultFilename;
    }
  };

  const updatePageInfo = async (selection) => {
    try {
      const pageTitle = await getPageTitle();

      await browser.runtime.sendMessage({
        action: 'updatePageInfo',
        text: selection,
        title: pageTitle,
        url: window.location.href
      });
    } catch (error) {
      console.error('[QuoteLinkExtension] Failed to send updatePageInfo message:', error);
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
      console.error('[QuoteLinkExtension] Failed to send update​Page​Info message:', error);
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
    if (message.action === 'getPageInfo') {
      updatePageInfo(getCleanSelection());
    }

    if (message.action === 'requestPageInfo') {
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
