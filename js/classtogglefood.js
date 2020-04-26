// Story pages
var controller = new ScrollMagic.Controller(
    {globalSceneOptions: {
        duration: 7500
    }
});


// build scenes
new ScrollMagic.Scene({triggerElement: "#part-1"})
	// Add class toggle
    .setClassToggle("#sec1Button", "active")
    .addTo(controller);


// Story pages
var controller2 = new ScrollMagic.Controller(
    {globalSceneOptions: {
        duration: 2800
    }
});


// build scenes
new ScrollMagic.Scene({triggerElement: "#part-2"})
    // Add class toggle
    .setClassToggle("#sec2Button", "active") 
    .addTo(controller2);

// Story pages
var controller3 = new ScrollMagic.Controller(
    {globalSceneOptions: {
        duration: 800
    }
});


// build scenes
new ScrollMagic.Scene({triggerElement: "#part-3"})
    // Add class toggle
    .setClassToggle("#sec3Button", "active")
    .addTo(controller3);


// About page

 var controller4 = new ScrollMagic.Controller(
	{globalSceneOptions: {
		duration: 400
	}
});


// build scenes
new ScrollMagic.Scene({triggerElement: "#part-1-about"})
	// Add class toggle
    .setClassToggle("#about1Button", "active-pink")
    .addTo(controller4);
new ScrollMagic.Scene({triggerElement: "#part-2-about"})
	// Add class toggle
    .setClassToggle("#about2Button", "active-pink") 
    .addTo(controller4);
new ScrollMagic.Scene({triggerElement: "#part-3-about"})
	// Add class toggle
    .setClassToggle("#about3Button", "active-pink")
    .addTo(controller4);
new ScrollMagic.Scene({triggerElement: "#part-4-about"})
	// Add class toggle
    .setClassToggle("#about4Button", "active-pink")
    .addTo(controller4);
new ScrollMagic.Scene({triggerElement: "#part-5-about"})
	// Add class toggle
    .setClassToggle("#about5Button", "active-pink")
    .addTo(controller4);