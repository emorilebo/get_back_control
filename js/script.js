let addItemForm = document.querySelector("#addItemForm");
let itemsList = document.querySelector(".actionItems");
let storage = chrome.storage.sync;

let actionItemsUtils = new ActionItems();

storage.get(["actionItems"], (data) => {
  let actionItems = data.actionItems;
  renderActionItems(actionItems);
  actionItemsUtils.setProgress();
});

const renderActionItems = (actionItems) => {
  actionItems.forEach((item) => {
    renderActionItem(item.text, item.id, item.completed);
  });
};

addItemForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let itemText = addItemForm.elements.namedItem("itemText").value;
  if (itemText) {
    actionItemsUtils.add(itemText);
    renderActionItem(itemText);
    addItemForm.elements.namedItem("itemText").value = "";
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

  actionItemsUtils.remove(id);
  parent.remove();
};

const renderActionItem = (text, id, completed) => {
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
  itemsList.prepend(element);
};
