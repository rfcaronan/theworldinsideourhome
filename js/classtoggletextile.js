// Story pages
var controller = new ScrollMagic.Controller(
    {globalSceneOptions: {
        duration: 3300
    }
});


// build scenes
new ScrollMagic.Scene({triggerElement: "#part-1"})
	// Add class toggle
    .setClassToggle("#sec1Button", "active-textile")
    .addTo(controller);


// Story pages
var controller2 = new ScrollMagic.Controller(
    {globalSceneOptions: {
        duration: 1600
    }
});


// build scenes
new ScrollMagic.Scene({triggerElement: "#part-2"})
    // Add class toggle
    .setClassToggle("#sec2Button", "active-textile") 
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
    .setClassToggle("#sec3Button", "active-textile")
    .addTo(controller3);



