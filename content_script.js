async function addButton() {
  const sidebar = await awaitSelector(".window-sidebar", 10000);

  const module = document.createElement("div");
  module.classList.add("window-module", "u-clearfix");
  sidebar.prepend(module);

  const moduleHeading = document.createElement('h3');
  moduleHeading.innerText = 'Trektor';
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
  addButton.innerText = "Toggl Task hinzufügen";
  buttonList.append(addButton);

  trackButton.addEventListener("click", async () => {
    trackButtonIcon.classList.add("trektor-state-loading");

    try {
      await browser.runtime.sendMessage({
        action: "track",
        args: [window.location.pathname.split("/", 3)[2]],
      });
      trackButtonIcon.classList.replace("icon-clock", "icon-check-circle");
      window.setTimeout(() => trackButtonIcon.classList.replace("icon-check-circle", "icon-clock"), 2000);
    } catch (err) {
      window.alert(err);
    } finally {
      trackButtonIcon.classList.remove("trektor-state-loading");
    }
  });

  addButton.addEventListener("click", async () => {
    try {
      await browser.runtime.sendMessage({
        action: "addTask",
        args: [window.location.pathname.split("/", 3)[2]],
      });
    } catch (err) {
      window.alert(err);
    }
  });
}

function awaitSelector(selector, timeout) {
  const element = document.querySelector(".window-sidebar");
  if (element !== null) return Promise.resolve(element);

  return new Promise((resolve, reject) => {
    const interval = window.setInterval(() => {
      const element = document.querySelector(".window-sidebar");

      if (element !== null) {
        resolve(element);
        window.clearInterval(interval);
      } else if (timeout < 0) {
        reject(new Error('timeout'));
        window.clearInterval(interval);
      }
      timeout -= 100;
    }, 100);
  });
}

window.addEventListener("pushstate", () => {
  if (window.location.pathname.startsWith("/c/")) addButton();
});

window.addEventListener('load', () => {
  if (window.location.pathname.startsWith("/c/")) addButton();
});
