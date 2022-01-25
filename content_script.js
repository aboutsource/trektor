function addButton(){
    const sidebar = document.querySelector(".window-sidebar")
    sidebar.innerHTML = "<span class='button-link' id='togglbtn'><span class='icon-sm plugin-icon'>+</span><span>Toggl Task</span></span>" + sidebar.innerHTML
    sidebar.querySelectorAll(".mod-no-top-margin")[1].classList.remove("mod-no-top-margin")
    document.querySelector("#togglbtn").addEventListener("click", onClick)
}

function onClick(){
    alert("work in progress ;)")
}

window.addEventListener("pushstate", function(){
    if(window.location.pathname.startsWith("/c/")){
        addButton()
    }
})