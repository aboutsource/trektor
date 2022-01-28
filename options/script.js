let trelloTextField = document.querySelector("#trello_token")
let togglTextField = document.querySelector("#toggl_token")

trelloTextField.addEventListener("input", onChange)
togglTextField.addEventListener("input", onChange)

function onChange(e) {
    trektorStorage.set({[e.target.name]: e.target.value});
}

trektorStorage.get(['trello', 'toggl']).then(result => {
    trelloTextField.value = result.trello;
    togglTextField.value = result.toggl;
})
