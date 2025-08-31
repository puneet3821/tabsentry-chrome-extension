'use strict';

import { getManagedTabs, getStorageData, renderTabList, setupSnoozeEventListeners, setupTabListEventListeners, cancelSnooze, formatTimeRemaining } from './utils.js';

const header = document.getElementById('header');
const snoozeButtons = document.getElementById('snooze-buttons');
const cancelSnoozeBtn = document.getElementById('cancel-snooze-btn');
const tabListContainer = document.getElementById('tab-list');
let countdownInterval = null;

document.addEventListener('DOMContentLoaded', refreshPage);

async function refreshPage() {
  if (countdownInterval) clearInterval(countdownInterval);

  const { tabLimit = 10, snoozeUntil = 0 } = await getStorageData(['tabLimit', 'snoozeUntil']);
  const managedTabs = await getManagedTabs();
  const tabCount = managedTabs.length;

  if (Date.now() < snoozeUntil) {
    // State: Snoozed
    header.style.backgroundColor = '#e0e0e0';
    header.style.color = '#333';
    snoozeButtons.style.display = 'none';
    cancelSnoozeBtn.style.display = 'block';
    tabListContainer.style.display = 'none';

    const updateCountdown = () => {
      header.textContent = `Snoozed! ${formatTimeRemaining(snoozeUntil)}`;
      if (Date.now() >= snoozeUntil) {
        refreshPage(); // Refresh the UI once the snooze expires
      }
    };
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);

  } else if (tabCount > tabLimit) {
    // State: Over Limit
    header.style.backgroundColor = '#fbe9e7';
    header.style.color = '#c62828';
    header.textContent = `Tab Limit Reached: ${tabCount} / ${tabLimit} tabs`;
    snoozeButtons.style.display = 'block';
    cancelSnoozeBtn.style.display = 'none';
    tabListContainer.style.display = 'block';
    const onTitleClick = (tabId) => {
      chrome.tabs.update(tabId, { active: true });
    };
    renderTabList(tabListContainer, managedTabs, onTitleClick);
  } else {
    // State: Within Limit
    header.style.backgroundColor = '#e8f5e9';
    header.style.color = '#2e7d32';
    header.textContent = `Success! You're back to ${tabCount} / ${tabLimit} tabs. This page will close shortly.`;
    snoozeButtons.style.display = 'none';
    cancelSnoozeBtn.style.display = 'none';
    tabListContainer.style.display = 'none';
    setTimeout(() => {
      window.close();
    }, 2500);
  }
}

cancelSnoozeBtn.addEventListener('click', async () => {
  await cancelSnooze();
  await refreshPage();
});

setupSnoozeEventListeners(snoozeButtons);
setupTabListEventListeners(tabListContainer, refreshPage);

chrome.runtime.onMessage.addListener((request) => {
  if (request.command === 'refresh') {
    refreshPage();
  }
});
