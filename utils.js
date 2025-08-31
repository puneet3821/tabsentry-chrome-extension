'use strict';

// Gets all tabs that are not pinned and not the warning page.
export async function getManagedTabs() {
  const tabs = await new Promise(resolve => {
    chrome.tabs.query({ windowType: 'normal', pinned: false }, resolve);
  });
  const warningUrl = chrome.runtime.getURL('warning.html');
  return tabs.filter(tab => tab.url !== warningUrl);
}

// Gets data from chrome.storage.sync.
export async function getStorageData(keys) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(keys, (result) => resolve(result));
  });
}
