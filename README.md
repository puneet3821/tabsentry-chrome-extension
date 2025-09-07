# TabSentry
## Overview
TabSentry is a productivity-focused Chrome extension designed to combat tab overload and reduce digital distraction. In a world where it's easy to accumulate dozens of open tabs, TabSentry provides a simple and effective solution by allowing you to set a custom limit on the number of active tabs. This encourages a more focused and mindful browsing experience, helping you stay on task and in control of your digital workspace.

## Core Features
- **Onboarding Experience:** Upon first installation, you'll be greeted with a welcome page that explains key features and helps you get set up.

- **Modern Options Page:** Configure your settings on a completely redesigned, user-friendly page with intuitive toggle switches.

- **Custom Tab Limit:** Set your own limit for the number of open tabs.

- **Night Mode:** Enable a sleek dark theme for comfortable viewing in low-light environments.

- **Real-Time Badge Count:** The extension icon always shows the current number of managed tabs, giving you an at-a-glance overview.

- **Proactive Color-Coded Badge:** The badge dynamically changes color to provide an early warning as you approach your limit:

    - **Green:** You are well within your limit (0-70%).

    - **Orange:** You are approaching your limit (71-100%).

    - **Red:** You have exceeded your tab limit.

    - **Grey:** The limit is temporarily snoozed.

- **Exclusion of Pinned & Grouped Tabs:** Pinned tabs and tabs organized into groups are not counted towards your limit, allowing you to keep important pages accessible.

- **Dynamic Popup Dashboard:** Clicking the extension icon opens a central dashboard with a clear status message and snooze controls.

- **Actionable Tab List:** When you are over the limit, the popup displays a list of your open tabs, each with a convenient "x" button to close it directly.

- **Interactive Snooze Functionality:** Temporarily pause the limit for a set duration (10m, 30m, 1h, or 1 Day) with a live countdown timer.

- **Optional Intrusive Mode:** For a stronger reminder, enable this mode to get a full-page warning when you exceed your limit.

- **Auto-Closing Warning:** When in Intrusive Mode, the warning page automatically disappears the moment you're back within your tab limit.

## Installation Guide
To install TabSentry manually from the source code, follow these steps:

1.  Download and unzip the project folder.

2.  Open Google Chrome and navigate to `chrome://extensions`.

3.  In the top-right corner, toggle **"Developer mode"** on.

4.  Click the **"Load unpacked"** button that appears on the top-left.

5.  In the file selection dialog, navigate to and select the unzipped project folder.

6.  The TabSentry extension will now be available in your browser's toolbar.

## Development
### Build Process
This project does not require a complex build step. To package the extension for the Chrome Web Store:

1.  Ensure all code changes are saved.
2.  Create a `.zip` archive of the entire project directory.
3.  Upload this `.zip` file to the Chrome Developer Dashboard.

### Running Tests
This project uses Jest for unit testing the core logic.

**Prerequisites:** You must have Node.js and npm installed.

**Install Dependencies:** Open your terminal in the project root and run the following command to install Jest:
```bash
npm install
```
**Run Tests:** Execute the test suite with this command:
```bash
npm test
```
The tests cover the utility functions in `js/utils.js` to ensure the tab counting and filtering logic is correct.

## Technical Breakdown
The project follows an organized folder structure to separate concerns:

-   `manifest.json`: The core configuration file for the Chrome extension. It defines permissions, registers the background service worker, and declares all UI pages.

-   `/assets`: Contains all static images, such as the extension icons and logos.

-   `/css`: Holds all stylesheets. `theme.css` defines the variables and styles for Light and Dark (Night) modes.

-   `/js`: Contains the main logic.
    -   `background.js`: The extension's main event handler (service worker). It listens for tab events, manages the badge state, and enforces the tab limit.
    -   `utils.js`: A helper file with shared logic used across the extension (e.g., fetching tabs, accessing storage).

-   `/pages`: Contains all user-facing components. Each sub-folder holds the HTML, JS, and CSS for a specific view.
    -   `/options`: The redesigned settings page.
    -   `/popup`: The main popup dashboard.
    -   `/warning`: The full-page intrusive warning.
    -   `/welcome`: The onboarding page for new users.


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