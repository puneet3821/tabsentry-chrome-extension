
const tabLimitInput = document.getElementById('tabLimit');
const intrusiveModeCheckbox = document.getElementById('intrusiveMode');
const saveButton = document.getElementById('save');
const statusDiv = document.getElementById('status');

function saveOptions() {
  let limit = parseInt(tabLimitInput.value, 10);
  if (isNaN(limit) || limit < 1) {
    statusDiv.textContent = 'Please enter a valid number.';
    return;
  }
  const intrusiveMode = intrusiveModeCheckbox.checked;
  chrome.storage.sync.set({ tabLimit: limit, intrusiveMode: intrusiveMode }, () => {
    statusDiv.textContent = 'Settings saved!';
    setTimeout(() => {
      statusDiv.textContent = '';
    }, 2000);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({ tabLimit: 10, intrusiveMode: false }, (items) => {
    tabLimitInput.value = items.tabLimit;
    intrusiveModeCheckbox.checked = items.intrusiveMode;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
saveButton.addEventListener('click', saveOptions);
