// When enabled with tabs already open, just tricky part for Safari
browser.runtime.onInstalled.addListener(async () => {
  const tabs = await browser.tabs.query({});

  for (const tab of tabs) {
    if (tab.url.startsWith('http') || tab.url.startsWith('https')) {
      await browser.tabs.reload(tab.id);
    }
  }
});

// Handle messages received from content.js to store data in local storage
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updatePageInfo") {
    browser.storage.local.set({
      [sender.tab.id]: {
        selectedText: message.text,
        pageTitle: message.title,
        currentUrl: message.url
      }
    });
  }
});

// Send a message to content.js on when switching tab
browser.tabs.onActivated.addListener((activeInfo) => {
  browser.tabs.sendMessage(activeInfo.tabId, { action: 'getPageInfo' })
    .catch(error => console.error('Error getting page info:', error));
});

// Send a message to content.js when the tab's status is complete
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    browser.tabs.sendMessage(tabId, { action: 'getPageInfo' })
      .catch(error => console.error('Error getting page info after update:', error));
  }
});

// Remove the stored data to a closed tab
browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
  browser.storage.local.remove(tabId.toString())
    .catch(error => console.error('Error removing tab info from storage:', error));
});

// Clear the local storage when failing to read storage on Popover
const initializeStorage = async () => {
  try {
    await browser.storage.local.clear();
    console.log('Storage has been cleared');
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

const sendMessageToActiveTab = async (message) => {
  try {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0 && tabs[0].id) {
      await browser.tabs.sendMessage(tabs[0].id, message);
    } else {
      console.warn('No active tab found');
    }
  } catch (error) {
    console.error('Error sending message to active tab:', error);
  }
};

const refreshPageInfo = async () => {
  await initializeStorage();
  await sendMessageToActiveTab({ action: 'refreshPageInfo' });
};

browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'refreshPageInfo') {
    refreshPageInfo().catch(error => {
      console.error('Error in refreshPageInfo:', error);
    });
  }
});
