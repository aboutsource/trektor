function addButton(){
    let sidebar = document.querySelector(".window-sidebar")
    let button = document.createElement('span');
    button.classList.add('button-link');
    button.addEventListener('click', onClick);
    sidebar.prepend(button);

    let buttonIcon = document.createElement('span');
    buttonIcon.classList.add('icon-sm', 'plugin-icon');
    buttonIcon.innerText = '+';
    button.append(buttonIcon);

    let buttonText = document.createElement('span');
    buttonText.innerText = 'Toggl Task';
    button.append(buttonText);
    
    sidebar.querySelector(".mod-no-top-margin").classList.remove("mod-no-top-margin")
    sidebar.querySelector(".js-sidebar-add-heading").classList.remove("mod-no-top-margin")
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
    let token = "***"
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
                var url = 'https://api.trello.com/1/cards/' + longId + '?name=' + fixedEncodeURIComponent(response["name"]) + fixedEncodeURIComponent(" #") + labelShort + "_" + shortId + '&key=' + apiKey + '&token=' + token
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
