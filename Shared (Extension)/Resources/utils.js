//
//  utils.js
//  QuoteLink
//
//  Created by Hiroyuki KITAGO on 2025/11/11.
//
export const isIOS = () => {
  return /iPhone|iPod/.test(navigator.userAgent);
};

export const isIPadOS = () => {
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
};

export const isMacOS = () => {
  return navigator.platform.includes('Mac') && !isIPadOS();
};

export const getIOSMajorVersion = () => {
  const match = navigator.userAgent.match(/OS (\d+)_/);
  return match ? parseInt(match[1], 10) : 0;
};

export const applyPlatformClass = () => {
  const body = document.body;

  if (isIOS()) {
    body.classList.add('os-ios');
  } else if (isIPadOS()) {
    body.classList.add('os-ipados');
  } else if (isMacOS()) {
    body.classList.add('os-macos');
  }
};
