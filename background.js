
function updateTabCount() {
  chrome.tabs.query({ windowType: 'normal', windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
    let tabCount = tabs.length;
    chrome.action.setBadgeText({ text: String(tabCount) });
  });
}

chrome.tabs.onCreated.addListener(updateTabCount);
chrome.tabs.onRemoved.addListener(updateTabCount);

updateTabCount();
