import { getCurrentLangLabelString, applyRTLSupport } from './localization.js';
import { applyPlatformClass, settings, closeWindow, platformInfo } from './utils.js';
import { getCleanUrl } from './cleanurl.js';

const appState = {
  isSettingsMode: false,
  isEditMode: false,
  dragged: null,
};

let navPost = null;
let editActions = null;
let editDone = null;

const getState = (key) => {
  return appState[key];
}

const setState = (key, value) => {
  appState[key] = value;
}

const renderQuoteLink = (container, quoteText, url) => {
  container.textContent = '';
  const lines = quoteText.split('\n');

  lines.forEach((line, index) => {
    if (index > 0) {
      container.appendChild(document.createElement('br'));
    }
    container.appendChild(document.createTextNode(line));
  });

  container.appendChild(document.createElement('br'));
  container.appendChild(document.createTextNode(url));
};

/* Settings */
const quoteStyles = [
  { quoteValue: 'double', quoteLabel: '"…"', openQuote: '"', closeQuote: '"', multilinePrefix: false },
  { quoteValue: 'single', quoteLabel: "'…'", openQuote: "'", closeQuote: "'", multilinePrefix: false },
  { quoteValue: 'kagi', quoteLabel: "「…」", openQuote: "「", closeQuote: "」", multilinePrefix: false },
  { quoteValue: 'kagi-nested', quoteLabel: "『…』", openQuote: "『", closeQuote: "』", multilinePrefix: false },
  { quoteValue: 'curly-double', quoteLabel: '“…”', openQuote: '“', closeQuote: '”', multilinePrefix: false },
  { quoteValue: 'curly-single', quoteLabel: '‘…’', openQuote: '‘', closeQuote: '’', multilinePrefix: false },
  { quoteValue: 'german-traditional', quoteLabel: '„…“', openQuote: '„', closeQuote: '“', multilinePrefix: false },
  { quoteValue: 'guillemet', quoteLabel: '« … »', openQuote: '«', closeQuote: '»', multilinePrefix: false },
  { quoteValue: 'guillemet-single', quoteLabel: '‹ … ›', openQuote: '‹', closeQuote: '›', multilinePrefix: false },
  { quoteValue: 'guillemet-reversed', quoteLabel: '» … «', openQuote: '»', closeQuote: '«', multilinePrefix: false },
  { quoteValue: 'angled-bracket-prefix', quoteLabel: '> …', openQuote: '> ', closeQuote: '', multilinePrefix: true },
  { quoteValue: 'triple-double', quoteLabel: '"""…"""', openQuote: '"""', closeQuote: '"""', multilinePrefix: false },
  { quoteValue: 'markdown-block', quoteLabel: '```…```', openQuote: '```', closeQuote: '```', multilinePrefix: false },
//  { quoteValue: 'xml-tag', quoteLabel: '<quote>…', openQuote: '<quote>\n', closeQuote: '\n</quote>', multilinePrefix: false }
];

const createQuoteStyleSelect = (selected = 'double') => {
  const select = document.createElement('select');
  
  quoteStyles.forEach(style => {
    const option = document.createElement('option');
    option.value = style.quoteValue;
    if (option.value === selected) {
      option.selected = true;
    }
    option.textContent = style.quoteLabel;
    select.appendChild(option);
  });

  return select;
};

// Formats the input string with the specified quote style
const createQuote = (text, quoteStyle = 'double') => {
  const selectedStyle = quoteStyles.find(style => style.quoteValue === quoteStyle) || quoteStyles[0];
  const { openQuote, closeQuote, multilinePrefix } = selectedStyle;

  if (multilinePrefix && text.includes('\n')) {
    return text
      .split('\n')
      .map(line => line.trim() ? `${openQuote}${line}` : line)
      .join('\n');
  }

  return `${openQuote}${text}${closeQuote}`;
};

// Creates a quote string optimized for AI prompts.
// For wrapped styles, enforce a line break after opening and before closing quote.
const createQuoteForPrompt = (text, quoteStyle = 'double') => {
  const selectedStyle = quoteStyles.find(style => style.quoteValue === quoteStyle) || quoteStyles[0];
  const { openQuote, closeQuote, multilinePrefix } = selectedStyle;

  if (multilinePrefix) {
    return text
      .split('\n')
      .map(line => line.trim() ? `${openQuote}${line}` : line)
      .join('\n');
  }

  return `${openQuote}\n${text}\n${closeQuote}`;
};

/* Data handling */
const getStoredData = async () => {
  try {
    const result = await browser.storage.local.get('navPostData');
    if (result.navPostData) {
      return JSON.parse(result.navPostData);
    }
    
    // Migrate local-storage data to browser-storage
    const localData = localStorage.getItem('navPostData');
    if (localData) {
      const parsedData = JSON.parse(localData);
      await saveData(parsedData);
      localStorage.removeItem('navPostData');
      return parsedData;
    }

    return null;
  } catch (error) {
    console.error('[QuoteLinkExtension] Storage is unavailable or insecure:', error);
    return null;
  }
};

const saveData = async (data) => {
  const validatedData = data.map(item => {
    const { text, ...rest } = item;
    return rest;
  });
  
  try {
    await browser.storage.local.set({navPostData: JSON.stringify(validatedData)});
  } catch (error) {
    console.error('[QuoteLinkExtension] Failed to save data to browser storage:', error);
    // Use local-storage as a fallback
    localStorage.setItem('navPostData', JSON.stringify(validatedData));
  }
};

const saveInitialData = async () => {
  const storedData = await getStoredData();
  if (!storedData) {
    const initialData = Array.from(navPost.querySelectorAll('li')).map(li => ({
      id: li.id,
      visible: li.querySelector('div > span').textContent === '-',
    }));
    await saveData(initialData);
  }
};

const syncDataWithHTML = async () => {
  let data = await getStoredData();

  if (!data) {
    console.error('[QuoteLinkExtension] Invalid data structure:', data);
    return false;
  }

  const htmlItems = navPost.querySelectorAll('li');

  // Add new items from HTML
  htmlItems.forEach(htmlItem => {
    if (!data.some(item => item.id === htmlItem.id)) {
      data.push({
        id: htmlItem.id,
        text: htmlItem.querySelector('.postLabel').textContent,
        visible: htmlItem.querySelector('.toggleVisibility span').textContent === '-'
      });
    }
  });

  // Remove items that no longer exist in HTML
  const htmlIds = Array.from(htmlItems).map(htmlItem => htmlItem.id);
  data = data.filter(item => htmlIds.includes(item.id));

  await saveData(data);
};

/* Social post logic */
const updateVisibility = async () => {
  const data = await getStoredData();
  
  if (!data) {
    console.error('[QuoteLinkExtension] Invalid data structure:', data);
    return false;
  }

  data.forEach(item => {
    const li = document.getElementById(item.id);
    if (li) {
      li.classList.toggle('visibilityOff', !item.visible);
    }
  });
};

const updateList = async () => {
  const data = await getStoredData();
  
  if (!data) {
    console.error('[QuoteLinkExtension] Invalid data structure:', data);
    return false;
  }
  
  navPost.innerHTML = '';
  data.forEach(item => {
    const platform = intentTargets[item.id];
    const urlTemplate = getUrlTemplate(platform);
    if (!urlTemplate) return;
    
    const li = document.createElement('li');
    li.title = `${getCurrentLangLabelString(item.id)}`;
    li.id = item.id;
    li.innerHTML = `<div class="toggleVisibility"><span>${item.visible ? '-' : '+'}</span></div><div class="postLabel">${getCurrentLangLabelString(item.id)}</div>`;

    navPost.appendChild(li);
    
    li.querySelector('.toggleVisibility').title = `${getCurrentLangLabelString('tooltip')['toggleBullet']}`;

    if (!item.visible) {
      li.querySelector('.toggleVisibility').classList.add('toggleOn');
    }
    if (platformInfo.isMacOS) {
      li.addEventListener('mouseover', onMouseOver);
      li.addEventListener('mouseout', onMouseOut);
    }
  });

  if (!getState('isEditMode')) {
    setupNormalModeListeners();
  } else {
    setupEditModeListeners();
  }
};

const setupNormalModeListeners = () => {
  navPost.querySelectorAll('li').forEach((li) => {
    li.removeEventListener('click', handlePlatformClick);
    li.addEventListener('click', handlePlatformClick);

    li.removeEventListener('touchstart', onNavPostTouchStart);
    li.addEventListener('touchstart', onNavPostTouchStart);
    
    li.removeEventListener('touchend', onNavPostTouchEndOrCancel);
    li.addEventListener('touchend', onNavPostTouchEndOrCancel);
    
    li.removeEventListener('touchcancel', onNavPostTouchEndOrCancel);
    li.addEventListener('touchcancel', onNavPostTouchEndOrCancel);
  });

  updateVisibility();
};

const setupEditModeListeners = () => {
  navPost.querySelectorAll('li').forEach((li) => {
    li.draggable = true;
    li.addEventListener('dragstart', onDragStart);
    li.classList.add('isEditMode')

    li.removeEventListener('click', handlePlatformClick);
    li.removeEventListener('touchstart', onNavPostTouchStart);
    li.removeEventListener('touchend', onNavPostTouchEndOrCancel);
    li.removeEventListener('touchcancel', onNavPostTouchEndOrCancel);
  });
  navPost.addEventListener('dragover', onDragOver);
  navPost.addEventListener('drop', onDrop);
  navPost.addEventListener('click', toggleVisibility);
};

const toggleEditMode = () => {
  setState('isEditMode', !getState('isEditMode'));

  if (getState('isEditMode')) {
    if (document.documentElement.hasAttribute('style')) {
      document.documentElement.removeAttribute('style');
    }

    setupEditModeListeners();
    navPost.querySelectorAll('li').forEach((li) => {
      li.classList.remove('visibilityOff');
      li.title = `${getCurrentLangLabelString('tooltip')['dragItem']}`;
    });
    editActions.style.display = 'none';
    editDone.style.display = 'inline-block';
  } else {
    navPost.querySelectorAll('li').forEach((li) => {
      li.draggable = false;
      li.removeEventListener('dragstart', onDragStart);
      li.classList.remove('isEditMode');

      const postLabel = li.querySelector('.postLabel');
      if (postLabel && postLabel.firstChild) {
        li.title = postLabel.firstChild.textContent.trim();
      }
    });

    navPost.removeEventListener('dragover', onDragOver);
    navPost.removeEventListener('drop', onDrop);
    navPost.removeEventListener('click', toggleVisibility);
    
    setupNormalModeListeners();

    editActions.style.display = 'inline-block';
    editDone.style.display = 'none';

    if (platformInfo.isMacOS) {
      setTimeout(() => {
        const htmlNode = document.documentElement;
        const htmlRect = htmlNode.getBoundingClientRect();
        if (htmlRect.height < 600) {
          htmlNode.style.position = 'absolute';
          htmlNode.style.top = `${Math.abs(htmlRect.y)}px`;
        }
        htmlNode.style.minHeight = '600px';
      },10);
    }
  }
};

const toggleVisibility = async (event) => {
  const li = event.target.closest('li');
  if (!li) return;
  event.stopPropagation();

  try {
    const data = await getStoredData();
    if (!data || !Array.isArray(data)) {
      console.error('[QuoteLinkExtension] Invalid data structure:', data);
      return false;
    }

    const item = data.find(item => item.id === li.id);
    if (!item) {
      console.error('[QuoteLinkExtension] Item not found:', li.id);
      return;
    }

    item.visible = !item.visible;
    const toggleSpan = li.querySelector('.toggleVisibility > span');
    toggleSpan.textContent = item.visible ? '-' : '+';
    li.querySelector('.toggleVisibility').classList.toggle('toggleOn', !item.visible);
    
    await saveData(data);
  } catch (error) {
    console.error('[QuoteLinkExtension] Error in toggleVisibility:', error);
  }
};

/* Events for UI */
const intentTargets = {
  post2x: {
    labelKey: 'post2x',
    type: 'sns',
    urlTemplateByPlatform: {
      default: 'https://x.com/intent/tweet?text=${quoteLinkText}&url=${currentUrl}'
    }
  },
  post2threads: {
    labelKey: 'post2threads',
    type: 'sns',
    urlTemplateByPlatform: {
      default: 'https://www.threads.net/intent/post?url=${currentUrl}&text=${quoteLinkText}'
    }
  },
  post2bluesky: {
    labelKey: 'post2bluesky',
    type: 'sns',
    urlTemplateByPlatform: {
      default: 'https://bsky.app/intent/compose?text=${quoteLinkText}%20${currentUrl}'
    }
  },
  post2mastodon: {
    labelKey: 'post2mastodon',
    type: 'sns',
    urlTemplateByPlatform: {
      default: 'https://mastodon.social/share?text=${quoteLinkText}%20${currentUrl}'
    }
  },
  post2linkedin: {
    labelKey: 'post2linkedin',
    type: 'sns',
    urlTemplateByPlatform: {
      macos: 'https://www.linkedin.com/feed/?shareActive=true&text=${quoteLinkText}%20${currentUrl}',
      ios: 'https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}%20${quoteLinkText}'
    }
  },
  post2telegram: {
    labelKey: 'post2telegram',
    type: 'sns',
    urlTemplateByPlatform: {
      default: 'https://t.me/share/url?url=${currentUrl}&text=${quoteLinkText}'
    }
  },
  post2line: {
    labelKey: 'post2line',
    type: 'sns',
    urlTemplateByPlatform: {
      macos: null,
      ios: 'https://line.me/R/share?text=${quoteLinkText}%20${currentUrl}'
    }
  },
  post2tumblr: {
    labelKey: 'post2tumblr',
    type: 'sns',
    urlTemplateByPlatform: {
      default: 'https://www.tumblr.com/widgets/share/tool?url=${currentUrl}&selection=${quoteLinkText}'
    }
  },
  post2vk: {
    labelKey: 'post2vk',
    type: 'sns',
    urlTemplateByPlatform: {
      default: 'https://vk.com/share.php?url=${currentUrl}&comment=${quoteLinkText}'
    }
  },
  post2weibo: {
    labelKey: 'post2weibo',
    type: 'sns',
    urlTemplateByPlatform: {
      default: 'https://service.weibo.com/share/share.php?url=${currentUrl}&title=${quoteLinkText}'
    }
  },
  post2chatgpt: {
    labelKey: 'post2chatgpt',
    type: 'genai',
    urlTemplateByPlatform: {
      default: 'https://chatgpt.com/?prompt=${prompt}'
    }
  },
  post2claude: {
    labelKey: 'post2claude',
    type: 'genai',
    urlTemplateByPlatform: {
      default: 'https://claude.ai/new?q=${prompt}'
    }
  }
};

const getUrlTemplate = (platform) => {
  const templates = platform?.urlTemplateByPlatform;
  if (!templates) return null;

  if (platformInfo.isMacOS && Object.prototype.hasOwnProperty.call(templates, 'macos')) {
    return templates.macos || null;
  }

  if (!platformInfo.isMacOS && Object.prototype.hasOwnProperty.call(templates, 'ios')) {
    return templates.ios || null;
  }

  return templates.default || null;
};

const buildGenAIPrompt = ({ selectedText, quoteStyle = 'double', currentUrl }) => {
  if (!selectedText) return `SOURCE: ${currentUrl}\n`;

  const quotedText = createQuoteForPrompt(selectedText, quoteStyle);
  return `QUOTE: ${quotedText}\nSOURCE: ${currentUrl}\n`;
};

const getActiveTabId = async () => {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  return tabs[0]?.id || null;
};

const getTabInfoFromStorage = async (tabId) => {
  if (!tabId) return null;
  const result = await browser.storage.local.get(tabId.toString());
  return result[tabId] || null;
};

const getTabInfoForActiveTab = async () => {
  const tabId = await getActiveTabId();
  if (!tabId) return null;

  try {
    const tabInfo = await browser.tabs.sendMessage(tabId, { action: 'requestPageInfo' });
    if (tabInfo?.currentUrl) {
      return tabInfo;
    }
  } catch (error) {
    console.warn('[QuoteLinkExtension] Failed to get tab info via messaging, fallback to storage:', error);
  }

  return getTabInfoFromStorage(tabId);
};

const handlePlatformClick = async (event) => {
  const targetId = event.currentTarget.id;
  const platform = intentTargets[targetId];
  
  if (platform) {
    const tabInfo = await getTabInfoForActiveTab();
    if (!tabInfo) return;

    const urlTemplate = getUrlTemplate(platform);
    if (!urlTemplate) return;

    const isCleanUrl = settings.get('isCleanUrl');
    const cleanUrl = getCleanUrl(tabInfo.currentUrl, isCleanUrl);

    let url;
    if (platform.type === 'genai') {
      const prompt = buildGenAIPrompt({
        selectedText: tabInfo.selectedText,
        quoteStyle: settings.get('quoteStyle'),
        currentUrl: cleanUrl
      });

      let encodedPrompt;
      if (platformInfo.isMacOS) {
        encodedPrompt = encodeURIComponent(prompt).replace(/%0A/g, '%0A');
      } else {
        encodedPrompt = encodeURIComponent(prompt);
      }
      
      url = urlTemplate.replace(
        '${prompt}',
        encodedPrompt
      );
    } else {
      let quoteLinkText;

      if (tabInfo.selectedText) {
        const quoteStyle = settings.get('quoteStyle');
        const quotedText = createQuote(tabInfo.selectedText, quoteStyle);
        quoteLinkText = encodeURIComponent(quotedText);
      } else {
        quoteLinkText = encodeURIComponent(tabInfo.pageTitle);
      }

      url = urlTemplate
        .replace('${quoteLinkText}', quoteLinkText)
        .replace('${currentUrl}', encodeURIComponent(cleanUrl));
    }

    browser.tabs.create({ url });
  }
};

const onNavPostTouchStart = (event) => {
  event.target.classList.add('selected');
};

const onNavPostTouchEndOrCancel = (event) => {
  event.target.classList.remove('selected');
};

const onDragStart = (event) => {
  setState('dragged', event.target);
  event.dataTransfer.setData('text/plain', event.target.id);
};

const onDragOver = (event) => {
  event.preventDefault();
};

const onDrop = async (event) => {
  event.preventDefault();
  const dropTarget = event.target.closest('li');
  if (dropTarget) {
    try {
      const data = await getStoredData();
      if (!data || !Array.isArray(data)) {
        console.error('[QuoteLinkExtension] Invalid data structure:', data);
        return false;
      }
      const dragged = getState('dragged');
      const fromId = data.findIndex(item => item.id === dragged.id);
      const toId = data.findIndex(item => item.id === dropTarget.id);
      if (fromId === -1 || toId === -1) {
        console.error('[QuoteLinkExtension] Invalid item ID(s):', dragged.id, dropTarget.id);
        return;
      }
      const [removed] = data.splice(fromId, 1);
      data.splice(toId, 0, removed);
      await saveData(data);
      await updateList();
    } catch (error) {
      console.error('[QuoteLinkExtension] Error in onDrop:', error);
    }
  }
};

const onMouseOver = (event) => {
  event.target.closest('li').classList.add('hover');
}

const onMouseOut = (event) => {
  event.target.closest('li').classList.remove('hover');
}

const normalizeUrl = (url) => {
  try {
    let u = new URL(url);
    u.hash = u.hash.includes('~:text=') ? '' : u.hash;
    return u.toString();
  } catch (error) {
    console.error('[QuoteLinkExtension] Invalid URL:', url);
    return url;
  }
};

const constructFragmentUrl = (sharedUrl, quoteText) => {
  const url = normalizeUrl(sharedUrl);
  const params = `${encodeURIComponent(quoteText)}`;

  return `${url}#:~:text=${params}`;
};

const getQuoteLinkText = (tabInfo, quoteStyle = 'double') => {
  const quoteText = tabInfo.selectedText || tabInfo.pageTitle;

  if (tabInfo.selectedText) {
    return createQuote(quoteText, quoteStyle);
  }
  return quoteText;
};

// Creates the quote link with formatted text and URL
const createQuoteLink = (tabInfo, quoteStyle = 'double', isCleanUrl = false) => {
  const quoteLinkText = getQuoteLinkText(tabInfo, quoteStyle);
  const url = getCleanUrl(tabInfo.currentUrl, isCleanUrl)
  const selectedTextEl = document.getElementById('selectedText');
  renderQuoteLink(selectedTextEl, quoteLinkText, url);
};

const buildPopup = async (settings) => {
  applyPlatformClass();
  applyRTLSupport();
  
  const quoteLinkView = document.getElementById('quoteLinkView');
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsDoneBtn = document.getElementById('settingsDoneBtn');
  navPost = document.getElementById('navPost');
  editActions = document.getElementById('editActions');
  editDone = document.getElementById('editDone');
  
  const showError = () => {
    settingsBtn.style.display = 'none';

    document.querySelectorAll('.nav').forEach((ul) => {
      ul.style.display = 'none';
    });
    editActions.style.display = 'none';
    editDone.style.display = 'none';
    
    document.getElementById('selectedText').textContent = `${getCurrentLangLabelString('onError')}`;
  };

  await saveInitialData();
  await syncDataWithHTML();

  const tabInfo = await getTabInfoForActiveTab();
  if (!tabInfo) {
    showError();
    return;
  }

  const hasUrlParams = (urlString) => {
    try {
      const url = new URL(urlString);
      return url.search.length > 0;
    } catch (error) {
      console.warn('QuoteLinkExtension Invalid URL:', error);
      return false;
    }
  };

  const quoteStyle = settings.get('quoteStyle');
  const isCleanUrl = settings.get('isCleanUrl');
  
  createQuoteLink(tabInfo, quoteStyle, isCleanUrl);

  const settingsLi = document.createElement('li');
  settingsLi.id = 'settingsList';
  settingsLi.style.display = 'none';

  const quoteStyleDiv = document.createElement('div');
  
  const quoteStyleLabel = document.createElement('label');
  quoteStyleLabel.htmlFor = 'settings-quotes';
  quoteStyleLabel.textContent = `${getCurrentLangLabelString('quoteStyleSetting')}`;
  quoteStyleDiv.appendChild(quoteStyleLabel);

  const quoteSelect = createQuoteStyleSelect(quoteStyle);
  quoteSelect.id = 'settings-quotes';

  quoteStyleDiv.appendChild(quoteSelect);
  settingsLi.appendChild(quoteStyleDiv);

  quoteSelect.addEventListener('change', async (event) => {
    const updatedQuoteStyles = event.target.value;
    await settings.set('quoteStyle', updatedQuoteStyles);

    const isCleanUrl = settings.get('isCleanUrl');
    createQuoteLink(tabInfo, updatedQuoteStyles, isCleanUrl);
  });

  const cleanUrlDiv = document.createElement('div');

  const cleanUrlLabel = document.createElement('label');
  cleanUrlLabel.htmlFor = 'settings-cleanUrl';
  cleanUrlLabel.textContent = 'Clean URL';
  cleanUrlDiv.appendChild(cleanUrlLabel);

  const cleanUrlCheckbox = document.createElement('input');
  cleanUrlCheckbox.type = 'checkbox';
  cleanUrlCheckbox.id = 'settings-cleanUrl';
  cleanUrlCheckbox.classList.add('toggle-disabled');
  if (isCleanUrl) {
    cleanUrlCheckbox.checked = true;
  }
  cleanUrlDiv.appendChild(cleanUrlCheckbox);

  const toggleSpan = document.createElement('span');
  toggleSpan.classList.add('toggle');
  
  toggleSpan.addEventListener('click', async (event) => {
    if (hasUrlParams(tabInfo.currentUrl) === false) return;
    cleanUrlCheckbox.click();
  });

  cleanUrlCheckbox.addEventListener('change', async (event) => {
    if (hasUrlParams(tabInfo.currentUrl) === false) return;
    
    cleanUrlCheckbox.classList.remove('toggle-disabled');
    await settings.set('isCleanUrl', cleanUrlCheckbox.checked);

    const quoteStyle = settings.get('quoteStyle');
    createQuoteLink(tabInfo, quoteStyle, cleanUrlCheckbox.checked);
  });

  cleanUrlDiv.appendChild(toggleSpan);
  settingsLi.appendChild(cleanUrlDiv);
  quoteLinkView.appendChild(settingsLi);

  const toggleSettingsMode = () => {
    setState('isSettingsMode', !getState('isSettingsMode'));
    document.documentElement.style.height = '';

    if (getState('isSettingsMode')) {
      settingsLi.style.display = 'flex';
      settingsBtn.style.display = 'none';
      settingsDoneBtn.style.display = 'inline-block';

      if (!tabInfo.selectedText) {
        quoteStyleDiv.classList.add('quotes-disabled');
        quoteSelect.disabled = true;
      }

      if (hasUrlParams(tabInfo.currentUrl) === false) {
        cleanUrlDiv.classList.add('cleanurl-disabled');
      }
    } else {
      settingsLi.style.display = 'none';
      settingsBtn.style.display = 'inline-block';
      settingsDoneBtn.style.display = 'none';
      cleanUrlCheckbox.classList.add('toggle-disabled');
    }
  };

  settingsBtn.title = `${getCurrentLangLabelString('settings')}`;
  settingsBtn.textContent = `${getCurrentLangLabelString('settings')}`;
  settingsBtn.addEventListener('click', toggleSettingsMode);
  settingsBtn.addEventListener('touchstart', (event)   => settingsBtn.classList.add('selected'));
  settingsBtn.addEventListener('touchend', (event)     => settingsBtn.classList.remove('selected'));
  settingsBtn.addEventListener('touchcancel', (event)  => settingsBtn.classList.remove('selected'));

  settingsDoneBtn.title = `${getCurrentLangLabelString('editDone')}`;
  settingsDoneBtn.textContent = `${getCurrentLangLabelString('editDone')}`;
  settingsDoneBtn.addEventListener('click', toggleSettingsMode);
  settingsDoneBtn.addEventListener('touchstart', (event)   => settingsDoneBtn.classList.add('selected'));
  settingsDoneBtn.addEventListener('touchend', (event)     => settingsDoneBtn.classList.remove('selected'));
  settingsDoneBtn.addEventListener('touchcancel', (event)  => settingsDoneBtn.classList.remove('selected'));

  const copy2clipboardEl = document.getElementById('copy2clipboard');
  copy2clipboardEl.title = `${getCurrentLangLabelString('copy2clipboard')}`;
  copy2clipboardEl.querySelector('div').textContent = `${getCurrentLangLabelString('copy2clipboard')}`;

  copy2clipboardEl.addEventListener('click', async (event) => {
    const quoteStyle = settings.get('quoteStyle');
    const url = getCleanUrl(tabInfo.currentUrl, cleanUrlCheckbox.checked);

    try {
      await navigator.clipboard.writeText(`${getQuoteLinkText(tabInfo, quoteStyle)}\n${url}`);
      closeWindow();
    } catch (error) {
      console.error('[QuoteLinkExtension] Failed to copy quote and URL:', error);
    }
  });
  copy2clipboardEl.addEventListener('touchstart', (event)   => copy2clipboardEl.classList.add('selected'));
  copy2clipboardEl.addEventListener('touchend', (event)     => copy2clipboardEl.classList.remove('selected'));
  copy2clipboardEl.addEventListener('touchcancel', (event)  => copy2clipboardEl.classList.remove('selected'));

  if (platformInfo.isMacOS) {
    copy2clipboardEl.addEventListener('mouseover', onMouseOver);
    copy2clipboardEl.addEventListener('mouseout', onMouseOut);
  }

  const copy4promptEl = document.getElementById('copy4prompt');
  copy4promptEl.title = `${getCurrentLangLabelString('copy4prompt')}`;
  copy4promptEl.querySelector('div').textContent = `${getCurrentLangLabelString('copy4prompt')}`;

  copy4promptEl.addEventListener('click', async (event) => {
    const quoteStyle = settings.get('quoteStyle');
    const url = getCleanUrl(tabInfo.currentUrl, cleanUrlCheckbox.checked);
    const encodedPrompt = buildGenAIPrompt({ selectedText: tabInfo.selectedText, quoteStyle, currentUrl: url });

    try {
      await navigator.clipboard.writeText(encodedPrompt);
      closeWindow();
    } catch (error) {
      console.error('[QuoteLinkExtension] Failed to copy AI prompt:', error);
    }
  });
  copy4promptEl.addEventListener('touchstart', (event)   => copy4promptEl.classList.add('selected'));
  copy4promptEl.addEventListener('touchend', (event)     => copy4promptEl.classList.remove('selected'));
  copy4promptEl.addEventListener('touchcancel', (event)  => copy4promptEl.classList.remove('selected'));

  if (platformInfo.isMacOS) {
    copy4promptEl.addEventListener('mouseover', onMouseOver);
    copy4promptEl.addEventListener('mouseout', onMouseOut);
  }

  if (navigator.share) {
    const shareDiv = document.createElement('div');
    shareDiv.textContent = `${getCurrentLangLabelString('sharelink')}`;

    const shareLi = document.createElement('li');
    shareLi.title = `${getCurrentLangLabelString('sharelink')}`;

    shareLi.addEventListener('click', (event) => {
      const shareTitle = tabInfo.pageTitle ? tabInfo.pageTitle : '';

      const quoteStyle = settings.get('quoteStyle');
      const quotedText = createQuote(tabInfo.selectedText, quoteStyle);
      const shareText = tabInfo.selectedText ? `${quotedText}` : '';

      const shareUrl = getCleanUrl(tabInfo.currentUrl, cleanUrlCheckbox.checked);
      const urlWithFragment = tabInfo.selectedText ? constructFragmentUrl(shareUrl, `${tabInfo.selectedText}`) : shareUrl;

      navigator.share({
        title: shareTitle,
        url: urlWithFragment
      });
    });
    
    shareLi.appendChild(shareDiv);
    document.getElementById('navSystem').appendChild(shareLi);

    shareLi.addEventListener('touchstart', (event) => {
      event.stopPropagation();
      event.target.closest('li').classList.add('selected');
    });
    
    shareLi.addEventListener('touchend', (event) => {
      event.stopPropagation();
      event.target.closest('li').classList.remove('selected');
    });

    shareLi.addEventListener('touchcancel', (event) => {
      event.stopPropagation();
      event.target.closest('li').classList.remove('selected');
    });

    if (platformInfo.isMacOS) {
      shareLi.addEventListener('mouseover', onMouseOver);
      shareLi.addEventListener('mouseout', onMouseOut);
    }
  }

  navPost.querySelectorAll('li').forEach((li) => {
    const targetId = li.id;
    const platform = intentTargets[targetId];
    
    if (platform) {
      document.querySelector(`#${targetId} > div.postLabel`).textContent = `${getCurrentLangLabelString(platform.labelKey)}`;
      li.addEventListener('click', handlePlatformClick);
    }
  });
  await updateList();
  
  editActions.title = `${getCurrentLangLabelString('editActions')}`;
  editActions.textContent = `${getCurrentLangLabelString('editActions')}`;
  editActions.addEventListener('click', toggleEditMode);
  editActions.addEventListener('touchstart', (event) => {
    event.target.classList.add('selected');
  });
  editActions.addEventListener('touchend', (event) => {
    event.target.classList.remove('selected');
  });
  editActions.addEventListener('touchcancel', (event) => {
    event.target.classList.remove('selected');
  });

  editDone.title = `${getCurrentLangLabelString('editDone')}`;
  editDone.textContent = `${getCurrentLangLabelString('editDone')}`;
  editDone.addEventListener('click', toggleEditMode);
  editDone.addEventListener('touchstart', (event) => {
    event.target.classList.add('selected');
  });
  editDone.addEventListener('touchend', (event) => {
    event.target.classList.remove('selected');
  });
  editDone.addEventListener('touchcancel', (event) => {
    event.target.classList.remove('selected');
  });
};

let isInitialized = false;

const initializePopup = async () => {
  if (isInitialized) return;
  isInitialized = true;

  await settings.load();
  try {
    await buildPopup(settings);
  } catch (error) {
    console.error('[QuoteLinkExtension] Fail to initialize to build the popup:', error);
    isInitialized = false;
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePopup, { once: true });
} else {
  initializePopup();
}
