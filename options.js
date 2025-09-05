const tabLimitInput = document.getElementById('tabLimit');
const intrusiveModeCheckbox = document.getElementById('intrusiveMode');
const nightModeCheckbox = document.getElementById('nightMode');
const saveButton = document.getElementById('save');
const statusDiv = document.getElementById('status');

// --- Event Listeners ---

document.addEventListener('DOMContentLoaded', restoreOptions);
saveButton.addEventListener('click', saveOptions);

// Listen for changes on any setting to enable the save button
tabLimitInput.addEventListener('input', handleSettingChange);
intrusiveModeCheckbox.addEventListener('change', handleSettingChange);
nightModeCheckbox.addEventListener('change', (event) => {
  handleSettingChange(); // Mark changes as unsaved
  applyTheme(event.target.checked); // Apply theme instantly
});

// --- Functions ---

function handleSettingChange() {
  saveButton.disabled = false;
  statusDiv.textContent = 'Unsaved changes';
}

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
    saveButton.disabled = true; // Disable button after saving
    setTimeout(() => {
      statusDiv.textContent = '';
    }, 2500);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({ tabLimit: 10, intrusiveMode: true, nightMode: false }, (items) => {
    tabLimitInput.value = items.tabLimit;
    intrusiveModeCheckbox.checked = items.intrusiveMode;
    nightModeCheckbox.checked = items.nightMode;
    applyTheme(items.nightMode);
    saveButton.disabled = true; // Start with button disabled
    statusDiv.textContent = ''; // Clear any previous status
  });
}

function applyTheme(isNight) {
  document.body.classList.toggle('dark-mode', isNight);
}
