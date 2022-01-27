let engine;

if (window.browser !== undefined) {
    engine = browser;
} else {
    engine = chrome;
}

const trelloTextField = document.querySelector("#trello_token")
const togglTextField = document.querySelector("#toggl_token")

trelloTextField.addEventListener("input", onChange)
togglTextField.addEventListener("input", onChange)

function onChange() {
    engine.storage.local.set({
        "trello": trelloTextField.value,
        "toggl": togglTextField.value
    })
    console.log(`set trello token to ${togglTextField.value}`)
    console.log(`set toggl token to ${togglTextField.value}`)
}

engine.storage.local.get().then(result => {
    trelloTextField.value = result["trello"]
    togglTextField.value = result["toggl"]
})
