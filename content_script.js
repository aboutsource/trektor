async function addButton() {
  const sidebar = await awaitSelector(".window-sidebar", 10000);
  sidebar.querySelector(".mod-no-top-margin")?.classList?.remove("mod-no-top-margin");
  sidebar.querySelector(".js-sidebar-add-heading")?.classList?.remove("mod-no-top-margin");

  const button = document.createElement("span");
  button.classList.add("button-link");
  sidebar.prepend(button);

  const buttonIcon = document.createElement("span");
  buttonIcon.classList.add("icon-sm", "plugin-icon");
  buttonIcon.innerText = "+";
  button.append(buttonIcon);

  const buttonText = document.createElement("span");
  buttonText.innerText = "Toggl Task";
  button.append(buttonText);

  button.addEventListener("click", async () => {
    const response = await trektor.runtime.sendMessage({
        action: 'addTask',
        args: [window.location.pathname.split('/', 3)[2]],
    });

    if (response) window.alert(response);
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
