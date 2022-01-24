const sidebar = document.getElementsByClassName("window-sidebar")[0]
sidebar.innerHTML = "<span class='button-link'><span class='icon-sm plugin-icon'>+</span><span>Toggl Task</span></span>" + sidebar.innerHTML
sidebar.getElementsByClassName("mod-no-top-margin")[1].classList.remove("mod-no-top-margin")