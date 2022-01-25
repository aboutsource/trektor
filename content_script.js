function addButton() {
    let sidebar = document.querySelector(".window-sidebar")
    sidebar.innerHTML = "<span class='button-link' id='togglbtn'><span class='icon-sm plugin-icon'>+</span><span>Toggl Task</span></span>" + sidebar.innerHTML
    sidebar.querySelector(".mod-no-top-margin").classList.remove("mod-no-top-margin")
    sidebar.querySelector(".js-sidebar-add-heading").classList.remove("mod-no-top-margin")
    document.querySelector("#togglbtn").addEventListener("click", onClick)
}

var mappings = []
mappings["GG"] = "gg"
mappings["Audience Builder"] = "ab"
mappings["Audience Explorer"] = "ae"
mappings["Cta Calls"] = "xcta"
mappings["Camper"] = "camper"

function onClick() {
    let apiKey = "afadffe77f745496f80ebb4bf460c615"
    //generate token at https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&name=Server%20Token&key=afadffe77f745496f80ebb4bf460c615
    let token = "af00d9597af9fb897f6b2fedb3b7152845991fe186caca08cf5dbb03bba40ffc"
    console.log("Hallo")
    let longId = window.location.href.split("/")[4]
    var url = 'https://api.trello.com/1/cards/' + longId + '?key=' + apiKey + '&token=' + token
    fetch(url).then(response => response.json()).then(response => {
        shortId = response["idShort"]

        if (!response["name"].endsWith(shortId)) {
            for (var i in response["labels"]) {
                var labelShort = mappings[response["labels"][i]["name"]]
                console.log(labelShort)
            }

            if (labelShort != undefined) {
                const fixedEncodeURIComponent = (str) => {
                    return encodeURIComponent(str).replace(/[!'()*]/g, (c) => {
                        return '%' + c.charCodeAt(0).toString(16);
                    });
                }
                var url = 'https://api.trello.com/1/cards/' + longId + '?name=' + fixedEncodeURIComponent(response["name"]) + fixedEncodeURIComponent("#") + labelShort + "_" + shortId + '&key=' + apiKey + '&token=' + token
                console.log(url)
                fetch(url, {
                    method: 'PUT'
                }).then(response => {//response.json()).then(response => {
                    console.log(response)
                    console.log("HURRA!")
                })
            }
        }

    })
}

window.addEventListener("pushstate", function () {
    if (window.location.pathname.startsWith("/c/")) {
        addButton()
    }
})