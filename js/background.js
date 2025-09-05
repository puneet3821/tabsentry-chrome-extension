import { getManagedTabs, getStorageData } from './utils.js';

let warningTabCreationInProgress = false;

export async function updateBadgeAndWarning() {
  const managedTabs = await getManagedTabs();

  const tabCount = managedTabs.length;
  const data = await getStorageData(['tabLimit', 'snoozeUntil', 'intrusiveMode']);

  const tabLimit = data.tabLimit || 10;
  const snoozeUntil = data.snoozeUntil || 0;
  const intrusiveMode = data.intrusiveMode !== false;

  if (Date.now() < snoozeUntil) {
    chrome.action.setBadgeText({ text: '💤' });
    chrome.action.setBadgeBackgroundColor({ color: '#808080' });
    return; // Snooze takes precedence
  }

  chrome.action.setBadgeText({ text: String(tabCount) });

  const orangeZoneThreshold = Math.floor(tabLimit * 0.7);

  if (tabCount > tabLimit) {
    // Red Zone
    chrome.action.setBadgeBackgroundColor({ color: '#F44336' });
    if (intrusiveMode) {
      handleIntrusiveWarning();
    }
  } else {
    // Not in Red Zone, close warning page
    closeWarningTab();
    if (tabCount > orangeZoneThreshold) {
      // Orange Zone
      chrome.action.setBadgeBackgroundColor({ color: '#FF9800' });
    } else {
      // Green Zone
      chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
    }
  }

  // Always inform the warning page to refresh its list, if it exists.
  const warningUrl = chrome.runtime.getURL('pages/warning/warning.html');
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

  const warningUrl = chrome.runtime.getURL('pages/warning/warning.html');
  try {
    const tabs = await new Promise(resolve => chrome.tabs.query({ url: warningUrl }, resolve));
    if (tabs.length === 0) {
      await new Promise(resolve => chrome.tabs.create({ url: 'pages/warning/warning.html' }, resolve));
    } else {
      const tabId = tabs[0].id;
      try {
        await new Promise((resolve, reject) => {
          chrome.tabs.reload(tabId, () => {
            if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
            resolve();
          });
        });
        await new Promise((resolve, reject) => {
          chrome.tabs.update(tabId, { active: true }, () => {
            if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
            resolve();
          });
        });
      } catch (error) {
        console.log(`Could not update warning tab (${tabId}), it was likely closed. Error: ${error.message}`);
        const freshTabs = await new Promise(resolve => chrome.tabs.query({ url: warningUrl }, resolve));
        if (freshTabs.length === 0) {
          await new Promise(resolve => chrome.tabs.create({ url: 'pages/warning/warning.html' }, resolve));
        }
      }
    }
  } finally {
    warningTabCreationInProgress = false; // Release the lock
  }
}

function closeWarningTab() {
  const warningUrl = chrome.runtime.getURL('pages/warning/warning.html');
  chrome.tabs.query({ url: warningUrl }, (tabs) => {
    if (tabs && tabs.length > 0) {
      for (let i = 0; i < tabs.length; i++) {
        chrome.tabs.remove(tabs[i].id);
      }
    }
  });
}

if (typeof chrome !== 'undefined' && chrome.tabs) {
  chrome.tabs.onCreated.addListener((tab) => {
    if (tab.pendingUrl && tab.pendingUrl.includes('pages/warning/warning.html')) {
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

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.tabLimit) {
      updateBadgeAndWarning();
    }
  });

  updateBadgeAndWarning();
}