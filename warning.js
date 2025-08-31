'use strict';

import { getManagedTabs } from './utils.js';

async function refreshTabList() {
  const managedTabs = await getManagedTabs();
  const tabList = document.getElementById('tab-list');
  tabList.innerHTML = '';
  managedTabs.forEach((tab) => {
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
    tabList.appendChild(listItem);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  refreshTabList();

  const tabList = document.getElementById('tab-list');
  tabList.addEventListener('click', async (event) => {
    if (event.target.tagName === 'BUTTON' && event.target.dataset.tabId) {
      const tabId = parseInt(event.target.dataset.tabId, 10);
      await new Promise(resolve => chrome.tabs.remove(tabId, resolve));
      refreshTabList();
    }
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.command === 'refresh') {
      refreshTabList();
    }
  });
});