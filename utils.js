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

// Renders the list of tabs into a given container.
export function renderTabList(tabListContainer, tabs, onTitleClick) {
  tabListContainer.innerHTML = ''; // Clear existing list
  tabs.forEach((tab) => {
    const listItem = document.createElement('li');
    
    const tabTitle = document.createElement('span');
    tabTitle.className = 'tab-title';
    tabTitle.textContent = tab.title;
    if (onTitleClick) {
      tabTitle.addEventListener('click', () => onTitleClick(tab.id));
    }

    const closeButton = document.createElement('button');
    closeButton.textContent = 'x';
    closeButton.dataset.tabId = tab.id;

    listItem.appendChild(tabTitle);
    listItem.appendChild(closeButton);
    tabListContainer.appendChild(listItem);
  });
}

// Cancels the snooze by removing the snoozeUntil value from storage.
export async function cancelSnooze() {
  await new Promise(resolve => chrome.storage.sync.remove('snoozeUntil', resolve));
  // Send a message to the background script to immediately update the badge.
  chrome.runtime.sendMessage({ command: 'updateBadge' });
}

// Formats the remaining time into a human-readable string.
export function formatTimeRemaining(endTime) {
  const totalSeconds = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let timeString = '';
  if (hours > 0) timeString += `${hours}h `;
  if (minutes > 0) timeString += `${minutes}m `;
  timeString += `${seconds}s remaining`;

  return timeString;
}

// Sets up the event listeners for the snooze buttons.
export function setupSnoozeEventListeners(snoozeContainer) {
  snoozeContainer.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON' && event.target.dataset.snooze) {
      const minutes = parseInt(event.target.dataset.snooze, 10);
      const snoozeUntil = Date.now() + minutes * 60 * 1000;
      chrome.storage.sync.set({ snoozeUntil }, () => {
        chrome.runtime.sendMessage({ command: 'updateBadge' });
        window.close();
      });
    }
  });
}

// Sets up the event listeners for closing tabs from a list.
export function setupTabListEventListeners(tabListContainer, onTabClose) {
  tabListContainer.addEventListener('click', async (event) => {
    if (event.target.tagName === 'BUTTON' && event.target.dataset.tabId) {
      const tabId = parseInt(event.target.dataset.tabId, 10);
      await new Promise(resolve => chrome.tabs.remove(tabId, resolve));
      if (onTabClose) {
        onTabClose();
      }
    }
  });
}