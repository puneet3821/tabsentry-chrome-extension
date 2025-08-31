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
        
        const tabTitle = document.createElement('span');
        tabTitle.textContent = tab.title;
        tabTitle.style.cursor = 'pointer';
        tabTitle.addEventListener('click', () => {
          chrome.tabs.update(tab.id, { active: true });
          window.close();
        });

        const closeButton = document.createElement('button');
        closeButton.textContent = 'x';
        closeButton.dataset.tabId = tab.id;
        closeButton.style.marginLeft = '10px';

        listItem.appendChild(tabTitle);
        listItem.appendChild(closeButton);
        tabList.appendChild(listItem);
      });

      tabList.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON' && event.target.dataset.tabId) {
          const tabId = parseInt(event.target.dataset.tabId, 10);
          chrome.tabs.remove(tabId, () => {
            event.target.parentElement.remove();
          });
        }
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
