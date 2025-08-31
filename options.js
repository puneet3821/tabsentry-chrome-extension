
const tabLimitInput = document.getElementById('tabLimit');
const saveButton = document.getElementById('save');
const statusDiv = document.getElementById('status');

function saveOptions() {
  let limit = parseInt(tabLimitInput.value, 10);
  if (isNaN(limit) || limit < 1) {
    statusDiv.textContent = 'Please enter a valid number.';
    return;
  }
  chrome.storage.sync.set({ tabLimit: limit }, () => {
    statusDiv.textContent = 'Limit saved!';
    setTimeout(() => {
      statusDiv.textContent = '';
    }, 2000);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({ tabLimit: 10 }, (items) => {
    tabLimitInput.value = items.tabLimit;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
saveButton.addEventListener('click', saveOptions);
