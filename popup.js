'use strict';

import { getManagedTabs, getStorageData, setupSnoozeEventListeners, setupTabListEventListeners, cancelSnooze, formatTimeRemaining, updateUi } from './utils.js';

const statusBox = document.getElementById('status-box');
const snoozeButtons = document.getElementById('snooze-buttons');
const cancelSnoozeBtn = document.getElementById('cancel-snooze-btn');
const tabListContainer = document.getElementById('tab-list');
let countdownInterval = null;

document.addEventListener('DOMContentLoaded', async () => {
  const { nightMode = false } = await getStorageData(['nightMode']);
  document.body.classList.toggle('dark-mode', nightMode);
  refreshPopup();
});

async function refreshPopup() {
  if (countdownInterval) clearInterval(countdownInterval);

  const { tabLimit = 10, snoozeUntil = 0 } = await getStorageData(['tabLimit', 'snoozeUntil']);
  const managedTabs = await getManagedTabs();
  const tabCount = managedTabs.length;

  updateUi({
    statusEl: statusBox,
    snoozeButtonsEl: snoozeButtons,
    cancelSnoozeBtnEl: cancelSnoozeBtn,
    tabListContainerEl: tabListContainer,
    tabCount,
    limit: tabLimit,
    snoozeUntil,
    tabs: managedTabs,
    onTitleClick: (tabId) => {
      chrome.tabs.update(tabId, { active: true });
      window.close();
    },
    onUnderLimit: () => {
      statusBox.style.backgroundColor = '#e3f2fd';
      statusBox.style.color = '#1565c0';
      statusBox.textContent = `All good! You have ${tabCount} / ${tabLimit} tabs.`;
      snoozeButtons.style.display = 'none';
      cancelSnoozeBtn.style.display = 'none';
      tabListContainer.style.display = 'none';
    },
    startCountdown: () => {
      const update = () => {
        statusBox.textContent = `Snoozed! ${formatTimeRemaining(snoozeUntil)}`;
        if (Date.now() >= snoozeUntil) refreshPopup();
      };
      update();
      countdownInterval = setInterval(update, 1000);
    }
  });
}

cancelSnoozeBtn.addEventListener('click', async () => {
  await cancelSnooze();
  await refreshPopup();
});

setupSnoozeEventListeners(snoozeButtons);
setupTabListEventListeners(tabListContainer, refreshPopup);