import { getCurrentLangLabelString, applyRTLSupport } from './localization.js';
import { isIOS, isIPadOS, isMacOS, getIOSMajorVersion, applyPlatformClass } from './utils.js';
import { removeParams, getCleanUrl } from './cleanurl.js';

const appState = {
  isSettingsMode: false,
  isEditMode: false,
  dragged: null,
};

const getState = (key) => {
  return appState[key];
}

const setState = (key, value) => {
  appState[key] = value;
}

const closeWindow = () => {
  window.close();

  // In older iOS versions (<18), reloading the extension helped with some popup issues
  // Might no longer be necessary — safe to remove if no issues found
  if (getIOSMajorVersion() > 0 && getIOSMajorVersion() < 18) {
    setTimeout(() => {
      try {
        browser.runtime.reload();
      } catch (error) {
        console.warn('[QuoteLinkExtension] browser.runtime.reload failed:', error);
      }
    }, 100);
  }
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
  { quoteValue: 'angled-bracket-prefix', quoteLabel: '> …', openQuote: '> ', closeQuote: '', multilinePrefix: true }
];

const settings = (() => {
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

  const get = (key) => cache[key];

  const set = async (key, value) => {
    cache[key] = value;
    try {
      await browser.storage.local.set({ settings: cache });
    } catch (error) {
      console.error('[QuoteLinkExtension] Failed to save settings:', error);
    }
  };

  return { load, get, set };
})();

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
  /* Debug: await browser.storage.local.clear(); return; */
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
    const platform = socialPlatforms[item.id];
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
    if (isMacOS()) {
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
    li.removeEventListener('click', handleSocialPlatformClick);
    li.addEventListener('click', handleSocialPlatformClick);

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

    li.removeEventListener('click', handleSocialPlatformClick);
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
    editDone.style.display = 'block';
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

    editActions.style.display = 'block';
    editDone.style.display = 'none';

    if (isMacOS()) {
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
const socialPlatforms = {
  post2x: {
    labelKey: 'post2x',
    urlTemplate: 'https://x.com/intent/tweet?text=${quoteLinkText}&url=${currentUrl}'
  },
  post2threads: {
    labelKey: 'post2threads ',
    urlTemplate: 'https://www.threads.net/intent/post?url=${currentUrl}&text=${quoteLinkText}'
  },
  post2bluesky: {
    labelKey: 'post2bluesky',
    urlTemplate: 'https://bsky.app/intent/compose?text=${quoteLinkText}%20${currentUrl}'
  },
  post2mastodon: {
    labelKey: 'post2mastodon',
    urlTemplate: 'https://mastodon.social/share?text=${quoteLinkText}%20${currentUrl}'
  },
  post2linkedin: {
    labelKey: 'post2linkedin',
    urlTemplates: {
      macos: 'https://www.linkedin.com/feed/?shareActive=true&text=${quoteLinkText}%20${currentUrl}',
      ios: 'https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}%20${quoteLinkText}'
    }
  },
  post2telegram: {
    labelKey: 'post2telegram',
    urlTemplate: 'https://t.me/share/url?url=${currentUrl}&text=${quoteLinkText}'
  },
  post2line: {
    labelKey: 'post2line',
    urlTemplates: {
      macos: '',
      ios: 'https://line.me/R/share?text=${quoteLinkText}%20${currentUrl}'
    }
  },
  post2tumblr: {
    labelKey: 'post2tumblr',
    urlTemplate: 'https://www.tumblr.com/widgets/share/tool?url=${currentUrl}&selection=${quoteLinkText}'
  },
  post2vk: {
    labelKey: 'post2vk',
    urlTemplate: 'https://vk.com/share.php?url=${currentUrl}&comment=${quoteLinkText}'
  },
  post2weibo: {
    labelKey: 'post2weibo',
    urlTemplate: 'https://service.weibo.com/share/share.php?url=${currentUrl}&title=${quoteLinkText}'
  }
};

const getUrlTemplate = (platform) => {
  if (platform.urlTemplates) {
    return isMacOS() ? platform.urlTemplates.macos : platform.urlTemplates.ios;
  } else if (platform.urlTemplate) {
    return platform.urlTemplate;
  }
  
  return null;
};

const handleSocialPlatformClick = (event) => {
  const targetId = event.currentTarget.id;
  const platform = socialPlatforms[targetId];
  
  if (platform) {
    browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        const tabId = tabs[0].id;
        browser.storage.local.get(tabId.toString(), (result) => {
          const tabInfo = result[tabId];
          if (tabInfo) {
            let quoteLinkText;
            if (tabInfo.selectedText) {
              if (targetId === 'post2tumblr') {
                quoteLinkText = tabInfo.selectedText;
              } else if (targetId === 'post2weibo') {
                const raw = `「${tabInfo.selectedText}」`;
                quoteLinkText = encodeURIComponent(raw);
              } else {
                const quoteStyle = settings.get('quoteStyle');
                const quotedText = createQuote(tabInfo.selectedText, quoteStyle);
                
                quoteLinkText = encodeURIComponent(`${quotedText}`);
              }
            } else {
              quoteLinkText = encodeURIComponent(`${tabInfo.pageTitle}`);
            }
            const isCleanUrl = settings.get('isCleanUrl');
            const cleanUrl = getCleanUrl(tabInfo.currentUrl, isCleanUrl)

            const urlTemplate = getUrlTemplate(platform);
            const url = urlTemplate
              .replace('${quoteLinkText}', quoteLinkText)
              .replace('${currentUrl}', encodeURIComponent(cleanUrl));

            browser.tabs.create({ url });
          }
        });
      }
    });
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
  if (event.target.tagName === 'LI') {
    try {
      const data = await getStoredData();
      if (!data || !Array.isArray(data)) {
        console.error('[QuoteLinkExtension] Invalid data structure:', data);
        return false;
      }
      const dragged = getState('dragged');
      const fromId = data.findIndex(item => item.id === dragged.id);
      const toId = data.findIndex(item => item.id === event.target.id);
      if (fromId === -1 || toId === -1) {
        console.error('[QuoteLinkExtension] Invalid item ID(s):', dragged.id, event.target.id);
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

  const formattedText = `${quoteLinkText.replace(/\n/g, '<br>')}<br>${url}`;
  document.getElementById('selectedText').innerHTML = formattedText;
};

const buildPopup = async (settings) => {
  applyPlatformClass();
  applyRTLSupport();
  
  const quoteLinkView = document.getElementById('quoteLinkView');
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsDoneBtn = document.getElementById('settingsDoneBtn');
  const navPost = document.getElementById('navPost');
  const editActions = document.getElementById('editActions');
  const editDone = document.getElementById('editDone');
  
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

  browser.tabs.query({active: true, currentWindow: true}, async (tabs) => {
    if (tabs[0]) {
      const tabId = tabs[0].id;
      const result = await browser.storage.local.get(tabId.toString());
      const tabInfo = result[tabId];
      
      if (!tabInfo) {
        showError();
        return;
      }

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
        cleanUrlCheckbox.click();
      });

      cleanUrlCheckbox.addEventListener('change', async (event) => {
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
          settingsDoneBtn.style.display = 'block';

          if (!tabInfo.selectedText) {
            settingsLi.querySelector(':first-child').classList.add('quotes-disabled');
            quoteSelect.disabled = true;
          }
        } else {
          settingsLi.style.display = 'none';
          settingsBtn.style.display = 'block';
          settingsDoneBtn.style.display = 'none';
          cleanUrlCheckbox.classList.add('toggle-disabled');
        }
      };

      settingsBtn.title = `${getCurrentLangLabelString('settings')}`;
      settingsBtn.textContent = `${getCurrentLangLabelString('settings')}`;
      settingsBtn.addEventListener('click', toggleSettingsMode);
      settingsBtn.addEventListener('touchstart', (event) => {
        event.target.classList.add('selected');
      });
      settingsBtn.addEventListener('touchend', (event) => {
        event.target.classList.remove('selected');
      });

      settingsDoneBtn.title = `${getCurrentLangLabelString('editDone')}`;
      settingsDoneBtn.textContent = `${getCurrentLangLabelString('editDone')}`;
      settingsDoneBtn.addEventListener('click', toggleSettingsMode);
      settingsDoneBtn.addEventListener('touchstart', (event) => {
        event.target.classList.add('selected');
      });
      settingsDoneBtn.addEventListener('touchend', (event) => {
        event.target.classList.remove('selected');
      });

      const copyElement = document.getElementById('copy2clipboard');
      copyElement.title = `${getCurrentLangLabelString('copy2clipboard')}`;
      copyElement.querySelector('div').textContent = `${getCurrentLangLabelString('copy2clipboard')}`;

      copyElement.addEventListener('click', (event) => {
        const quoteStyle = settings.get('quoteStyle');
        const url = getCleanUrl(tabInfo.currentUrl, cleanUrlCheckbox.checked)
        navigator.clipboard.writeText(`${getQuoteLinkText(tabInfo, quoteStyle)}\n${url}`);
        closeWindow();
      });
      
      copyElement.addEventListener('touchstart', (event) => {
        event.stopPropagation();
        event.target.closest('li').classList.add('selected');
      });
      
      copyElement.addEventListener('touchend', (event) => {
        event.stopPropagation();
        event.target.closest('li').classList.remove('selected');
      });

      copyElement.addEventListener('touchcancel', (event) => {
        event.stopPropagation();
        event.target.closest('li').classList.remove('selected');
      });

      if (isMacOS()) {
        copyElement.addEventListener('mouseover', onMouseOver);
        copyElement.addEventListener('mouseout', onMouseOut);
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

        if (isMacOS()) {
          shareLi.addEventListener('mouseover', onMouseOver);
          shareLi.addEventListener('mouseout', onMouseOut);
        }
      }

      navPost.querySelectorAll('li').forEach((li) => {
        const targetId = li.id;
        const platform = socialPlatforms[targetId];
        
        if (platform) {
          document.querySelector(`#${targetId} > div.postLabel`).textContent = `${getCurrentLangLabelString(platform.labelKey)}`;
          li.addEventListener('click', handleSocialPlatformClick);
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
      
      editDone.title = `${getCurrentLangLabelString('editDone')}`;
      editDone.textContent = `${getCurrentLangLabelString('editDone')}`;
      editDone.addEventListener('click', toggleEditMode);
      editDone.addEventListener('touchstart', (event) => {
        event.target.classList.add('selected');
      });
      editDone.addEventListener('touchend', (event) => {
        event.target.classList.remove('selected');
      });
    }
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
