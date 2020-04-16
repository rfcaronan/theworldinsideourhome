// init controller
var controller = new ScrollMagic.Controller(
	{globalSceneOptions: {
		duration: 800
	}
});


// build scenes
new ScrollMagic.Scene({triggerElement: "#part-1"})
	// Add class toggle
    .setClassToggle("#sec1Button", "active")
    .addTo(controller);
new ScrollMagic.Scene({triggerElement: "#part-2"})
	// Add class toggle
    .setClassToggle("#sec2Button", "active") 
    .addTo(controller);
new ScrollMagic.Scene({triggerElement: "#part-3"})
	// Add class toggle
    .setClassToggle("#sec3Button", "active")
    .addTo(controller);