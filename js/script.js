let addItemForm = document.querySelector("#addItemForm");
let itemsList = document.querySelector(".actionItems");
let storage = chrome.storage.sync;

let actionItemsUtils = new ActionItems();

var span = document.getElementById("span");

function time() {
  var d = new Date();
  var s = d.getSeconds();
  var m = d.getMinutes();
  var h = d.getHours();
  span.textContent =
    ("0" + h).substr(-2) +
    ":" +
    ("0" + m).substr(-2) +
    ":" +
    ("0" + s).substr(-2);
}

setInterval(time, 1000);

storage.get(["actionItems, 'name'"], (data) => {
  let actionItems = data.actionItems;
  let name = data.name;
  setUsersName(name);
  setGreeting();
  setGreetingImage();
  createQuickActionListener();
  renderActionItems(actionItems);
  createUpdateNameDialogListener();
  createQuickActionListener();
  actionItemsUtils.setProgress();
  chrome.storage.onChanged.addListener(() => {
    actionItemsUtils.setProgress();
  });
});

const setUsersName = (savedName) => {
  let name = savedName ? savedName : "Add Name";
  document.querySelector(".name__value").innerText = name;
};

const renderActionItems = (actionItems) => {
  actionItems.forEach((item) => {
    renderActionItem(item.text, item.id, item.completed, item.website);
  });
};

const createUpdateNameDialogListener = () => {
  let greetingName = document.querySelector(".greeting__name");
  let currentName = document.querySelector(".name__value").innerText;
  greetingName.addEventListener("click", () => {
    document.getElementById("input__name").value = currentName;
    $("#updateNameModal").modal("show");
  });
};

const createUpdateNameListener = () => {
  const element = document.querySelector("#update-name");
  element.addEventListener("click", handleUpdateName);
};

const handleUpdateName = () => {
  const name = document.getElementById("input__name").value;
  if (name) {
    ActionItems.saveName(name, () => {
      setUsersName(name);
    });
    $("#updateNameModal").modal("hide");
  }
};

const handleQuickActionListener = (e) => {
  const text = e.target.getAttribute("data-text");
  const id = e.target.getAttribute("data-id");
  getCurrentTab().then((tab) => {
    actionItemsUtils.addQuickActionItem(id, text, tab, (actionItem) => {
      renderActionItem(
        actionItem.text,
        actionItem.id,
        actionItem.completed,
        actionItem.website
      );
    });
  });
};

const createQuickActionListener = () => {
  let buttons = document.querySelectorAll(".quick-action");
  buttons.forEach((button) => {
    button.addEventListener("click", handleQuickActionListener);
  });
};

async function getCurrentTab() {
  return await new Promise((resolve, reject) => {
    chrome.tabs.query(
      { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
      (tabs) => {
        resolve(tabs[0]);
      }
    );
  });
}

addItemForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let itemText = addItemForm.elements.namedItem("itemText").value;
  if (itemText) {
    actionItemsUtils.add(itemText, null, (actionItem) => {
      renderActionItem(
        actionItem.text,
        actionItem.id,
        actionItem.completed,
        actionItem.website
      );
      addItemForm.elements.namedItem("itemText").value = "";
    });
  }
});

const handleCompletedEventListener = (e) => {
  const id = e.target.parentElement.parentElement.getAttribute("data-id");
  const parent = e.target.parentElement.parentElement;
  if (parent.classList.contains("completed")) {
    actionItemsUtils.markUnmarkCompleted(id, null);
    parent.classList.remove("completed");
  } else {
    actionItemsUtils.markUnmarkCompleted(id, new Date().toString());
    parent.classList.add("completed");
  }
};

const handleDeleteEventListener = (e) => {
  const id = e.target.parentElement.parentElement.getAttribute("data-id");
  const parent = e.target.parentElement.parentElement;

  actionItemsUtils.remove(id, () => {
    parent.remove();
  });
};

const renderActionItem = (text, id, completed, website = null) => {
  let element = document.createElement("div");
  element.classList.add("actionItem__item");
  let mainElement = document.createElement("div");
  mainElement.classList.add("actionItem__main");
  let checkEl = document.createElement("div");
  checkEl.classList.add("actionItem__check");
  let textEl = document.createElement("div");
  textEl.classList.add("actionItem__text");
  let deleteEl = document.createElement("div");
  deleteEl.classList.add("actionItem__delete");

  checkEl.innerHTML = `
  <div class="actionItem__checkBox">
    <i class="fas fa-check" aria-hidden="true"></i>
  </div>
  `;
  if (completed) {
    element.classList.add("completed");
  }

  element.setAttribute("data-id", id);
  deleteEl.addEventListener("click", handleDeleteEventListener);
  checkEl.addEventListener("click", handleCompletedEventListener);
  textEl.textContent = text;
  deleteEl.innerHTML = `<i class="fas fa-times" aria-hidden="true"></i>`;

  mainElement.appendChild(checkEl);
  mainElement.appendChild(textEl);
  mainElement.appendChild(deleteEl);
  element.appendChild(mainElement);
  if (website) {
    let linkContainer = createLinkContainer(
      website.url,
      website.favIcon,
      website.title
    );
    element.appendChild(linkContainer);
  }

  itemsList.prepend(element);
};

const createLinkContainer = (url, favIcon, title) => {
  let element = document.createElement("div");
  element.classList.add("actionItem__lintContainer");
  element.innerHTML = `
  <a href="${url}" target="_blank">
  <div class="actionItem__link">
    <div class="actionItem__favIcon">
      <img
        src="${favIcon}"
        alt=""
      />
    </div>
    <div class="actionItem__title">
      <span>${title}</span>
    </div>
  </div>
</a>
  `;
  return element;
};

const setGreeting = () => {
  let greeting = "Good ";
  const date = new Date();
  const hours = date.getHours();
  if (hours >= 5 && hours <= 11) {
    greeting += "Morning,";
  } else if (hours >= 12 && hours <= 16) {
    greeting += "Afternoon,";
  } else if (hours >= 17 && hours <= 20) {
    greeting += "Evening,";
  } else {
    greeting += "Night,";
  }
  document.querySelector(".greeting__type").innerText = greeting;
};

const setGreetingImage = () => {
  const image = document.getElementById("greeting__image");
  const date = new Date();
  const hours = date.getHours();
  if (hours >= 5 && hours <= 11) {
    image.src = "./images/good-morning.png";
  } else if (hours >= 12 && hours <= 16) {
    image.src = "./images/good-afternoon.png";
  } else if (hours >= 17 && hours <= 20) {
    image.src = "./images/good-evening.png";
  } else {
    image.src = "./images/good-night.png";
  }
};
