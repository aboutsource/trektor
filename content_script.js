function addButton() {
    const sidebar = document.querySelector(".window-sidebar")
    const button = document.createElement('span');
    button.classList.add('button-link');
    button.addEventListener('click', onClick);
    sidebar.prepend(button);

    const buttonIcon = document.createElement('span');
    buttonIcon.classList.add('icon-sm', 'plugin-icon');
    buttonIcon.innerText = '+';
    button.append(buttonIcon);

    const buttonText = document.createElement('span');
    buttonText.innerText = 'Toggl Task';
    button.append(buttonText);

    sidebar.querySelector(".mod-no-top-margin").classList.remove("mod-no-top-margin")
    sidebar.querySelector(".js-sidebar-add-heading").classList.remove("mod-no-top-margin")
}

const mappings = {
    "GG": "gg",
    "Audience Builder": "ab",
    "Audience Explorer": "ae",
    "Cta Calls": "xcta",
    "Camper": "camper",
};

function onClick() {
    let apiKey = "afadffe77f745496f80ebb4bf460c615"
    //generate token at https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&name=Server%20Token&key=afadffe77f745496f80ebb4bf460c615
    let token = "***"
    console.log("Hallo")
    const longId = window.location.pathname.split("/")[2];
    var url = `https://api.trello.com/1/cards/${longId}?key=${apiKey}&token=${token}`
    fetch(url).then(response => response.json()).then(response => {
        shortId = response["idShort"]

        if (!response["name"].endsWith(shortId)) {
            for (var i in response["labels"]) {
                if (labelShort == undefined) {
                    var labelShort = mappings[response["labels"][i]["name"]]
                } else if (mappings[response["labels"][i]["name"]] != undefined) {
                    alert(`Diese Karte hat sowohl "${labelShort}" als auch "${mappings[response["labels"][i]["name"]]}".`)
                }
            }

            if (labelShort != undefined) {


                const url = new URL(`https://api.trello.com/1/cards/${longId}`)
                console.log(url)

                const data = {
                    "name": `${response["name"]} #${labelShort}_${shortId}`
                };
                const jsonBody = JSON.stringify(data);
                fetch(url.toString(), {
                    method: 'PUT',
                    headers: {
                        'Authorization': `OAuth oauth_consumer_key="${apiKey}", oauth_token="${token}"`,
                        'Content-Type': 'application/json'
                    },
                    body: jsonBody
                }).then(response => {
                    console.log(response)
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
