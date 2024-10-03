import { labelStrings, getCurrentLangCode } from './localization.js';
const langCode = getCurrentLangCode();

const appState = {
  isEditMode: false,
  dragged: null,
};

const getState = (key) => {
  return appState[key];
}

const setState = (key, value) => {
  appState[key] = value;
}

/* Environmental detection */
const isMacOS = () => {
  const isPlatformMac = navigator.platform.toLowerCase().indexOf('mac') !== -1;

  const isUserAgentMac = /Mac/.test(navigator.userAgent) &&
                         !/iPhone/.test(navigator.userAgent) &&
                         !/iPad/.test(navigator.userAgent);
  
  return (isPlatformMac || isUserAgentMac) && !('ontouchend' in document);
};

const getiOSVersion = () => {
  return parseInt((navigator.userAgent.match(/OS (\d+)_/) || [])[1] || 0);
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
  } catch (e) {
    console.error('Storage is unavailable or insecure:', e);
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
  } catch (e) {
    console.error('Failed to save data to browser storage:', e);
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
    console.error('Invalid data structure:', data);
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
    console.error('Invalid data structure:', data);
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
    console.error('Invalid data structure:', data);
    return false;
  }
  
  navPost.innerHTML = '';
  data.forEach(item => {
    const li = document.createElement('li');
    li.id = item.id;
    li.innerHTML = `<div class="toggleVisibility"><span>${item.visible ? '-' : '+'}</span></div><div class="postLabel">${labelStrings[langCode][item.id]}</div>`;
    
    navPost.appendChild(li);
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
    //saveInitialData();
    setupEditModeListeners();
    navPost.querySelectorAll('li').forEach((li) => {
      li.classList.remove('visibilityOff');
    });
    editActions.style.display = 'none';
    editDone.style.display = 'block';
  } else {
    navPost.querySelectorAll('li').forEach((li) => {
      li.draggable = false;
      li.removeEventListener('dragstart', onDragStart);
      li.classList.remove('isEditMode');
    });
    navPost.removeEventListener('dragover', onDragOver);
    navPost.removeEventListener('drop', onDrop);
    navPost.removeEventListener('click', toggleVisibility);
    
    setupNormalModeListeners();
    
    editActions.style.display = 'block';
    editDone.style.display = 'none';
  }
};

const toggleVisibility = async (event) => {
  const li = event.target.closest('li');
  if (!li) return;
  event.stopPropagation();

  try {
    const data = await getStoredData();
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data structure:', data);
      return false;
    }

    const item = data.find(item => item.id === li.id);
    if (!item) {
      console.error('Item not found:', li.id);
      return;
    }

    item.visible = !item.visible;
    const toggleSpan = li.querySelector('.toggleVisibility > span');
    toggleSpan.textContent = item.visible ? '-' : '+';
    li.querySelector('.toggleVisibility').classList.toggle('toggleOn', !item.visible);
    
    await saveData(data);
  } catch (error) {
    console.error('Error in toggleVisibility:', error);
  }
};

/* Events for UI */
const socialPlatforms = {
  post2x: {
    labelKey: 'post2x',
    urlTemplate: 'https://x.com/intent/tweet?text=${quoteLinkText}&url=${currentUrl}'
  },
  post2threds: {
    labelKey: 'post2threds',
    urlTemplate: 'https://www.threads.net/intent/post?url=${currentUrl}&text=${quoteLinkText}'
  },
  post2bluesky: {
    labelKey: 'post2bluesky',
    urlTemplate: 'https://bsky.app/intent/compose?text=${quoteLinkText}%20${currentUrl}'
  },
  post2mastodon: {
    labelKey: 'post2mastodon',
    urlTemplate: 'https://mstdn.social/share?text=${quoteLinkText}%20${currentUrl}'
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
    urlTemplate: 'https://line.me/R/share?text=${quoteLinkText}%20${currentUrl}'
  },
  post2tumblr: {
    labelKey: 'post2tumblr',
    urlTemplate: 'https://www.tumblr.com/widgets/share/tool?shareSource=legacy&url=${currentUrl}&selection=${quoteLinkText}'
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
            const quoteLinkText = tabInfo.selectedText ? (targetId === 'post2tumblr' ? `${tabInfo.selectedText}` : `"${tabInfo.selectedText}"`) : `${tabInfo.pageTitle}`;
            const urlTemplate = getUrlTemplate(platform);
            const url = urlTemplate.replace('${quoteLinkText}', encodeURIComponent(quoteLinkText)).replace('${currentUrl}', encodeURIComponent(tabInfo.currentUrl));

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
        console.error('Invalid data structure:', data);
        return false;
      }
      const dragged = getState('dragged');
      const fromId = data.findIndex(item => item.id === dragged.id);
      const toId = data.findIndex(item => item.id === event.target.id);
      if (fromId === -1 || toId === -1) {
        console.error('Invalid item ID(s):', dragged.id, event.target.id);
        return;
      }
      const [removed] = data.splice(fromId, 1);
      data.splice(toId, 0, removed);
      await saveData(data);
      await updateList();
    } catch (error) {
      console.error('Error in onDrop:', error);
    }
  }
};

const onMouseOver = (event) => {
  event.target.closest('li').classList.add('hover');
}

const onMouseOut = (event) => {
  event.target.closest('li').classList.remove('hover');
}

/* Rendering */
document.addEventListener('DOMContentLoaded', async () => {
  if (navigator.userAgent.indexOf('iPhone') > -1) {
    document.body.style.width = 'initial';
  }
    
  if (langCode.substring(0, 2) === 'ar' || langCode.substring(0, 2) === 'he') {
    document.body.classList.add('rtl');
    document.documentElement.setAttribute('lang', langCode.substring(0, 2));
    document.documentElement.setAttribute('dir', 'rtl');
  }
  
  const navPost = document.getElementById('navPost');
  const editActions = document.getElementById('editActions');
  const editDone = document.getElementById('editDone');
  
  await saveInitialData();
  await syncDataWithHTML();

  browser.tabs.query({active: true, currentWindow: true}, async (tabs) => {
    if (tabs[0]) {
      const tabId = tabs[0].id;
      const result = await browser.storage.local.get(tabId.toString());
      const tabInfo = result[tabId];
      if (tabInfo) {
        const quoteLinkText = tabInfo.selectedText ? `"${tabInfo.selectedText}"` : `${tabInfo.pageTitle}`;
        document.getElementById('selectedText').innerHTML = `${quoteLinkText.replace(/\n/g, '<br>')}<br>${tabInfo.currentUrl}`;
        
        const copyElement = document.getElementById('copy2clipboard');
        copyElement.querySelector('div').textContent = labelStrings[langCode].copy2clipboard;
        
        copyElement.addEventListener('click', (event) => {
          navigator.clipboard.writeText(`${quoteLinkText}\n${tabInfo.currentUrl}`);
          window.close();
          if (getiOSVersion() < 18) {
            setTimeout(() => {
              browser.runtime.reload();
            }, 100);
          }
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

        navPost.querySelectorAll('li').forEach((li) => {
          const targetId = li.id;
          const platform = socialPlatforms[targetId];
          
          if (platform) {
            document.querySelector(`#${targetId} > div.postLabel`).textContent = labelStrings[langCode][platform.labelKey];
            li.addEventListener('click', handleSocialPlatformClick);
          }
        });
        await updateList();
        
        editActions.textContent = labelStrings[langCode].editActions;
        editActions.addEventListener('click', toggleEditMode);
        editActions.addEventListener('touchstart', (event) => {
          event.target.classList.add('selected');
        });
        editActions.addEventListener('touchend', (event) => {
          event.target.classList.remove('selected');
        });
        
        editDone.textContent = labelStrings[langCode].editDone;
        editDone.addEventListener('click', toggleEditMode);
        editDone.addEventListener('touchstart', (event) => {
          event.target.classList.add('selected');
        });
        editDone.addEventListener('touchend', (event) => {
          event.target.classList.remove('selected');
        });
      } else {
        document.querySelectorAll('.nav').forEach((ul) => {
          ul.style.display = 'none';
        });
        editActions.style.display = 'none';
        editDone.style.display = 'none';
        
        document.getElementById('selectedText').textContent = labelStrings[langCode].onError;
        
        const refreshPageInfo = document.getElementById('refreshPageInfo');

        refreshPageInfo.querySelector('li > div').textContent = labelStrings[langCode].refreshPageInfo;
        refreshPageInfo.style.display = 'block';
        refreshPageInfo.addEventListener('click', () => {
          browser.runtime.sendMessage({ action: 'refreshPageInfo' });
          window.close();
          if (getiOSVersion() < 18) {
            setTimeout(() => {
              browser.runtime.reload();
            }, 100);
          }
        });

        refreshPageInfo.querySelector('li').addEventListener('touchstart', (event) => {
          event.stopPropagation();
          event.target.closest('li').classList.add('selected');
        });
        
        refreshPageInfo.querySelector('li').addEventListener('touchend', (event) => {
          event.stopPropagation();
          event.target.closest('li').classList.remove('selected');
        });
        
        refreshPageInfo.querySelector('li').addEventListener('touchcancel', (event) => {
          event.stopPropagation();
          event.target.closest('li').classList.remove('selected');
        });
      }
    }
  });
});

