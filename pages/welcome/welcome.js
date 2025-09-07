document.addEventListener('DOMContentLoaded', () => {
    const optionsBtn = document.getElementById('goToOptionsBtn');
    if (optionsBtn) {
        optionsBtn.addEventListener('click', () => {
            chrome.runtime.openOptionsPage();
        });
    }
});
