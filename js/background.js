try {
  importScripts("js/action-items-utils.js", "packages/uuidv4.min.js");
} catch (e) {
  console.error(e);
}

chrome.contextMenus.create({
  id: "linkSiteMenu",
  title: "Link site for later",
  contexts: ["all"],
});

chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == "install") {
    chrome.storage.sync.set({
      actionItems: [],
    });
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId == "linkSiteMenu") {
    ActionItems.addQuickActionItem(
      "quick-action-2",
      "Read this site",
      tab,
      () => {
        ActionItems.setProgress();
      }
    );
  }
});
