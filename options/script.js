let trelloTextField = document.querySelector("input[name='trello']");
let togglTextField = document.querySelector("input[name='toggl']");

trelloTextField.addEventListener("input", onChange)
togglTextField.addEventListener("input", onChange)

function onChange(e) {
  trektor.storage.set({[e.target.name]: e.target.value});
}

trektor.storage.get(['trello', 'toggl']).then(result => {
  trelloTextField.value = result.trello;
  togglTextField.value = result.toggl;
})
