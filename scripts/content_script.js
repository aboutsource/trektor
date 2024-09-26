async function addButton() {
  const sidebar = await findSidebar(10000);

  const module = document.createElement("section");
  module.classList.add("window-module", "u-clearfix");
  sidebar.prepend(module);

  const moduleHeading = document.createElement("h4");
  moduleHeading.innerText = "Trektor";
  module.append(moduleHeading);

  const buttonList = document.createElement("div");
  buttonList.classList.add("u-clearfix");
  module.append(buttonList);

  const trackButton = document.createElement("span");
  trackButton.classList.add("button-link");
  buttonList.append(trackButton);

  const trackButtonIcon = document.createElement("span");
  trackButtonIcon.classList.add("icon-sm", "icon-clock", "trektor-button-icon");
  trackButton.append(trackButtonIcon);

  const trackButtonText = document.createElement("span");
  trackButtonText.innerText = "Trek Now";
  trackButton.append(trackButtonText);

  const addButton = document.createElement("span");
  addButton.classList.add("button-link", "add-button-link");
  addButton.innerText = "Toggl-Task hinzufügen";
  buttonList.append(addButton);

  trackButton.addEventListener("click", async () => {
    trackButtonIcon.classList.add("trektor-state-loading");

    const response = await trektor.browser.runtime.sendMessage({
      action: "track",
      args: [window.location.pathname.split("/", 3)[2]],
    });
    trackButtonIcon.classList.replace("icon-clock", "icon-check-circle");
    window.setTimeout(
      () =>
        trackButtonIcon.classList.replace("icon-check-circle", "icon-clock"),
      2000
    );
    if (response !== null) window.alert(response);
    trackButtonIcon.classList.remove("trektor-state-loading");
  });

  addButton.addEventListener("click", async () => {
    const response = await trektor.browser.runtime.sendMessage({
      action: "addTask",
      args: [window.location.pathname.split("/", 3)[2]],
    });
    if (response !== null) window.alert(response);
  });
}

function findSidebar(timeout) {
  const element = queryXPath("//h4[text()='Power-Ups']/ancestor::div");
  if (element !== null) return Promise.resolve(element);

  return new Promise((resolve, reject) => {
    const interval = window.setInterval(() => {
      const element = queryXPath("//h4[text()='Power-Ups']/ancestor::div");

      if (element !== null) {
        resolve(element);
        window.clearInterval(interval);
      } else if (timeout < 0) {
        reject(new Error("timeout"));
        window.clearInterval(interval);
      }
      timeout -= 100;
    }, 100);
  });
}

function queryXPath(xpath) {
  return document
    .evaluate(xpath, document, null, XPathResult.ANY_TYPE, null)
    .iterateNext();
}

window.addEventListener("pushstate", () => {
  if (window.location.pathname.startsWith("/c/")) addButton();
});

window.addEventListener("load", () => {
  if (window.location.pathname.startsWith("/c/")) addButton();
});
