console.log("Hallo")

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
    "Audience Exporter": "ae",
    "Cta Calls": "xcta",
    "Camper": "camper",
    "Praktikum": "pr"
};

function onClick() {
    let trelloApiKey = "afadffe77f745496f80ebb4bf460c615"
    browser.storage.local.get().then(result => {
        const trelloToken = result.trello
        const togglToken = result.toggl

        const idLong = window.location.pathname.split("/")[2];
        var url = new URL(`https://api.trello.com/1/cards/${idLong}?key=${trelloApiKey}&token=${trelloToken}`)
        fetch(url.toString()).then(response => response.json()).then(response => {
            const idShort = response["idShort"]

            var labelShort, labelLong = undefined
            for (var i in response["labels"]) {
                if (labelShort == undefined) {
                    labelShort = mappings[response["labels"][i]["name"]]
                    labelLong = (labelShort != undefined) ? response["labels"][i]["name"] : labelLong
                } else if (mappings[response["labels"][i]["name"]] != undefined) {
                    alert(`Diese Karte hat sowohl "${labelShort}" als auch "${mappings[response["labels"][i]["name"]]}".`)
                }
            }

            if (labelShort == undefined) {
                alert("Diese Karte besitzt kein in den mappings vorhandenes Label.")
                return false
            }

            if (!response["name"].endsWith(`#${labelShort}_${idShort}`)) {


                url = new URL(`https://api.trello.com/1/cards/${idLong}`)

                var data = {
                    "name": `${response["name"]} #${labelShort}_${idShort}`
                };
                fetch(url.toString(), {
                    method: 'PUT',
                    headers: {
                        'Authorization': `OAuth oauth_consumer_key="${trelloApiKey}", oauth_token="${trelloToken}"`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }).then(response => {
                    if (!response.ok) {
                        alert(`Error ${response.status}:\n${response.statusText}`)
                        return false
                    }

                })


            }

            url = new URL("https://api.track.toggl.com/api/v8/workspaces")
            const togglAuth = btoa(`${togglToken}:api_token`)
            fetch(url.toString(), {
                headers: {
                    'Authorization': `Basic ${togglAuth}`,
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json()).then(response => {
                for (var i in response) {
                    if (response[i]["name"] == "aboutsource") {
                        var wid = response[i]["id"]
                    }
                }
                if (wid == undefined) {
                    alert("WorkspaceID undefined\nDies bedeutet, du hast entweder keinen Zugriff zum a:s toggl oder es ist kein API-Token angegeben.")
                    return false
                }

                url = new URL(`https://api.track.toggl.com/api/v8/workspaces/${wid}/projects`)
                fetch(url.toString(), {
                    headers: {
                        'Authorization': `Basic ${togglAuth}`,
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.json()).then(response => {
                    for (var i in response) {
                        if (response[i]["name"].endsWith(`(${labelShort})`)) {
                            var pid = response[i]["id"]

                            url = new URL('https://api.track.toggl.com/api/v8/tasks')
                            data = {
                                "task": {
                                    "name": `${labelShort}_${idShort}`,
                                    "pid": pid
                                }
                            }
                            fetch(url.toString(), {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Basic ${togglAuth}`,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(data)
                            }).then(response => {
                                console.log(response)
                            })
                        }
                    }
                })
            })

        })
    })

    window.addEventListener("pushstate", function () {
        if (window.location.pathname.startsWith("/c/")) {
            addButton()
        }
    })
}
