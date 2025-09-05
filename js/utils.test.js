// js/utils.test.js
import { jest } from '@jest/globals';

// Mock the Chrome extension APIs
global.chrome = {
  tabs: {
    query: jest.fn(),
  },
  runtime: {
    getURL: jest.fn(path => `chrome-extension://mock/${path}`),
  },
};

// Import the function to be tested
import { getManagedTabs } from './utils.js';

describe('getManagedTabs', () => {
  // Reset mocks before each test to ensure isolation
  beforeEach(() => {
    chrome.tabs.query.mockClear();
    chrome.runtime.getURL.mockClear();
  });

  test('✅ should count only unpinned, non-grouped tabs', async () => {
    const mockTabs = [
      { id: 1, pinned: false, groupId: -1, url: 'https://example.com/page1' }, // Managed
      { id: 2, pinned: true, groupId: -1, url: 'https://example.com/page2' },  // Pinned
      { id: 3, pinned: false, groupId: 1, url: 'https://example.com/page3' },   // Grouped
      { id: 4, pinned: false, groupId: -1, url: 'https://example.com/page4' }, // Managed
    ];
    chrome.tabs.query.mockImplementation((queryInfo, callback) => {
      const filteredTabs = mockTabs.filter(tab => queryInfo.pinned === tab.pinned);
      callback(filteredTabs);
    });

    const managedTabs = await getManagedTabs();
    expect(managedTabs).toHaveLength(2);
    expect(managedTabs.map(t => t.id)).toEqual([1, 4]);
  });

  test('✅ should return 0 for a list containing only pinned tabs', async () => {
    const mockTabs = [
      { id: 1, pinned: true, groupId: -1, url: 'https://example.com/page1' },
      { id: 2, pinned: true, groupId: -1, url: 'https://example.com/page2' },
    ];
    chrome.tabs.query.mockImplementation((queryInfo, callback) => {
      const filteredTabs = mockTabs.filter(tab => queryInfo.pinned === tab.pinned);
      callback(filteredTabs);
    });

    const managedTabs = await getManagedTabs();
    expect(managedTabs).toHaveLength(0);
  });

  test('✅ should return 0 for a list containing only grouped tabs', async () => {
    const mockTabs = [
      { id: 1, pinned: false, groupId: 1, url: 'https://example.com/page1' },
      { id: 2, pinned: false, groupId: 1, url: 'https://example.com/page2' },
    ];
    chrome.tabs.query.mockImplementation((queryInfo, callback) => {
      const filteredTabs = mockTabs.filter(tab => queryInfo.pinned === tab.pinned);
      callback(filteredTabs);
    });

    const managedTabs = await getManagedTabs();
    expect(managedTabs).toHaveLength(0);
  });

  test('✅ should correctly count a mixed list of all tab types', async () => {
    const mockTabs = [
      { id: 1, pinned: false, groupId: -1, url: 'https://example.com/page1' }, // Managed
      { id: 2, pinned: true, groupId: -1, url: 'https://example.com/page2' },  // Pinned
      { id: 3, pinned: false, groupId: 1, url: 'https://example.com/page3' },   // Grouped
      { id: 4, pinned: false, groupId: -1, url: 'https://example.com/page4' }, // Managed
      { id: 5, pinned: true, groupId: 1, url: 'https://example.com/page5' },   // Pinned and Grouped
      { id: 6, pinned: false, groupId: -1, url: 'chrome-extension://mock/pages/warning/warning.html' }, // Warning page
    ];
    chrome.tabs.query.mockImplementation((queryInfo, callback) => {
      const filteredTabs = mockTabs.filter(tab => queryInfo.pinned === tab.pinned);
      callback(filteredTabs);
    });

    const managedTabs = await getManagedTabs();
    expect(managedTabs).toHaveLength(2);
    expect(managedTabs.map(t => t.id)).toEqual([1, 4]);
  });

  test('✅ should return 0 when the tab list is empty', async () => {
    chrome.tabs.query.mockImplementation((queryInfo, callback) => {
      callback([]);
    });

    const managedTabs = await getManagedTabs();
    expect(managedTabs).toHaveLength(0);
  });
});
