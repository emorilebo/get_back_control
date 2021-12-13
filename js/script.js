let addItemForm = document.querySelector("#addItemForm");
let itemsList = document.querySelector(".actionItems");
let storage = chrome.storage.sync;

storage.get(["actionItems"], (data) => {
  let actionItems = data.actionItems;
  renderActionItems(actionItems);
});

const renderActionItems = (actionItems) => {
  actionItems.forEach((item) => {
    renderActionItem(item.text);
  });
};

addItemForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let itemText = addItemForm.elements.namedItem("itemText").value;
  if (itemText) {
    add(itemText);
    renderActionItem(itemText);
    addItemForm.elements.namedItem("itemText").value = "";
  }
});

const add = (text) => {
  let actionItem = {
    id: 1,
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
        chrome.storage.sync.get(["actionItems"], (data) => {
          console.log(data);
        });
      }
    );
  });
};

const handleCompletedEventListener = (e) => {
  const parent = e.target.parentElement.parentElement;
  parent.classList.add("completed");
};

const renderActionItem = (text) => {
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

  checkEl.addEventListener("click", handleCompletedEventListener);
  textEl.textContent = text;
  deleteEl.innerHTML = `<i class="fas fa-times" aria-hidden="true"></i>`;

  mainElement.appendChild(checkEl);
  mainElement.appendChild(textEl);
  mainElement.appendChild(deleteEl);
  element.appendChild(mainElement);
  itemsList.prepend(element);
};

var circle = new ProgressBar.Circle("#container", {
  color: "#010101",
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 6,
  trailWidth: 2,
  easing: "easeInOut",
  duration: 1400,
  text: {
    autoStyleContainer: false,
  },
  from: { color: "#7fdf67", width: 2 },
  to: { color: "#7fdf67", width: 6 },
  // Set default step function for all animate calls
  step: function (state, circle) {
    circle.path.setAttribute("stroke", state.color);
    circle.path.setAttribute("stroke-width", state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText("");
    } else {
      circle.setText(value);
    }
  },
});
circle.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
circle.text.style.fontSize = "2rem";

circle.animate(1.0); // Number from 0.0 to 1.0
