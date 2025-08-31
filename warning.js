'use strict';

import { getManagedTabs, getStorageData } from './utils.js';

const header = document.getElementById('header');
const snoozeButtons = document.getElementById('snooze-buttons');
const tabListContainer = document.getElementById('tab-list');

document.addEventListener('DOMContentLoaded', async () => {
  await refreshPage();
  setupEventListeners();
});

async function refreshPage() {
  const { tabLimit = 10 } = await getStorageData(['tabLimit']);
  const managedTabs = await getManagedTabs();
  const tabCount = managedTabs.length;

  // Update header
  header.textContent = `Tab Limit Reached: ${tabCount} / ${tabLimit} tabs`;

  // Render tab list
  renderTabList(managedTabs);
}

function renderTabList(tabs) {
  tabListContainer.innerHTML = ''; // Clear existing list
  tabs.forEach((tab) => {
    const listItem = document.createElement('li');
    
    const tabTitle = document.createElement('span');
    tabTitle.className = 'tab-title';
    tabTitle.textContent = tab.title;
    tabTitle.addEventListener('click', () => {
      chrome.tabs.update(tab.id, { active: true });
    });

    const closeButton = document.createElement('button');
    closeButton.textContent = 'x';
    closeButton.dataset.tabId = tab.id;

    listItem.appendChild(tabTitle);
    listItem.appendChild(closeButton);
    tabListContainer.appendChild(listItem);
  });
}

function setupEventListeners() {
  tabListContainer.addEventListener('click', async (event) => {
    if (event.target.tagName === 'BUTTON' && event.target.dataset.tabId) {
      const tabId = parseInt(event.target.dataset.tabId, 10);
      await new Promise(resolve => chrome.tabs.remove(tabId, resolve));
      // After closing a tab, the background script will auto-update everything,
      // including potentially closing this page if the limit is met.
      // For an immediate visual refresh, we can re-render the list.
      await refreshPage();
    }
  });

  snoozeButtons.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      const minutes = parseInt(event.target.dataset.snooze, 10);
      const snoozeUntil = Date.now() + minutes * 60 * 1000;
      chrome.storage.sync.set({ snoozeUntil }, () => {
        chrome.runtime.sendMessage({ command: 'updateBadge' });
        window.close();
      });
    }
  });

  // Listen for refresh messages from the background script
  chrome.runtime.onMessage.addListener((request) => {
    if (request.command === 'refresh') {
      refreshPage();
    }
  });
}
