// Story pages
var controller = new ScrollMagic.Controller(
    {globalSceneOptions: {
        duration: 2900
    }
});


// build scenes
new ScrollMagic.Scene({triggerElement: "#part-1"})
	// Add class toggle
    .setClassToggle("#sec1Button", "active-wood")
    .addTo(controller);


// Story pages
var controller2 = new ScrollMagic.Controller(
    {globalSceneOptions: {
        duration: 2600
    }
});


// build scenes
new ScrollMagic.Scene({triggerElement: "#part-2"})
    // Add class toggle
    .setClassToggle("#sec2Button", "active-wood") 
    .addTo(controller2);

// Story pages
var controller3 = new ScrollMagic.Controller(
    {globalSceneOptions: {
        duration: 8000
    }
});


// build scenes
new ScrollMagic.Scene({triggerElement: "#part-3"})
    // Add class toggle
    .setClassToggle("#sec3Button", "active-wood")
    .addTo(controller3);



