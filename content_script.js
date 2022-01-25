function addButton() {
    const sidebar = document.querySelector(".window-sidebar")
    sidebar.innerHTML = "<span class='button-link' id='togglbtn'><span class='icon-sm plugin-icon'>+</span><span>Toggl Task</span></span>" + sidebar.innerHTML
    sidebar.querySelector(".js-sidebar-add-heading").classList.remove("mod-no-top-margin")
    document.querySelector("#togglbtn").addEventListener("click", onClick)
}

function onClick() {
    var apiKey = "afadffe77f745496f80ebb4bf460c615"
    //generate token at https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&name=Server%20Token&key=afadffe77f745496f80ebb4bf460c615
    var token = "af00d9597af9fb897f6b2fedb3b7152845991fe186caca08cf5dbb03bba40ffc"

    var id = window.location.href.split("/")[4]
    var url = 'https://api.trello.com/1/cards/' + id + '?key=' + apiKey + '&token=' + token
    console.log(url)
    fetch(url).then(response => response.json()).then(response => {
        console.log(response["url"].split("/")[5].split("-")[0])
    })
}

window.addEventListener("pushstate", function () {
    if (window.location.pathname.startsWith("/c/")) {
        addButton()
    }
})