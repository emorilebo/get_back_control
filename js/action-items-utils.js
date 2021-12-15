class ActionItems {
  addQuickActionItem = (id, text, tab, callback) => {
    let website = null;
    if (id == "quick-action-2") {
      website = {
        url: tab.url,
        tav_icon: tab.favIconUrl,
        title: tab.title,
      };
    }

    this.add(text, website, callback);
  };

  add = (text, website = null, callback) => {
    let actionItem = {
      id: uuidv4(),
      added: new Date().toString(),
      text: text,
      completed: null,
      website: website,
    };

    chrome.storage.sync.get(["actionItems"], (data) => {
      let items = data.actionItems;
      if (!items) {
        items = [actionItem];
      } else {
        items.push(actionItem);
      }

      chrome.storage.sync.set(
        {
          actionItems: items,
        },
        () => {
          callback(actionItem);
        }
      );
    });
  };

  static saveName(name, callback) {
    ActionItems.storage.set(
      {
        name: name,
      },
      callback
    );
  }

  remove = (id, callback) => {
    storage.get(["actionItems"], (data) => {
      let items = data.actionItems;
      let foundItemIndex = items.findIndex((item) => item.id == id);
      if (foundItemIndex >= 0) {
        items.splice(foundItemIndex, 1);
        chrome.storage.sync.set(
          {
            actionItems: items,
          },
          callback
        );
      }
    });
  };

  markUnmarkCompleted = (id, completeStatus) => {
    storage.get(["actionItems"], (data) => {
      let items = data.actionItems;
      let foundItemIndex = items.findIndex((item) => item.id == id);
      if (foundItemIndex >= 0) {
        items[foundItemIndex].completed = completeStatus;
        chrome.storage.sync.set({
          actionItems: items,
        });
      }
    });
  };

  static setProgress() {
    let completedItems = 0;
    ActionItems.getCurrentItems((items) => {
      let totalItems = items.length;
      completedItems = items.filter((item) => {
        return item.completed;
      }).length;
      let progress = 0;
      if (totalItems > 0) {
        progress = parseFloat(completedItems / totalItems).toFixed(2);
      }
      ActionItems.setBrowserBadge(totalItems - completedItems);
      if (typeof window.circle !== "undefined") circle.animate(progress);
    });
  }
  static setBrowserBadge(todoItems) {
    let text = `${todoItems}`;
    if (todoItems > 9) {
      text = "9+";
    }
    chrome.browserAction.setBadgeText({ text: text });
  }
}
