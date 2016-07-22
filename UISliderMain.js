

/***********************************************
	Resource: app/jsUiElements/UISliderMain.js
***********************************************/



function createSandBox() {
    var main    = document.getElementById('main');
    var sandBox = document.createElement('div');
    sandBox.id  = "sandbox";
    main.appendChild(sandBox);
    return sandBox;
}

function uiSliderMain() {
    var sandBox = createSandBox();
    var display = document.createElement('p');
    display.id  = "display";
    sandbox.appendChild(display);

    var slider = new UISlider("slider1", function(percentage) {
        display.innerHTML = "Slider percentage: " + Math.round(percentage * 100) / 100;
    });
    slider.draw(sandBox);
    slider.setBarPercentage(50);
}


window.onload = uiSliderMain;
