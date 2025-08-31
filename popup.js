'use strict';

import { getManagedTabs, getStorageData } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  const { tabLimit, snoozeUntil } = await getStorageData(['tabLimit', 'snoozeUntil']);
  const managedTabs = await getManagedTabs();

  if ((tabLimit || 10) < managedTabs.length && Date.now() > (snoozeUntil || 0)) {
    document.getElementById('warning').textContent = 'Tab Limit Reached!';
    document.getElementById('snooze-buttons').style.display = 'block';
  }

  renderTabList(managedTabs);
  setupEventListeners();
});

function renderTabList(tabs) {
  const tabList = document.getElementById('tab-list');
  tabList.innerHTML = ''; // Clear existing list
  tabs.forEach((tab) => {
    const listItem = document.createElement('li');
    
    const tabTitle = document.createElement('span');
    tabTitle.textContent = tab.title;
    tabTitle.style.cursor = 'pointer';
    tabTitle.addEventListener('click', () => {
      chrome.tabs.update(tab.id, { active: true });
      window.close();
    });

    const closeButton = document.createElement('button');
    closeButton.textContent = 'x';
    closeButton.dataset.tabId = tab.id;
    closeButton.style.marginLeft = '10px';

    listItem.appendChild(tabTitle);
    listItem.appendChild(closeButton);
    tabList.appendChild(listItem);
  });
}

function setupEventListeners() {
  const tabList = document.getElementById('tab-list');
  tabList.addEventListener('click', async (event) => {
    if (event.target.tagName === 'BUTTON' && event.target.dataset.tabId) {
      const tabId = parseInt(event.target.dataset.tabId, 10);
      await new Promise(resolve => chrome.tabs.remove(tabId, resolve));
      const managedTabs = await getManagedTabs();
      renderTabList(managedTabs);
    }
  });

  document.getElementById('snooze-buttons').addEventListener('click', (event) => {
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