import { getManagedTabs, getStorageData } from './utils.js';

async function updateBadgeAndWarning() {
  const managedTabs = await getManagedTabs();
  const tabCount = managedTabs.length;
  const data = await getStorageData(['tabLimit', 'snoozeUntil', 'intrusiveMode']);

  const limit = data.tabLimit || 10;
  const snoozeUntil = data.snoozeUntil || 0;
  const intrusiveMode = data.intrusiveMode || false;

  if (Date.now() < snoozeUntil) {
    chrome.action.setBadgeText({ text: '💤' });
    chrome.action.setBadgeBackgroundColor({ color: '#808080' });
  } else {
    chrome.action.setBadgeText({ text: String(tabCount) });
    if (limit && tabCount > limit) {
      chrome.action.setBadgeBackgroundColor({ color: '#d93025' });
      if (intrusiveMode) {
        handleIntrusiveWarning();
      }
    } else {
      chrome.action.setBadgeBackgroundColor({ color: '#1976d2' });
      closeWarningTabIfNotActive();
    }
  }
  
  // Inform the warning page to refresh its list
  const warningUrl = chrome.runtime.getURL('warning.html');
  const warningTabs = await new Promise(resolve => chrome.tabs.query({ url: warningUrl }, resolve));
  if (warningTabs.length > 0) {
    chrome.tabs.sendMessage(warningTabs[0].id, { command: 'refresh' });
  }
}

async function handleIntrusiveWarning() {
  const warningUrl = chrome.runtime.getURL('warning.html');
  const tabs = await new Promise(resolve => chrome.tabs.query({ url: warningUrl }, resolve));
  if (tabs.length === 0) {
    chrome.tabs.create({ url: 'warning.html' });
  } else {
    const tabId = tabs[0].id;
    chrome.tabs.reload(tabId);
    chrome.tabs.update(tabId, { active: true });
  }
}

async function closeWarningTabIfNotActive() {
  const warningUrl = chrome.runtime.getURL('warning.html');
  const warningTabs = await new Promise(resolve => chrome.tabs.query({ url: warningUrl }, resolve));
  if (warningTabs.length > 0 && !warningTabs[0].active) {
    chrome.tabs.remove(warningTabs[0].id);
  }
}

chrome.tabs.onCreated.addListener((tab) => {
  if (tab.pendingUrl && tab.pendingUrl.includes('warning.html')) {
    return;
  }
  updateBadgeAndWarning();
});

chrome.tabs.onRemoved.addListener(updateBadgeAndWarning);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.hasOwnProperty('pinned')) {
    updateBadgeAndWarning();
  }
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.command === 'updateBadge') {
    updateBadgeAndWarning();
  }
});

updateBadgeAndWarning();