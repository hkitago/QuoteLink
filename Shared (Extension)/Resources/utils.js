// ============================================
// Platform Detection
// ============================================
const userAgent = navigator.userAgent;
const platform = navigator.platform;
const maxTouchPoints = navigator.maxTouchPoints || 0;

const isIPadOS = platform === 'MacIntel' && maxTouchPoints > 1;
const isIOS = /iPhone|iPod/.test(userAgent);
const isMacOS = platform.includes('Mac') && !isIPadOS;
export const platformInfo = {
  isIOS,
  isIPadOS,
  isMacOS
};

export const applyPlatformClass = async () => {
  const body = document.body;

  if (platformInfo.isIOS) {
    body.classList.add('os-ios');
  } else if (platformInfo.isIPadOS) {
    body.classList.add('os-ipados');
  } else if (platformInfo.isMacOS) {
    body.classList.add('os-macos');
  }
};

const getIOSMajorVersion = () => {
  const match = userAgent.match(/OS (\d+)_/);
  return match ? parseInt(match[1], 10) : 0;
};

export const closeWindow = () => {
  window.close();

  // In older iOS versions (<18), reloading the extension helped with some popup issues
  // Might no longer be necessary — safe to remove if no issues found
  if (getIOSMajorVersion() > 0 && getIOSMajorVersion() < 18) {
    setTimeout(() => {
      try {
        browser.runtime.reload();
      } catch (error) {
        console.warn('[CleanURLExtension] Failed to browser.runtime.reload:', error);
      }
    }, 100);
  }
};

// ============================================
// Settings
// ============================================
export const settings = (() => {
  const DEFAULT_SETTINGS = {
    quoteStyle: 'double',
    isCleanUrl: false,
  };

  let cache = { ...DEFAULT_SETTINGS };

  const load = async () => {
    try {
      const { settings: stored } = await browser.storage.local.get('settings');
      cache = { ...DEFAULT_SETTINGS, ...stored };
    } catch (error) {
      console.error('[QuoteLinkExtension] Failed to load settings:', error);
    }
  };

  const get = (key) => {
    if (key === undefined) return { ...cache };
    return cache[key];
  };

  const set = async (key, value) => {
    cache[key] = value;
    try {
      await browser.storage.local.set({ settings: cache });
    } catch (error) {
      console.error('[QuoteLinkExtension] Failed to save settings:', error);
    }
  };

  browser.storage.onChanged.addListener(async (changes, area) => {
    if (area === 'local' && changes.settings) {
      cache = { ...DEFAULT_SETTINGS, ...changes.settings.newValue };
    }
  });

  return { load, get, set };
})();

