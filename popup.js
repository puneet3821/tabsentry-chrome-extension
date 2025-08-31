'use strict';

import { getManagedTabs, getStorageData } from './utils.js';

const statusBox = document.getElementById('status-box');
const snoozeButtons = document.getElementById('snooze-buttons');
const tabListContainer = document.getElementById('tab-list');

document.addEventListener('DOMContentLoaded', async () => {
  const { tabLimit = 10, snoozeUntil = 0 } = await getStorageData(['tabLimit', 'snoozeUntil']);
  const managedTabs = await getManagedTabs();
  const tabCount = managedTabs.length;

  updateUI(tabCount, tabLimit, snoozeUntil, managedTabs);
  setupEventListeners();
});

function updateUI(tabCount, limit, snoozeUntil, tabs) {
  if (Date.now() < snoozeUntil) {
    // State: Snoozed
    statusBox.style.backgroundColor = '#e0e0e0'; // Grey
    statusBox.style.color = '#333';
    statusBox.textContent = 'Snoozed! The limit is temporarily off.';
    snoozeButtons.style.display = 'none';
    tabListContainer.style.display = 'none';
  } else if (tabCount > limit) {
    // State: Over Limit
    statusBox.style.backgroundColor = '#fbe9e7'; // Red
    statusBox.style.color = '#c62828';
    statusBox.textContent = `Limit Reached: ${tabCount} / ${limit} tabs`;
    snoozeButtons.style.display = 'block';
    tabListContainer.style.display = 'block';
    renderTabList(tabs);
  } else {
    // State: Within Limit
    statusBox.style.backgroundColor = '#e3f2fd'; // Blue
    statusBox.style.color = '#1565c0';
    statusBox.textContent = `All good! You have ${tabCount} / ${limit} tabs.`;
    snoozeButtons.style.display = 'none';
    tabListContainer.style.display = 'none';
  }
}

function renderTabList(tabs) {
  tabListContainer.innerHTML = ''; // Clear existing list
  tabs.forEach((tab) => {
    const listItem = document.createElement('li');
    
    const tabTitle = document.createElement('span');
    tabTitle.textContent = tab.title;
    tabTitle.addEventListener('click', () => {
      chrome.tabs.update(tab.id, { active: true });
      window.close();
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
      // Refresh the popup by re-running the main logic
      const { tabLimit = 10, snoozeUntil = 0 } = await getStorageData(['tabLimit', 'snoozeUntil']);
      const managedTabs = await getManagedTabs();
      updateUI(managedTabs.length, tabLimit, snoozeUntil, managedTabs);
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
}
