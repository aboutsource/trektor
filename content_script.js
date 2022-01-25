const sidebar = document.getElementsByClassName("window-sidebar")[0]

function addButton(){
    sidebar.innerHTML = "<span class='button-link' id='togglbtn'><span class='icon-sm plugin-icon'>+</span><span>Toggl Task</span></span>" + sidebar.innerHTML
    sidebar.getElementsByClassName("mod-no-top-margin")[1].classList.remove("mod-no-top-margin")
    document.getElementById("togglbtn").addEventListener("click", onClick)
}

function onClick(){
    alert("work in progress ;)")
}

addButton()

document.getElementById("board").addEventListener("click", addButton)