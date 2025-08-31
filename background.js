
function updateTabCount() {
  chrome.tabs.query({ windowType: 'normal', pinned: false }, (tabs) => {
    const warningUrl = chrome.runtime.getURL('warning.html');
    const filteredTabs = tabs.filter(tab => tab.url !== warningUrl);
    const tabCount = filteredTabs.length;

    chrome.storage.sync.get(['tabLimit', 'snoozeUntil', 'intrusiveMode'], (data) => {
      const limit = data.tabLimit;
      const snoozeUntil = data.snoozeUntil || 0;
      const intrusiveMode = data.intrusiveMode || false;

      if (Date.now() < snoozeUntil) {
        chrome.action.setBadgeText({ text: '💤' });
        chrome.action.setBadgeBackgroundColor({ color: '#808080' });
      } else {
        chrome.action.setBadgeText({ text: String(tabCount) });
        if (limit && tabCount > limit) {
          chrome.action.setBadgeBackgroundColor({ color: '#d93025' });
          if (intrusiveMode) {
            const warningUrl = chrome.runtime.getURL('warning.html');
            chrome.tabs.query({ url: warningUrl }, (tabs) => {
              if (tabs.length === 0) {
                chrome.tabs.create({ url: 'warning.html' });
              } else {
                const tabId = tabs[0].id;
                chrome.tabs.reload(tabId);
                chrome.tabs.update(tabId, { active: true });
              }
            });
          }
        } else {
          chrome.action.setBadgeBackgroundColor({ color: '#1976d2' });
          // Close the warning tab if it exists and is not active
          const warningUrl = chrome.runtime.getURL('warning.html');
          chrome.tabs.query({ url: warningUrl }, (warningTabs) => {
            if (warningTabs.length > 0 && !warningTabs[0].active) {
              chrome.tabs.remove(warningTabs[0].id);
            }
          });
        }
      }
    });

    // Inform the warning page to refresh its list
//    const warningUrl = chrome.runtime.getURL('warning.html');
    chrome.tabs.query({ url: warningUrl }, (warningTabs) => {
      if (warningTabs.length > 0) {
        chrome.tabs.sendMessage(warningTabs[0].id, { command: 'refresh' });
      }
    });
  });
}

chrome.tabs.onCreated.addListener((tab) => {
  if (tab.pendingUrl && tab.pendingUrl.includes('warning.html')) {
    return;
  }
  updateTabCount();
});
chrome.tabs.onRemoved.addListener(updateTabCount);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // If a tab's pinned status changes, trigger an update
  if (changeInfo.hasOwnProperty('pinned')) {
    updateTabCount();
  }
});

updateTabCount();
