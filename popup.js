'use strict';

import { getManagedTabs, getStorageData, renderTabList, setupSnoozeEventListeners, setupTabListEventListeners, cancelSnooze, formatTimeRemaining } from './utils.js';

const statusBox = document.getElementById('status-box');
const snoozeButtons = document.getElementById('snooze-buttons');
const cancelSnoozeBtn = document.getElementById('cancel-snooze-btn');
const tabListContainer = document.getElementById('tab-list');
let countdownInterval = null;

document.addEventListener('DOMContentLoaded', refreshPopup);

async function refreshPopup() {
  if (countdownInterval) clearInterval(countdownInterval);

  const { tabLimit = 10, snoozeUntil = 0 } = await getStorageData(['tabLimit', 'snoozeUntil']);
  const managedTabs = await getManagedTabs();
  const tabCount = managedTabs.length;

  updateUI(tabCount, tabLimit, snoozeUntil, managedTabs);
}

function updateUI(tabCount, limit, snoozeUntil, tabs) {
  if (Date.now() < snoozeUntil) {
    // State: Snoozed
    statusBox.style.backgroundColor = '#e0e0e0';
    statusBox.style.color = '#333';
    snoozeButtons.style.display = 'none';
    cancelSnoozeBtn.style.display = 'block';
    tabListContainer.style.display = 'none';

    const updateCountdown = () => {
      statusBox.textContent = `Snoozed! ${formatTimeRemaining(snoozeUntil)}`;
      if (Date.now() >= snoozeUntil) {
        refreshPopup(); // Refresh the UI once the snooze expires
      }
    };
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);

  } else if (tabCount > limit) {
    // State: Over Limit
    statusBox.style.backgroundColor = '#fbe9e7';
    statusBox.style.color = '#c62828';
    statusBox.textContent = `Limit Reached: ${tabCount} / ${limit} tabs`;
    snoozeButtons.style.display = 'block';
    cancelSnoozeBtn.style.display = 'none';
    tabListContainer.style.display = 'block';
    const onTitleClick = (tabId) => {
      chrome.tabs.update(tabId, { active: true });
      window.close();
    };
    renderTabList(tabListContainer, tabs, onTitleClick);
  } else {
    // State: Within Limit
    statusBox.style.backgroundColor = '#e3f2fd';
    statusBox.style.color = '#1565c0';
    statusBox.textContent = `All good! You have ${tabCount} / ${limit} tabs.`;
    snoozeButtons.style.display = 'none';
    cancelSnoozeBtn.style.display = 'none';
    tabListContainer.style.display = 'none';
  }
}

cancelSnoozeBtn.addEventListener('click', async () => {
  await cancelSnooze();
  await refreshPopup();
});

setupSnoozeEventListeners(snoozeButtons);
setupTabListEventListeners(tabListContainer, refreshPopup);
