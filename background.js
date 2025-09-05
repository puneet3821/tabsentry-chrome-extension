import { getManagedTabs, getStorageData } from './utils.js';

let warningTabCreationInProgress = false;

async function updateBadgeAndWarning() {
  const managedTabs = await getManagedTabs();

  const tabCount = managedTabs.length;
  const data = await getStorageData(['tabLimit', 'snoozeUntil', 'intrusiveMode']);

  const limit = data.tabLimit || 10;
  const snoozeUntil = data.snoozeUntil || 0;
  const intrusiveMode = data.intrusiveMode !== false;

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

  // Always inform the warning page to refresh its list, if it exists.
  const warningUrl = chrome.runtime.getURL('warning.html');
  const warningTabs = await new Promise(resolve => chrome.tabs.query({ url: warningUrl }, resolve));
  if (warningTabs.length > 0) {
    try {
      await chrome.tabs.sendMessage(warningTabs[0].id, { command: 'refresh' });
    } catch (error) {
      // Ignore errors, the tab might be closing or not ready.
      console.log(`Could not send refresh message: ${error.message}`);
    }
  }
}

async function handleIntrusiveWarning() {
  if (warningTabCreationInProgress) {
    return; // Exit if a warning tab is already being created.
  }
  warningTabCreationInProgress = true;

  const warningUrl = chrome.runtime.getURL('warning.html');
  try {
    const tabs = await new Promise(resolve => chrome.tabs.query({ url: warningUrl }, resolve));
    if (tabs.length === 0) {
      await new Promise(resolve => chrome.tabs.create({ url: 'warning.html' }, resolve));
    } else {
      const tabId = tabs[0].id;
      await new Promise(resolve => chrome.tabs.reload(tabId, resolve));
      await new Promise(resolve => chrome.tabs.update(tabId, { active: true }, resolve));
    }
  } finally {
    warningTabCreationInProgress = false; // Release the lock
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
  // If a tab's pinned status or group status changes, trigger an update.
  if (changeInfo.hasOwnProperty('pinned') || changeInfo.hasOwnProperty('groupId')) {
    updateBadgeAndWarning();
  }
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.command === 'updateBadge') {
    updateBadgeAndWarning();
  }
});

updateBadgeAndWarning();