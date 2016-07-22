

/***********************************************
	Resource: std/EventUtil.js
***********************************************/



/**
 * EventUtil is adapted from "Professional JavaScript for Web Developers" by Nicholas Zakas
 */

var EventUtil = {

    addHandler: function(element, type, handler){
        if (element.addEventListener){
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent){
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },

    getButton: function(event){
        if (document.implementation.hasFeature("MouseEvents", "2.0")){
            return event.button;
        } else {
            switch(event.button){
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0;
                case 2:
                case 6:
                    return 2;
                case 4: return 1;
            }
        }
    },

    getCharCode: function(event){
        if (typeof event.charCode == "number"){
            return event.charCode;
        } else {
            return event.keyCode;
        }
    },

    getClipboardText: function(event){
        var clipboardData =  (event.clipboardData || window.clipboardData);
        return clipboardData.getData("text");
    },

    getEvent: function(event){
        return event ? event : window.event;
    },

    getRelatedTarget: function(event){
        if (event.relatedTarget){
            return event.relatedTarget;
        } else if (event.toElement){
            return event.toElement;
        } else if (event.fromElement){
            return event.fromElement;
        } else {
            return null;
        }

    },

    getTarget: function(event){
        return event.target || event.srcElement;
    },

    getWheelDelta: function(event){
        if (event.wheelDelta){
            return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
        } else {
            return -event.detail * 40;
        }
    },

    preventDefault: function(event){
        if (event.preventDefault){
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },

    removeHandler: function(element, type, handler){
        if (element.removeEventListener){
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent){
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    },

    setClipboardText: function(event, value){
        if (event.clipboardData){
            event.clipboardData.setData("text/plain", value);
        } else if (window.clipboardData){
            window.clipboardData.setData("text", value);
        }
    },

    stopPropagation: function(event){
        if (event.stopPropagation){
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }

};

/***********************************************
	Resource: ui/UISlider.js
***********************************************/



/*** include std/EventUtil.js ***/

// @author Axel Ancona Esselmann
function UISlider(name, valueChangeCallback, initPercentage) {
    this.name                = name;
    this.isDown              = false;
    this.valueChangeCallback = valueChangeCallback;
    this.val                 = initPercentage;
    this.deadSpace           = 0;
}
UISlider.prototype.getNode = function() {
    return document.getElementById(this.name);
}
UISlider.prototype.setBarPercentage = function(barPercentage) {
    this.val                   = barPercentage;
    var sliderValue            = barPercentage / 100 * this.barWidth - this.sliderWidthOffset;
    this.sliderNode.style.left = sliderValue + "px";

    this.valueChangeCallback(barPercentage);
}
UISlider.prototype.setBarValue = function(value) {
    var barPercentage = value * 100 / this.barWidth;
    this.setBarPercentage(barPercentage);
}
UISlider.prototype.drag = function(event) {
    if (this.isDown) {
        event = EventUtil.getEvent(event);
        EventUtil.stopPropagation(event);
        var rect              = this.sliderNode.parentNode.getBoundingClientRect();
        var newX              = (event.clientX - rect.left - this.sliderWidthOffset);
        var barPercentage;
        var leftMargin        = -this.sliderWidthOffset;
        var rightMargin       = this.barWidth - this.sliderWidthOffset - this.deadSpace;
        if (newX < leftMargin) {
            newX          = leftMargin;
            barPercentage = 0;
        } else if (newX > rightMargin) {
            newX = rightMargin;
            barPercentage = 100;
        } else {
            var barPos    = newX + this.sliderWidthOffset;
            barPercentage = barPos * 100 / this.barWidth;
        };
        this.setBarPercentage(barPercentage);
        this.sliderNode.style.left = newX +"px";
    };
}
UISlider.prototype.stopDrag = function(event) {
    if (this.isDown) {
        this.isDown = false;
        event       = EventUtil.getEvent(event);
        EventUtil.stopPropagation(event);
    };
}
UISlider.prototype.startDrag = function(event) {
    if (!this.isDown) {
        this.isDown = true;
        event       = EventUtil.getEvent(event);
        EventUtil.stopPropagation(event);
    };
}
UISlider.prototype.draw = function(targetNode) {
    var that = this;
    var uiSliderDrawCallback = function() {
        var sliderMainNode = document.createElement('div');
        sliderMainNode.setAttribute("class", "sliderBarCont");
        sliderMainNode.setAttribute("id", that.name);

        var sliderBarNode = document.createElement('div');
        sliderBarNode.setAttribute("class", "sliderBar");
        sliderMainNode.appendChild(sliderBarNode);

        var sliderNode = document.createElement('div');
        sliderNode.setAttribute("class", "slider");
        sliderNode.setAttribute("id", that.name + "Slider");
        sliderMainNode.appendChild(sliderNode);

        targetNode.appendChild(sliderMainNode);

        that.sliderNode        = sliderNode;
        var rect               = that.sliderNode.parentNode.getBoundingClientRect();
        that.barWidth          = rect.right - rect.left;
        var sliderBound        = that.sliderNode.getBoundingClientRect();
        that.sliderWidth       = sliderBound.right - sliderBound.left;
        that.sliderWidthOffset = that.sliderWidth / 2;

        (function(obj) {
            EventUtil.addHandler(obj, "mouseup",   function(event) {that.stopDrag (event);});
            EventUtil.addHandler(obj, "mousemove", function(event) {that.drag     (event);});
        })(document);

        (function(obj) {
            EventUtil.addHandler(obj, "mousedown", function(event) {
                if (EventUtil.getButton(event) == 0) {
                    that.setBarValue(event.offsetX);
                    that.startDrag(event);
                };
            });
        })(sliderMainNode);

        (function(obj) {
            EventUtil.addHandler(obj, "mousedown", function(event) {
                if (EventUtil.getButton(event) == 0) that.startDrag(event);
            });
        })(sliderNode);
    }
    var body = document.getElementsByTagName('body')[0];
    if (body == null) globalOnLoadQueue.push(uiSliderDrawCallback);
    else uiSliderDrawCallback();
}