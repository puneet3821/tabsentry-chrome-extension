# TabSentry

## Overview

TabSentry is a productivity-focused Chrome extension designed to combat tab overload and reduce digital distraction. In a world where it's easy to accumulate dozens of open tabs, TabSentry provides a simple and effective solution by allowing you to set a custom limit on the number of active tabs. This encourages a more focused and mindful browsing experience, helping you stay on task and in control of your digital workspace.

## Core Features

- **Intuitive Options Page:** Configure your settings on a clean and user-friendly page. The "Save" button only enables when you have unsaved changes, making it clear when you need to take action.
- **Custom Tab Limit:** Set your own limit for the number of open tabs.
- **Night Mode:** Enable a sleek dark theme for comfortable viewing in low-light environments.
- **Real-Time Badge Count:** The extension icon always shows the current number of managed tabs, giving you an at-a-glance overview.
- **Color-Coded Badge:** The badge dynamically changes color to reflect your status:
    - **Blue:** You are within your set limit.
    - **Red:** You have exceeded your tab limit.
    - **Grey:** The limit is temporarily snoozed.
- **Exclusion of Pinned & Grouped Tabs:** Pinned tabs and tabs organized into groups are not counted towards your limit, allowing you to keep important pages and workflows accessible without penalty.
- **Dynamic Popup Dashboard:** Clicking the extension icon opens a central dashboard with a clear status message:
    - Displays your current count vs. your limit (e.g., "All good! You have 7 / 10 tabs").
    - Shows a clear warning when the limit is reached (e.g., "Limit Reached: 11 / 10 tabs").
- **Actionable Tab List:** When you are over the limit, the popup displays a list of all your open (non-pinned, non-grouped) tabs, each with a convenient "x" button to close it directly from the list.
- **Interactive Snooze Functionality:** Need to do some heavy research? Temporarily pause the limit for a set duration.
    - **Snooze Options:** 10 minutes, 30 minutes, 1 hour, or 1 Day.
    - **Live Countdown:** When snoozed, the popup displays a live countdown timer showing exactly how much time is remaining (e.g., "1h 15m remaining").
    - **Cancel Snooze:** You can cancel the snooze at any time with a single click, immediately re-enabling the tab limit.
- **Optional Intrusive Mode:** For those who need a stronger reminder, you can enable "Intrusive Mode." When the tab limit is exceeded, the extension will automatically open a full-page, actionable warning.

## Installation Guide

To install TabSentry manually from the source code, follow these steps:

1.  Download and unzip the project folder to a permanent location on your computer.
2.  Open the Google Chrome browser and navigate to `chrome://extensions`.
3.  In the top-right corner, toggle the **"Developer mode"** switch to the "on" position.
4.  Click the **"Load unpacked"** button that appears on the top-left.
5.  In the file selection dialog, navigate to and select the unzipped project folder.
6.  The TabSentry extension should now appear in your list of extensions and in your browser's toolbar.

## How to Use

-   **Configuration:** Right-click the TabSentry icon in your toolbar and select "Options." On this page, you can set your desired tab limit, toggle Intrusive Mode, and enable Night Mode.
-   **Monitoring:** Keep an eye on the icon badge to see your current tab count. Click the icon at any time to open the popup dashboard for a more detailed status.
-   **Taking Action:**
    -   If you are over your limit, use the snooze buttons in the popup or warning page to temporarily disable the limit.
    -   Close unneeded tabs directly from the list in the popup or warning page.
    -   If you've snoozed the limit but are ready to re-enable it, simply click "Cancel Snooze."

## Technical Breakdown

This section provides a high-level overview of the project's file structure for future development and reference.

-   `manifest.json`: The core configuration file for the Chrome extension. It defines permissions (tabs, storage), sets up the background service worker as a module, and registers the popup, options, and icon files.
-   `background.js`: The extension's main event handler. It runs persistently in the background, listening for events like tab creation, removal, and updates. It is responsible for counting tabs, managing the badge state, and enforcing the intrusive mode warning.
-   `popup.html` / `popup.js`: Defines the structure and logic for the main UI popup that appears when the user clicks the extension icon. It acts as the primary user dashboard.
-   `warning.html` / `warning.js`: Defines the structure and logic for the full-page warning that appears when "Intrusive Mode" is enabled and the tab limit is exceeded.
-   `options.html` / `options.js`: Defines the structure and logic for the user settings page, where the tab limit and other options can be configured.
-   `utils.js`: A crucial helper file containing shared logic used across different parts of the extension. It centralizes functions for fetching tabs, accessing storage, rendering UI components, and handling snooze logic to keep the code DRY (Don't Repeat Yourself) and easier to maintain.
-   `theme.css`: A dedicated stylesheet that defines the color variables and styles for the Light and Dark (Night) modes, ensuring a consistent look and feel.