class ActionItems {
  add = (text, callback) => {
    let actionItem = {
      id: uuidv4(),
      added: new Date().toString(),
      text: text,
      completed: null,
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

  remove = (id) => {
    storage.get(["actionItems"], (data) => {
      let items = data.actionItems;
      let foundItemIndex = items.findIndex((item) => item.id == id);
      if (foundItemIndex >= 0) {
        items.splice(foundItemIndex, 1);
        chrome.storage.sync.set(
          {
            actionItems: items,
          },
          () => {
            this.setProgress();
          }
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
        chrome.storage.sync.set(
          {
            actionItems: items,
          },
          () => {
            this.setProgress();
          }
        );
      }
    });
  };

  setProgress = () => {
    storage.get(["actionItems"], (data) => {
      let actionItems = data.actionItems;
      let completedItems;
      let totalItems = actionItems.length;
      completedItems = actionItems.filter((item) => item.completed).length;
      let progress = 0;
      progress = completedItems / totalItems;
      circle.animate(progress);
    });
  };
}
