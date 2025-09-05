'use strict';

// Gets all tabs that are not pinned, not in a group, and not the warning page.
export async function getManagedTabs() {
  const tabs = await new Promise(resolve => {
    chrome.tabs.query({ windowType: 'normal', pinned: false }, resolve);
  });
  const warningUrl = chrome.runtime.getURL('pages/warning/warning.html');
  return tabs.filter(tab => tab.url !== warningUrl && tab.groupId === -1);
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
    tabTitle.title = tab.title; // Set the full title for the tooltip
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

// Central UI management function
export function updateUi(config) {
  const {
    statusEl, snoozeButtonsEl, cancelSnoozeBtnEl, tabListContainerEl,
    tabCount, limit, snoozeUntil, tabs,
    onTitleClick, onUnderLimit, startCountdown
  } = config;

  if (Date.now() < snoozeUntil) {
    // State: Snoozed
    statusEl.style.backgroundColor = '#e0e0e0';
    statusEl.style.color = '#333';
    snoozeButtonsEl.style.display = 'none';
    cancelSnoozeBtnEl.style.display = 'block';
    tabListContainerEl.style.display = 'none';
    startCountdown();
  } else if (tabCount > limit) {
    // State: Over Limit
    statusEl.style.backgroundColor = '#fbe9e7';
    statusEl.style.color = '#c62828';
    statusEl.textContent = `Limit Reached: ${tabCount} / ${limit} tabs`;
    snoozeButtonsEl.style.display = 'block';
    cancelSnoozeBtnEl.style.display = 'none';
    tabListContainerEl.style.display = 'block';
    renderTabList(tabListContainerEl, tabs, onTitleClick);
  } else {
    // State: Within Limit
    onUnderLimit();
  }
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
  tabListContainer.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON' && event.target.dataset.tabId) {
      const tabId = parseInt(event.target.dataset.tabId, 10);
      chrome.tabs.remove(tabId, () => {
        if (chrome.runtime.lastError) {
          console.log(`Could not remove tab ${tabId}: ${chrome.runtime.lastError.message}`);
        }
        if (onTabClose) {
          onTabClose();
        }
      });
    }
  });
}

// Opens the extension's options page.
export function openOptionsPage() {
  chrome.runtime.openOptionsPage();
}

// Creates and returns an options link element.
export function createOptionsLink() {
  const optionsLink = document.createElement('a');
  optionsLink.href = '#';
  optionsLink.id = 'options-link';
  optionsLink.className = 'options-link';
  optionsLink.textContent = '⚙️ Options';
  optionsLink.addEventListener('click', (event) => {
    event.preventDefault();
    openOptionsPage();
  });
  return optionsLink;
}
