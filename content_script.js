function addButton(){
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
