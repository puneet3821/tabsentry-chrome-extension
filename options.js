const tabLimitInput = document.getElementById('tabLimit');
const intrusiveModeCheckbox = document.getElementById('intrusiveMode');
const nightModeCheckbox = document.getElementById('nightMode');
const saveButton = document.getElementById('save');
const statusDiv = document.getElementById('status');

function saveOptions() {
  const limit = parseInt(tabLimitInput.value, 10);
  if (isNaN(limit) || limit < 1) {
    statusDiv.textContent = 'Please enter a valid number.';
    return;
  }
  const intrusiveMode = intrusiveModeCheckbox.checked;
  const nightMode = nightModeCheckbox.checked;

  chrome.storage.sync.set({ tabLimit: limit, intrusiveMode, nightMode }, () => {
    statusDiv.textContent = 'Settings saved!';
    setTimeout(() => {
      statusDiv.textContent = '';
    }, 2000);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({ tabLimit: 10, intrusiveMode: false, nightMode: false }, (items) => {
    tabLimitInput.value = items.tabLimit;
    intrusiveModeCheckbox.checked = items.intrusiveMode;
    nightModeCheckbox.checked = items.nightMode;
    applyTheme(items.nightMode);
  });
}

function applyTheme(isNight) {
  document.body.classList.toggle('dark-mode', isNight);
}

document.addEventListener('DOMContentLoaded', restoreOptions);
saveButton.addEventListener('click', saveOptions);
nightModeCheckbox.addEventListener('change', (event) => {
  applyTheme(event.target.checked);
});