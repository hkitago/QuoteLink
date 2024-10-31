(() => {
  const getCleanSelection = () => {
    return window.getSelection().toString().trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  };

  const updatePageInfo = async (selection) => {
    try {
      let pageTitle = document.title;

      if (!pageTitle) {
        pageTitle = await new Promise((resolve) => {
          const titleObserver = new MutationObserver((mutations, observer) => {
            if (document.title) {
              observer.disconnect();
              resolve(document.title);
            }
          });

          const titleElement = document.querySelector('title');
          if (titleElement) {
            titleObserver.observe(titleElement, {
              subtree: true,
              characterData: true,
              childList: true
            });
          }

          setTimeout(() => {
            titleObserver.disconnect();
            resolve(document.title || '');
          }, 5000);
        });
      }

      await browser.runtime.sendMessage({
        action: "updatePageInfo",
        text: selection,
        title: pageTitle,
        url: window.location.href
      });
    } catch (error) {
      console.error('Error sending updatePageInfo message:', error);
    }
  };

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
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
      console.error('Error in updateSelectionAndPageInfo:', error);
    }
  }, 300);

  document.addEventListener('selectionchange', updateSelectionAndPageInfo);

  // Init with tricky part https://developer.apple.com/forums/thread/651215
  if (document.readyState !== 'loading') {
    updatePageInfo();
  } else {
    document.addEventListener('DOMContentLoaded', updatePageInfo);
  }

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

  // Switching tabs from background.js
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getPageInfo') {
      updatePageInfo(getCleanSelection());
    }
  });

  // Error handling to fail to read storage on Popover
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'refreshPageInfo') {
      updatePageInfo(getCleanSelection());
    }
  });
})();
