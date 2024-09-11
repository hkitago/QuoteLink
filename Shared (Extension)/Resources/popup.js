import { labelStrings, getCurrentLangCode } from './localization.js';
const langCode = getCurrentLangCode();

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
    urlTemplate: 'https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}%20${quoteLinkText}'
  },
  post2telegram: {
    labelKey: 'post2telegram',
    urlTemplate: 'https://t.me/share/url?url=${currentUrl}&text=${quoteLinkText}'
  },
  post2line: {
    labelKey: 'post2line',
    urlTemplate: 'https://line.me/R/share?text=${quoteLinkText}%20${currentUrl}'
  }
};

const getStoredData = () => {
  const storedData = localStorage.getItem('navPostData');
  return storedData ? JSON.parse(storedData) : null;
};

const saveData = (data) => {
  // Remove text key
  const validatedData = data.map(item => {
    const { text, ...rest } = item;
    return rest;
  });
  
  localStorage.setItem('navPostData', JSON.stringify(validatedData));
};

const updateVisibility = () => {
  const data = getStoredData();
  
  if (!data) {
    return false;
  }

  data.forEach(item => {
    const li = document.getElementById(item.id);
    if (li) {
      li.classList.toggle('visibilityOff', !item.visible);
    }
  });
};

const updateList = () => {
  const data = getStoredData();
  
  if (!data) {
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
  });

  if (!isEditMode) {
    updateVisibility();
    setupNormalModeListeners();
  } else {
    setupEditModeListeners();
  }
};

const onNavPostTouchStart = (event) => {
  event.target.classList.add('selected');
};

const onNavPostTouchEndOrCancel = (event) => {
  event.target.classList.remove('selected');
};

const setupNormalModeListeners = () => {
  navPost.querySelectorAll('li').forEach((li) => {
    const originalHandler = originalClickHandlers.get(li.id);
    if (originalHandler) {
      li.onclick = originalHandler;
    }
    li.addEventListener('touchstart', onNavPostTouchStart);
    li.addEventListener('touchend', onNavPostTouchEndOrCancel);
    li.addEventListener('touchcancel', onNavPostTouchEndOrCancel);
  });
};

const setupEditModeListeners = () => {
  navPost.querySelectorAll('li').forEach((li) => {
    li.draggable = true;
    li.addEventListener('dragstart', onDragStart);
    li.classList.add('isEditMode')

    const clickHandler = li.onclick;
    if (clickHandler && !originalClickHandlers.has(li.id)) {
      originalClickHandlers.set(li.id, clickHandler);
    }
    li.onclick = null;
    li.removeEventListener('touchstart', onNavPostTouchStart);
    li.removeEventListener('touchend', onNavPostTouchEndOrCancel);
    li.removeEventListener('touchcancel', onNavPostTouchEndOrCancel);
  });
  navPost.addEventListener('dragover', onDragOver);
  navPost.addEventListener('drop', onDrop);
  navPost.addEventListener('click', toggleVisibility);
};

const saveInitialData = () => {
  if (!getStoredData()) {
    const initialData = Array.from(navPost.querySelectorAll('li')).map(li => ({
      id: li.id,
      visible: li.querySelector('div > span').textContent === '-',
    }));
    saveData(initialData);
  }
};

let dragged = null;

const onDragStart = (event) => {
  dragged = event.target;
  event.dataTransfer.setData('text/plain', event.target.id);
};

const onDragOver = (event) => {
  event.preventDefault();
};

const onDrop = (event) => {
  event.preventDefault();
  if (event.target.tagName === 'LI') {
    const data = getStoredData();
    const fromId = data.findIndex(item => item.id === dragged.id);
    const toId = data.findIndex(item => item.id === event.target.id);
    const [removed] = data.splice(fromId, 1);
    data.splice(toId, 0, removed);
    saveData(data);
    updateList();
  }
};

const originalClickHandlers = new Map();

let isEditMode = false;

const toggleEditMode = () => {
  isEditMode = !isEditMode;

  if (isEditMode) {
    saveInitialData();
    setupEditModeListeners();
    navPost.querySelectorAll('li').forEach((li) => {
      li.classList.remove('visibilityOff')
    });

    editActions.style.display = 'none';
    editDone.style.display = 'block';
  } else {
    navPost.querySelectorAll('li').forEach((li) => {
      li.draggable = false;
      li.removeEventListener('dragstart', onDragStart);
      li.classList.remove('isEditMode')
    });
    navPost.removeEventListener('dragover', onDragOver);
    navPost.removeEventListener('drop', onDrop);
    navPost.removeEventListener('click', toggleVisibility);
    
    setupNormalModeListeners();
    updateVisibility();

    editActions.style.display = 'block';
    editDone.style.display = 'none';
  }
};

const toggleVisibility = (event) => {
  const li = event.target.closest('li');
  event.stopPropagation();

  const data = getStoredData();
  const item = data.find(item => item.id === li.id);

  item.visible = !item.visible;

  const toggleSpan = li.querySelector('.toggleVisibility > span');
  toggleSpan.textContent = item.visible ? '-' : '+';
  li.querySelector('.toggleVisibility').classList.toggle('toggleOn', !item.visible);
  saveData(data);
};

const getiOSVersion = () => {
  return parseInt((navigator.userAgent.match(/OS (\d+)_/) || [])[1] || 0);
};

document.addEventListener('DOMContentLoaded', () => {
  if (navigator.userAgent.indexOf('iPhone') > -1) {
    document.body.style.minWidth = 'auto';
  }
    
  if (langCode.substring(0, 2) === 'ar') {
    document.body.classList.add('rtl');
    document.documentElement.setAttribute('lang', 'ar');
    document.documentElement.setAttribute('dir', 'rtl');
  }
  
  const navPost = document.getElementById('navPost');
  const editActions = document.getElementById('editActions');
  const editDone = document.getElementById('editDone');
  
  browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (tabs[0]) {
      const tabId = tabs[0].id;
      browser.storage.local.get(tabId.toString(), (result) => {
        const tabInfo = result[tabId];
        if (tabInfo) {
          const quoteLinkText = tabInfo.selectedText ? `"${tabInfo.selectedText}"` : `${tabInfo.pageTitle}`;
          document.getElementById('selectedText').innerHTML = `${quoteLinkText.replace(/\n/g, '<br>')}<br>${tabInfo.currentUrl}`;
          
          const copyElement = document.getElementById('copy2clipboard');
          copyElement.querySelector('div').textContent = labelStrings[langCode].copy2clipboard;
          
          copyElement.addEventListener('click', (event) => {
            navigator.clipboard.writeText(`${quoteLinkText}\n${tabInfo.currentUrl}`);
            
            setTimeout(() => {
              if (getiOSVersion() >= 18) {
                window.close();
              } else {
                browser.runtime.reload();
              }
            }, 100);
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

          navPost.querySelectorAll('li').forEach((li) => {
            const targetId = li.id;
            const platform = socialPlatforms[targetId];
            
            if (platform) {
              document.querySelector(`#${targetId} > div.postLabel`).textContent = labelStrings[langCode][platform.labelKey];
              const url = platform.urlTemplate
              .replace('${quoteLinkText}', encodeURIComponent(quoteLinkText))
              .replace('${currentUrl}', encodeURIComponent(tabInfo.currentUrl));
              
              li.onclick = () => {
                browser.tabs.create({ url });
              };
            }
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
            setTimeout(() => {
              if (getiOSVersion() < 18) {
                browser.runtime.reload();
              } else {
                window.close();
              }
            }, 100);
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
      });
    }
  });
  
  updateList();
  
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
});
