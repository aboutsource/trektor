if (typeof browser == "undefined") {
  globalThis.browser = chrome
}

const permissions = {
  origins: [
    "https://api.trello.com/*",
    "https://api.track.toggl.com/*",
    "https://trello.com/*"
  ]
}

document.querySelectorAll("input").forEach((field) => {
  field.addEventListener("input", (e) => {
    browser.storage.local.set({ [e.target.name]: e.target.value });
  });

  browser.storage.local.get(field.name).then(({ [field.name]: value }) => {
    field.value = (value === undefined) ? "" : value;
  });
});

checkPermissions()

document.getElementById("request").addEventListener("click", () => { requestPermissions() })

function requestPermissions() {
  console.log("hallo")
  browser.permissions.request(permissions, () => { checkPermissions() })
}

function checkPermissions() {
  browser.permissions.contains(permissions, (contains) => {
    if (contains) {
      document.getElementById("permissions-granted").style.display = "block";
      document.getElementById("permissions-not-granted").style.display = "none";
    } else {
      document.getElementById("permissions-granted").style.display = "none";
      document.getElementById("permissions-not-granted").style.display = "block";
    }
  })
}
