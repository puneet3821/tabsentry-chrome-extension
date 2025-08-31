'use strict';

import { getManagedTabs, getStorageData, renderTabList, setupSnoozeEventListeners, setupTabListEventListeners } from './utils.js';

const header = document.getElementById('header');
const snoozeButtons = document.getElementById('snooze-buttons');
const tabListContainer = document.getElementById('tab-list');

document.addEventListener('DOMContentLoaded', refreshPage);

async function refreshPage() {
  const { tabLimit = 10 } = await getStorageData(['tabLimit']);
  const managedTabs = await getManagedTabs();
  const tabCount = managedTabs.length;

  if (tabCount > tabLimit) {
    header.style.backgroundColor = '#fbe9e7';
    header.style.color = '#c62828';
    header.textContent = `Tab Limit Reached: ${tabCount} / ${tabLimit} tabs`;
    const onTitleClick = (tabId) => {
      chrome.tabs.update(tabId, { active: true });
    };
    renderTabList(tabListContainer, managedTabs, onTitleClick);
  } else {
    header.style.backgroundColor = '#e8f5e9';
    header.style.color = '#2e7d32';
    header.textContent = `Success! You're back to ${tabCount} / ${tabLimit} tabs. This page will close shortly.`;
    snoozeButtons.style.display = 'none';
    tabListContainer.style.display = 'none';
    setTimeout(() => {
      window.close();
    }, 2500);
  }
}

setupSnoozeEventListeners(snoozeButtons);
setupTabListEventListeners(tabListContainer, refreshPage);

chrome.runtime.onMessage.addListener((request) => {
  if (request.command === 'refresh') {
    refreshPage();
  }
});