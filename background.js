// Clicking the toolbar button runs the full "kick the player" fix on the
// active tab: rebuild the video's compositor layer and nudge playback.
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: async () => {
      const v = document.querySelector('video');
      if (!v) return;
      v.style.filter = 'brightness(1.001)';
      const parent = v.parentNode;
      const next = v.nextSibling;
      parent.removeChild(v);
      void document.body.offsetHeight;
      parent.insertBefore(v, next);
      v.currentTime = v.currentTime - 0.5;
      await v.play().catch(() => {});
    },
  });
});
