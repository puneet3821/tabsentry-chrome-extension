'use strict';

import { getManagedTabs, getStorageData, setupSnoozeEventListeners, setupTabListEventListeners, cancelSnooze, formatTimeRemaining, updateUi } from './utils.js';

const header = document.getElementById('header');
const snoozeButtons = document.getElementById('snooze-buttons');
const cancelSnoozeBtn = document.getElementById('cancel-snooze-btn');
const tabListContainer = document.getElementById('tab-list');
let countdownInterval = null;

document.addEventListener('DOMContentLoaded', async () => {
  const { nightMode = false } = await getStorageData(['nightMode']);
  document.body.classList.toggle('dark-mode', nightMode);
  refreshPage();
});

async function refreshPage() {
  if (countdownInterval) clearInterval(countdownInterval);

  const { tabLimit = 10, snoozeUntil = 0 } = await getStorageData(['tabLimit', 'snoozeUntil']);
  const managedTabs = await getManagedTabs();
  const tabCount = managedTabs.length;

  updateUi({
    statusEl: header,
    snoozeButtonsEl: snoozeButtons,
    cancelSnoozeBtnEl: cancelSnoozeBtn,
    tabListContainerEl: tabListContainer,
    tabCount,
    limit: tabLimit,
    snoozeUntil,
    tabs: managedTabs,
    onTitleClick: (tabId) => {
      chrome.tabs.update(tabId, { active: true });
    },
    onUnderLimit: () => {
      header.style.backgroundColor = '#e8f5e9';
      header.style.color = '#2e7d32';
      header.textContent = `Success! You're back to ${tabCount} / ${tabLimit} tabs. This page will close shortly.`;
      snoozeButtons.style.display = 'none';
      cancelSnoozeBtn.style.display = 'none';
      tabListContainer.style.display = 'none';
      setTimeout(() => window.close(), 2500);
    },
    startCountdown: () => {
      const update = () => {
        header.textContent = `Snoozed! ${formatTimeRemaining(snoozeUntil)}`;
        if (Date.now() >= snoozeUntil) refreshPage();
      };
      update();
      countdownInterval = setInterval(update, 1000);
    }
  });
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