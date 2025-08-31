document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get('tabLimit', (data) => {
    const limit = data.tabLimit;
    chrome.tabs.query({ windowType: 'normal' }, (tabs) => {
      const tabCount = tabs.length;
      if (limit && tabCount > limit) {
        document.getElementById('warning').textContent = 'Tab Limit Reached!';
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
    });
  });
});
