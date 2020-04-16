function hideOpenPopups() {
    document.querySelectorAll(".show").forEach(a => a.classList.toggle("show"));
    document.querySelectorAll(".show-base").forEach(a => a.classList.toggle("show-base"));
}

function hideHouse() {
    document.querySelectorAll(".hide").forEach(a => a.classList.toggle("hide"));
}

function changeColor() {
    document.querySelectorAll(".pop-btn").forEach(item => {
        item.addEventListener("click", event => {
            let inputVal = item.value;
            if (inputVal==="Food") {
                item.style.background = "#27b500";
            } else if (inputVal==="Wood") {
                item.style.background = "#DB874B";
            } else if (inputVal==="Textile") {
                item.style.background = "#2889C6";
            } else {
                item.style.background = "#cecece";
            }
        })
    })
}

function restoreColor() {
    document.querySelectorAll(".pop-btn").forEach(item => item.style.background = "white");
}

// When the user clicks on Food button, open pop-ups
document.getElementById("buttonFood").addEventListener("click", function() {
    hideOpenPopups();
    hideHouse();
    restoreColor();
    var popup = document.getElementById("foodpop");
    popup.classList.toggle("show");
    var popup = document.getElementById("foodProducts");
    popup.classList.toggle("show");
    var popup = document.getElementById("house-base");
    popup.style.opacity = ".8";
    popup.classList.toggle("show-base");
    var popup = document.getElementById("house");
    popup.classList.toggle("hide");
    var project_intro = document.getElementById("project-intro");
    project_intro.classList.toggle("hide");
});

// When the user clicks on Textile Button, open pop-ups
document.getElementById("buttonTextile").addEventListener("click", function() {
    hideOpenPopups();
    hideHouse();
    restoreColor();
    var popup = document.getElementById("textilepop");
    popup.classList.toggle("show");
    var popup = document.getElementById("textileProducts");
    popup.classList.toggle("show");
    var popup = document.getElementById("house-base");
    popup.style.opacity = ".8"; 
    popup.classList.toggle("show-base");
    var popup = document.getElementById("house");
    popup.classList.toggle("hide");
    var project_intro = document.getElementById("project-intro");
    project_intro.classList.toggle("hide");
}); 

// When the user clicks on Wood Button, open pop-ups
document.getElementById("buttonWood").addEventListener("click", function() {
    hideOpenPopups();
    hideHouse();
    restoreColor();
    var popup = document.getElementById("woodpop");
    popup.classList.toggle("show");
    var popup = document.getElementById("woodProducts");
    popup.classList.toggle("show");
    var popup = document.getElementById("house-base");
    popup.style.opacity = ".8"; 
    popup.classList.toggle("show-base");
    var popup = document.getElementById("house");
    popup.classList.toggle("hide");
    var project_intro = document.getElementById("project-intro");
    project_intro.classList.toggle("hide")
});

// When the user clicks on Home Button, pop-ups close
document.getElementById("buttonHome").addEventListener("click", function() {
    hideOpenPopups();
    hideHouse();
    restoreColor();
    var project_intro = document.getElementById("project-intro");
    project_intro.classList.toggle("show");
    var popup = document.getElementById("house");
    popup.classList.toggle("show");
});

//Color of button changes when clicked
document.getElementById("buttonFood").addEventListener("click", changeColor());
document.getElementById("buttonTextile").addEventListener("click", changeColor());
document.getElementById("buttonWood").addEventListener("click", changeColor());
document.getElementById("buttonHome").addEventListener("click", changeColor());





/*
function hideOpenPopups() {
    document.querySelectorAll(".show").forEach(a => a.classList.toggle("show"));
}

function hideHouse() {
    document.querySelectorAll(".hide").forEach(a => a.classList.toggle("hide"));
}

// When the user clicks on Food button, open pop-ups
document.getElementById("button1").addEventListener("click", function() {
    hideOpenPopups();
    hideHouse();
    var popup = document.getElementById("foodpop");
    popup.classList.toggle("show");
    var popup = document.getElementById("foodProducts");
    popup.classList.toggle("show");
    var popup = document.getElementById("house-base");
    popup.classList.toggle("show");
    var popup = document.getElementById("house");
    popup.classList.toggle("hide");
});

// When the user clicks on Wood Button, open pop-ups
document.getElementById("button2").addEventListener("click", function() {
    hideOpenPopups();
    hideHouse();
    var popup = document.getElementById("woodpop");
    popup.classList.toggle("show");
    var popup = document.getElementById("woodProducts");
    popup.classList.toggle("show");
    var popup = document.getElementById("house-base");
    popup.classList.toggle("show");
    var popup = document.getElementById("house");
    popup.classList.toggle("hide");
});

// When the user clicks on Textile Button, open pop-ups
document.getElementById("button3").addEventListener("click", function() {
    hideOpenPopups();
    hideHouse();
    var popup = document.getElementById("textilepop");
    popup.classList.toggle("show");
    var popup = document.getElementById("textileProducts");
    popup.classList.toggle("show");
    var popup = document.getElementById("house-base");
    popup.classList.toggle("show");
    var popup = document.getElementById("house");
    popup.classList.toggle("hide");
});

*/






/*

// When the user clicks on Food button, open pop-ups
document.getElementById("button1").addEventListener("click", function() {
    var popup = document.getElementById("foodpop");
    popup.classList.toggle("show");
    var popup = document.getElementById("foodProducts");
    popup.classList.toggle("show");
    var popup = document.getElementById("house-col");
    popup.classList.toggle("show");
});

// When the user clicks on Wood Button, open pop-ups
document.getElementById("button2").addEventListener("click", function() {
    var popup = document.getElementById("woodpop");
    popup.classList.toggle("show");
    var popup = document.getElementById("woodProducts");
    popup.classList.toggle("show");
    var popup = document.getElementById("house-col");
    popup.classList.toggle("show");
});

// When the user clicks on Textile Button, open pop-ups
document.getElementById("button3").addEventListener("click", function() {
    var popup = document.getElementById("textilepop");
    popup.classList.toggle("show");
    var popup = document.getElementById("textileProducts");
    popup.classList.toggle("show");
    var popup = document.getElementById("house-col");
    popup.classList.toggle("show");
});

*/