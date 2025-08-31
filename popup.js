document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['tabLimit', 'snoozeUntil'], (data) => {
    const limit = data.tabLimit;
    const snoozeUntil = data.snoozeUntil || 0;

    chrome.tabs.query({ windowType: 'normal' }, (tabs) => {
      const tabCount = tabs.length;

      if (limit && tabCount > limit && Date.now() > snoozeUntil) {
        document.getElementById('warning').textContent = 'Tab Limit Reached!';
        document.getElementById('snooze-buttons').style.display = 'block';
      }

      const tabList = document.getElementById('tab-list');
      tabs.forEach((tab) => {
        const listItem = document.createElement('li');
        listItem.textContent = tab.title;
        listItem.addEventListener('click', () => {
          chrome.tabs.update(tab.id, { active: true });
          window.close();
        });
        tabList.appendChild(listItem);
      });

      document.getElementById('snooze-buttons').addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
          const minutes = parseInt(event.target.dataset.snooze, 10);
          const snoozeUntil = Date.now() + minutes * 60 * 1000;
          chrome.storage.sync.set({ snoozeUntil }, () => {
            window.close();
          });
        }
      });
    });
  });
});
