# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-09-07

### ✨ Added
- **Welcome & Onboarding Page:** A new welcome page now opens on first installation to guide users through features and setup.
- **Revisit Welcome Guide:** Added a link with an icon on the Options page for users to easily access the welcome guide at any time.
- **Unit Testing Framework:** Introduced Jest for unit testing to improve code quality and reliability.

### 🚀 Improved
- **Three-Zone Badge System:** The extension badge now provides proactive feedback, changing color from Green (safe) to Orange (nearing limit) to Red (over limit).
- **Auto-Closing Warning Page:** The intrusive warning page now closes automatically as soon as the user's tab count returns to the set limit, providing a more rewarding user experience.
- **Complete Options Page Redesign:** The Options page has been completely overhauled with a modern, card-based UI, intuitive toggle switches, and a much cleaner layout.

### 🛠️ Internal
- **Project Structure Refactor:** Reorganized all files into a scalable folder structure (`js`, `css`, `pages`, `assets`) for better maintainability.

## [1.0.0] - 2025-09-04

### Added
- Core feature to set a custom limit on the number of open tabs.
- Real-time tab count and status display on the extension's icon badge.
- A popup UI with a dynamic status message and a list of open tabs.
- "Snooze" functionality to temporarily disable the tab limit for 10m, 30m, 1h, or 1 Day.
- A live countdown timer in the popup to show remaining snooze time.
- A "Cancel Snooze" button to immediately re-enable the limit.
- An optional "Intrusive Mode" to open a full-page warning when the limit is reached.
- Close buttons next to each tab in the list for quick management.
- A "Night Mode" button on the options page for a dark theme.

### Changed
- The icon badge color now changes to red to indicate when the tab limit has been exceeded.
- The popup and warning pages now display a more informative message with the current/max tab count.
- Pinned and grouped tabs are now excluded from the tab count and list.

### Fixed
- Fixed a bug that caused an infinite loop when the "Intrusive Mode" warning page was created.
- Prevented the creation of duplicate warning pages if one was already open.
