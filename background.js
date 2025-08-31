
function updateTabCount() {
  chrome.tabs.query({ windowType: 'normal', windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
    const tabCount = tabs.length;

    chrome.storage.sync.get(['tabLimit', 'snoozeUntil'], (data) => {
      const limit = data.tabLimit;
      const snoozeUntil = data.snoozeUntil || 0;

      if (Date.now() < snoozeUntil) {
        chrome.action.setBadgeText({ text: '💤' });
        chrome.action.setBadgeBackgroundColor({ color: '#808080' });
      } else {
        chrome.action.setBadgeText({ text: String(tabCount) });
        if (limit && tabCount > limit) {
          chrome.action.setBadgeBackgroundColor({ color: '#d93025' });
        } else {
          chrome.action.setBadgeBackgroundColor({ color: '#1976d2' });
        }
      }
    });
  });
}

chrome.tabs.onCreated.addListener(updateTabCount);
chrome.tabs.onRemoved.addListener(updateTabCount);

updateTabCount();
