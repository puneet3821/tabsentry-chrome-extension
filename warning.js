document.addEventListener('DOMContentLoaded', () => {
  const tabList = document.getElementById('tab-list');

  function refreshTabList() {
    chrome.tabs.query({ windowType: 'normal' }, (tabs) => {
      tabList.innerHTML = '';
      tabs.forEach((tab) => {
        const listItem = document.createElement('li');
        
        const tabTitle = document.createElement('span');
        tabTitle.className = 'tab-title';
        tabTitle.textContent = tab.title;
        tabTitle.addEventListener('click', () => {
          chrome.tabs.update(tab.id, { active: true });
        });

        const closeButton = document.createElement('button');
        closeButton.textContent = 'x';
        closeButton.dataset.tabId = tab.id;

        listItem.appendChild(tabTitle);
        listItem.appendChild(closeButton);
        tabList.appendChild(listItem);
      });
    });
  }

  tabList.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON' && event.target.dataset.tabId) {
      const tabId = parseInt(event.target.dataset.tabId, 10);
      chrome.tabs.remove(tabId, () => {
        event.target.parentElement.remove();
      });
    }
  });

  refreshTabList();
});
