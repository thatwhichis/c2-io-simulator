// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.IOSimulator = function(runtime)
{
    this.runtime = runtime;
};

(function ()
{
    var pluginProto = cr.plugins_.IOSimulator.prototype;
		
    /////////////////////////////////////
    // Object type class
    pluginProto.Type = function(plugin)
    {
        this.plugin = plugin;
        this.runtime = plugin.runtime;
    };

    var typeProto = pluginProto.Type.prototype;

    // called on startup for each object type
    typeProto.onCreate = function()
    {
    };

    /////////////////////////////////////
    // Instance class
    pluginProto.Instance = function(type)
    {
        this.type = type;
        this.runtime = type.runtime;

        // MOUSE CLICK
        this.buttonMap = [4];
        this.mouseXcanvas = 0;
        this.mouseYcanvas = 0;
        this.triggerButton = 0;
        this.triggerType = 0;

        // CAPS LOCK
        this.capsLock = 0;
    };
	
    var instanceProto = pluginProto.Instance.prototype;

    // called whenever an instance is created
    instanceProto.onCreate = function()
    {
        var self = this;

        // BIND KEYBOARD EVENT
        if (!this.runtime.isDomFree) {
            window.addEventListener('keydown', function (event) { self.checkCaps(event) });
        }
    };

    // CUSTOM FUNCTION FOR KEYDOWN CALLBACK TO OBTAIN CAPS LOCK STATE
    instanceProto.checkCaps = function (event)
    {
        var caps = e.getModifierState && e.getModifierState('CapsLock');
        this.capsLock = (caps ? 1 : 0);
    };
	
    // called whenever an instance is destroyed
    // note the runtime may keep the object after this call for recycling; be sure
    // to release/recycle/reset any references to other objects in this function.
    instanceProto.onDestroy = function ()
    {
        // RELEASE KEYBOARD EVENT
        if (!this.runtime.isDomFree) {
            window.removeEventListener('keydown', function (event) { self.checkCaps(event) });
        }

        // MOUSE CLICK
        this.buttonMap = null;
        this.mouseXcanvas = null;
        this.mouseYcanvas = null;
        this.triggerButton = null;
        this.triggerType = null;

        // CAPS LOCK
        this.capsLock = null;
    };
	
    // called when saving the full state of the game
    instanceProto.saveToJSON = function ()
    {
        return {
        };
    };
	
    // called when loading the full state of the game
    instanceProto.loadFromJSON = function (o)
    {
    };
	
    // only called if a layout object - draw to a canvas 2D context
    instanceProto.draw = function(ctx)
    {
    };
	
    // only called if a layout object in WebGL mode - draw to the WebGL context
    // 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
    // directory or just copy what other plugins do.
    instanceProto.drawGL = function (glw)
    {
    };
	
    /**BEGIN-PREVIEWONLY**/
    instanceProto.getDebuggerValues = function (propsections)
    {
        // Append to propsections any debugger sections you want to appear.
        // Each section is an object with two members: "title" and "properties".
        // "properties" is an array of individual debugger properties to display
        // with their name and value, and some other optional settings.
        propsections.push({
            "title": "IOSimulator",
            "properties": [
                {"name": "Absolute position", "value": "(" + this.mouseXcanvas + ", " + this.mouseYcanvas + ")", "readonly": true},
            ]
        });
    };
	
    /**END-PREVIEWONLY**/

    //////////////////////////////////////
    // Conditions
    function Cnds() {};

    Cnds.prototype.K_CL = function ()
    {
        // RETURN CAPS LOCK STATE
        return this.capsLock;
    };
	
    pluginProto.cnds = new Cnds();
	
    //////////////////////////////////////
    // Actions
    function Acts() {};

    Acts.prototype.M_Click = function (i_button, i_clicktype, i_action, f_x, f_y)
    {
        // i_button 0 = LEFT
        // i_button 1 = MIDDLE
        // i_button 2 = RIGHT
        // i_clicktype 0 = SINGLE
        // i_clicktype 1 = DOUBLE
        // i_action 0 = PRESS
        // i_action 1 = RELEASE
        // f_x = X COORD
        // f_y = Y COORD

        // INSTANTIATE AND INITIALIZE AN EVENT OBJECT TO PASS TO FUNCTIONS
        var info = {};
        info["which"] = i_button + 1;
        info["preventDefault"] = function () { };

        // CALC X AND Y POSITION ON BOTTOM LAYER AS IF ITS SCALE WERE 1
        // TODO - MAY NEED TO CALC THIS FOR LAYER PARAM - OUTSIDE OUR USE-CASE
        var layer = this.runtime.getLayerByNumber(0);
        var offset = this.runtime.isDomFree ? dummyoffset : jQuery(this.runtime.canvas).offset();
        var oldScale = layer.scale;
        var oldZoomRate = layer.zoomRate;
        var oldParallaxX = layer.parallaxX;
        var oldAngle = layer.angle;
        layer.scale = 1;
        layer.zoomRate = 1.0;
        layer.parallaxX = 1.0;
        layer.angle = 0;
        var f_x_canvas = layer.layerToCanvas(f_x, f_y, true);
        var f_y_canvas = layer.layerToCanvas(f_x, f_y, false);
        info["pageX"] = f_x_canvas + offset.left;
        info["pageY"] = f_y_canvas + offset.top;
        layer.scale = oldScale;
        layer.zoomRate = oldZoomRate;
        layer.parallaxX = oldParallaxX;
        layer.angle = oldAngle;

        // DOUBLE CLICK
        if (i_clicktype) {
            // SANITY CHECK RUNTIME OBJECTS
            if (this.runtime.objectsByUid) {
                // C2 DOESN'T GIVE US RELIABLE EXTERNAL OBJECT CONTROL BY DESIGN
                // HAVE TO FIND THE EXTERNAL OBJECT WITH THE FUNCTION WE'RE LOOKING FOR
                // PARSE RUNTIME OBJECTS LOOKING FOR THE FUNCTION WE WANT TO MANIPULATE
                for (var key in this.runtime.objectsByUid) {
                    if (this.runtime.objectsByUid[key].onDoubleClick) {
                        this.runtime.objectsByUid[key].mouseXcanvas = f_x_canvas;
                        this.runtime.objectsByUid[key].mouseYcanvas = f_y_canvas;
                        this.runtime.objectsByUid[key].onDoubleClick(info);
                        break;
                    }
                }
            }
        // SINGLE CLICK
        } else {
            // RELEASE
            if (i_action) {
                // MOUSE
                // SANITY CHECK RUNTIME OBJECTS
                if (this.runtime.objectsByUid) {
                    // PARSE RUNTIME OBJECTS LOOKING FOR THE FUNCTION WE WANT TO MANIPULATE
                    for (var key in this.runtime.objectsByUid) {
                        if (this.runtime.objectsByUid[key].onMouseUp) {
                            this.runtime.objectsByUid[key].mouseXcanvas = f_x_canvas;
                            this.runtime.objectsByUid[key].mouseYcanvas = f_y_canvas;
                            this.runtime.objectsByUid[key].onMouseUp(info);
                            break;
                        }
                    }
                }
                // DRAG AND DROP
                // SANITY CHECK RUNTIME BEHAVIORS
                if (this.runtime.behaviors) {
                    // PARSE RUNTIME BEHAVIORS LOOKING FOR THE ONE WE WANT TO MANIPULATE
                    for (var key in this.runtime.behaviors) {
                        if (this.runtime.behaviors[key].onMouseUp) {
                            this.runtime.behaviors[key].onMouseUp(info);
                        }
                    }
                }
            // PRESS
            } else {
                // MOUSE
                // SANITY CHECK RUNTIME OBJECTS
                if (this.runtime.objectsByUid) {
                    // PARSE RUNTIME OBJECTS LOOKING FOR THE FUNCTION WE WANT TO MANIPULATE
                    for (var key in this.runtime.objectsByUid) {
                        if (this.runtime.objectsByUid[key].onMouseDown) {
                            this.runtime.objectsByUid[key].mouseXcanvas = f_x_canvas;
                            this.runtime.objectsByUid[key].mouseYcanvas = f_y_canvas;
                            this.runtime.objectsByUid[key].onMouseDown(info);
                            break;
                        }
                    }
                }
                // DRAG AND DROP
                // SANITY CHECK RUNTIME BEHAVIORS
                if (this.runtime.behaviors) {
                    // PARSE RUNTIME BEHAVIORS LOOKING FOR THE ONE WE WANT TO MANIPULATE
                    for (var key in this.runtime.behaviors) {
                        if (this.runtime.behaviors[key].onMouseDown) {
                            this.runtime.behaviors[key].onMouseDown(info);
                        }
                    }
                }
            }
        }
    };

    Acts.prototype.M_Move = function (f_x, f_y)
    {
        // INSTANTIATE AND INITIALIZE AN EVENT OBJECT TO PASS TO FUNCTIONS
        var info = {};
        // TODO - REFACTOR? - NEXT LINE ADDED TO ADDRESS DRAGNDROP BEHAVIOR
        info["which"] = 1;

        // CALC X AND Y POSITION ON BOTTOM LAYER AS IF ITS SCALE WERE 1
        // TODO - MAY NEED TO CALC THIS FOR LAYER PARAM - OUTSIDE OUR USE-CASE
        var layer = this.runtime.getLayerByNumber(0);
        var offset = this.runtime.isDomFree ? dummyoffset : jQuery(this.runtime.canvas).offset();
        var oldScale = layer.scale;
        var oldZoomRate = layer.zoomRate;
        var oldParallaxX = layer.parallaxX;
        var oldAngle = layer.angle;
        layer.scale = 1;
        layer.zoomRate = 1.0;
        layer.parallaxX = 1.0;
        layer.angle = 0;
        info["pageX"] = layer.layerToCanvas(f_x, f_y, true) + offset.left;
        info["pageY"] = layer.layerToCanvas(f_x, f_y, false) + offset.top;
        layer.scale = oldScale;
        layer.zoomRate = oldZoomRate;
        layer.parallaxX = oldParallaxX;
        layer.angle = oldAngle;

        // MOUSE
        // SANITY CHECK RUNTIME OBJECTS
        if (this.runtime.objectsByUid) {
            // PARSE RUNTIME OBJECTS LOOKING FOR THE FUNCTION WE WANT TO MANIPULATE
            for (var key in this.runtime.objectsByUid) {
                if (this.runtime.objectsByUid[key].onMouseMove) {
                    this.runtime.objectsByUid[key].onMouseMove(info);
                    break;
                }
            }
        }

        // DRAG AND DROP
        // SANITY CHECK RUNTIME BEHAVIORS
        if (this.runtime.behaviors) {
            // PARSE RUNTIME BEHAVIORS LOOKING FOR THE ONE WE WANT TO MANIPULATE
            for (var key in this.runtime.behaviors) {
                if (this.runtime.behaviors[key].onMouseMove) {
                    this.runtime.behaviors[key].onMouseMove(info);
                }
            }
        }
    };

    Acts.prototype.M_Wheel = function (i_dir)
    {
        // i_dir 0 = DOWN
        // i_dir 1 = UP

        // INSTANTIATE AND INITIALIZE AN EVENT OBJECT TO PASS TO FUNCTIONS
        var info = {};
        if (i_dir) {
            info["wheelDelta"] = Math.floor(1);
            info["detail"] = Math.floor(-1);
        } else {
            info["wheelDelta"] = Math.floor(-1);
            info["detail"] = Math.floor(1);
        }
        info["preventDefault"] = function () { };

        // SANITY CHECK RUNTIME OBJECTS
        if (this.runtime.objectsByUid) {
            // PARSE RUNTIME OBJECTS LOOKING FOR THE FUNCTION WE WANT TO MANIPULATE
            for (var key in this.runtime.objectsByUid) {
                if (this.runtime.objectsByUid[key].onWheel) {
                    // SIMULATE WHEEL 
                    this.runtime.objectsByUid[key].onWheel(info);
                    break;
                }
            }
        }
    }

    Acts.prototype.K_Press = function (i_option, i_key) {

        // i_option 0 = DOWN
        // i_option 1 = UP
        // i_key = NUMERIC KEY CODE

        // INSTANTIATE AND INITIALIZE AN EVENT OBJECT TO PASS TO FUNCTIONS
        var info = {};
        info["which"] = Math.floor(i_key);
        info["preventDefault"] = function () { };
        info["stopPropagation"] = function () { };

        // SANITY CHECK RUNTIME OBJECTS
        if (this.runtime.objectsByUid) {
            // PARSE RUNTIME OBJECTS LOOKING FOR THE FUNCTION WE WANT TO MANIPULATE
            for (var key in this.runtime.objectsByUid) {
                if (this.runtime.objectsByUid[key].onKeyUp && this.runtime.objectsByUid[key].onKeyDown) {
                    // SIMULATE RELEASE
                    if (i_option) {
                        this.runtime.objectsByUid[key].onKeyUp(info);
                    // SIMULATE PRESS
                    } else {
                        this.runtime.objectsByUid[key].onKeyDown(info);
                    }
                    break;
                }
            }
        }
    }
	
    pluginProto.acts = new Acts();
	
    //////////////////////////////////////
    // Expressions
    function Exps() {};
	
    Exps.prototype.CapsLock = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
    {
        ret.set_int(this.capsLock);
    };
	
    pluginProto.exps = new Exps();

}());
