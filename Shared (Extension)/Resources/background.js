browser.tabs.onActivated.addListener((activeInfo) => {
  try {
    browser.tabs.sendMessage(activeInfo.tabId, { action: 'getPageInfo' });
  } catch (error) {
    console.error('[QuoteLinkExtension] Failed to send getPageInfo message:', error);
  }
});

const isHttpOrHttpsUrl = (url) => typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'));

browser.tabs.onCreated.addListener(async (tab) => {
  if (!tab.id) return;

  try {
    await browser.storage.local.remove(String(tab.id));
  } catch (error) {
    console.error('[QuoteLinkExtension] Failed to remove tab info from storage on tab creation:', error);
  }
});

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (isHttpOrHttpsUrl(changeInfo.url) === false && typeof changeInfo.url === 'string') {
    try {
      await browser.storage.local.remove(tabId.toString());
    } catch (error) {
      console.error('[QuoteLinkExtension] Failed to remove tab info from storage after URL update:', error);
    }
  }

  if (changeInfo.status === 'complete') {
    try {
      browser.tabs.sendMessage(tabId, { action: 'getPageInfo' });
    } catch (error) {
      console.error('[QuoteLinkExtension] Failed to send getPageInfo message after update:', error);
    }
  }
});

browser.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  try {
    await browser.storage.local.remove(tabId.toString());
  } catch (error) {
    console.error('[QuoteLinkExtension] Failed to remove tab info from storage:', error);
  }
});


browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updatePageInfo') {
    try {
      browser.storage.local.set({
        [sender.tab.id]: {
          selectedText: message.text,
          pageTitle: message.title,
          currentUrl: message.url
        }
      });
    } catch (error) {
      console.error('[QuoteLinkExtension] Failed to store page info in storage:', error);
    }
  }
});
