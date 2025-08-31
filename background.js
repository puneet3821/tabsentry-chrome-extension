
function updateTabCount() {
  chrome.tabs.query({ windowType: 'normal' }, (tabs) => {
    const tabCount = tabs.length;

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
                chrome.tabs.update(tabs[0].id, { active: true });
              }
            });
          }
        } else {
          chrome.action.setBadgeBackgroundColor({ color: '#1976d2' });
        }
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

updateTabCount();
