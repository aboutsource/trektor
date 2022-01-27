const trelloTextField = document.querySelector("#trello_token")
const togglTextField = document.querySelector("#toggl_token")

trelloTextField.addEventListener("change", onChange)
trelloTextField.addEventListener("paste", onChange)
togglTextField.addEventListener("change", onChange)
togglTextField.addEventListener("paste", onChange)

function onChange() {
    browser.storage.local.set({
        "trello": trelloTextField.value,
        "toggl": togglTextField.value
    })
    console.log(`set trello token to ${togglTextField.value}`)
    console.log(`set toggl token to ${togglTextField.value}`)
}

browser.storage.local.get().then(result => {
    trelloTextField.value = result["trello"]
    togglTextField.value = result["toggl"]
})
