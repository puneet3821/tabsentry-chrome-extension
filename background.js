
function updateTabCount() {
  chrome.tabs.query({ windowType: 'normal', windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
    let tabCount = tabs.length;
    chrome.action.setBadgeText({ text: String(tabCount) });
    chrome.storage.sync.get('tabLimit', (data) => {
      const limit = data.tabLimit;
      if (limit && tabCount > limit) {
        chrome.action.setBadgeBackgroundColor({ color: '#d93025' });
      } else {
        chrome.action.setBadgeBackgroundColor({ color: '#1976d2' });
      }
    });
  });
}

chrome.tabs.onCreated.addListener(updateTabCount);
chrome.tabs.onRemoved.addListener(updateTabCount);

updateTabCount();
