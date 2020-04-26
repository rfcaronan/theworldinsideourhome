//Source: https://www.w3schools.com/howto/howto_js_sticky_header.asp

// When the user scrolls the page, execute the function
window.onscroll = function() {stickyTop()};

// Get the header
var header = document.getElementById("header-buttons");

// Get the offset position of the navbar
var sticky = header.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function stickyTop() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}