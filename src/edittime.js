function GetPluginSettings()
{
	return {
		"name":	        "IOSimulator",
		"id":           "IOSimulator",
		"version":      "0.002",
		"description":  "Simulate input from the mouse and keyboard.",
		"author":       "thatwhichis",
		"help url":     "http://www.hypnospace.net/",
		"category":     "Input",
		"type":         "object",
		"rotatable":    false,
		"flags":        pf_singleglobal
	};
};

////////////////////////////////////////
// Conditions

AddCondition(0, cf_none, "Is Caps Lock on", "Keyboard", "Is Caps Lock on", "Returns true if the Caps Lock is on.", "K_CL");

////////////////////////////////////////
// Actions

AddComboParamOption("Left");
AddComboParamOption("Middle");
AddComboParamOption("Right");
AddComboParam("Mouse button", "Select the mouse button to simulate.");
AddComboParamOption("Single");
AddComboParamOption("Double");
AddComboParam("Click type", "Select the click type to simulate.");
AddComboParamOption("Press");
AddComboParamOption("Release");
AddComboParam("Button action", "Select the button action to simulate.");
AddNumberParam("X", "Enter an X value at which to simulate a click.");
AddNumberParam("Y", "Enter a Y value at which to simulate a click.");
AddAction(0, af_none, "Simulate mouse click", "Mouse", "Simulate a <b>{0} {1} {2}</b> at <b>({3},{4})</b>", "Simulate a triggered mouse click action.", "M_Click");

AddNumberParam("X", "Enter an X value at which to simulate position.");
AddNumberParam("Y", "Enter a Y value at which to simulate position.");
AddAction(4, af_none, "Simulate mouse position", "Mouse", "Simulate mouse position at <b>({0},{1})</b>", "Simulate a mouse position.", "M_Move");

AddComboParamOption("Down");
AddComboParamOption("Up");
AddComboParam("Direction", "Select which direction to simulate the mouse wheel scrolling.");
AddAction(1, af_none, "Simulate mouse wheel", "Mouse", "Simulate a mouse wheel <b>{0}</b>", "Simulate a scrolled mouse wheel action.", "M_Wheel");

AddComboParamOption("Press");
AddComboParamOption("Release");
AddComboParam("Key action", "Select the key action to simulate.");
AddKeybParam("Key", "Choose a key to simulate. Note that international users and users on different operating systems or devices may not have the same keys available.");
AddAction(2, af_none, "Simulate key action", "Keyboard", "Simulate a keyboard <b>{1} {0}</b>", "Simulate a keyboard key action.", "K_Press");

AddComboParamOption("Press");
AddComboParamOption("Release");
AddComboParam("Key action", "Select the keycode action to simulate.");
AddNumberParam("Keycode", "Choose a numeric key code to simulate.");
AddAction(3, af_none, "Simulate keycode action", "Keyboard", "Simulate a keyboard code <b>{1} {0}</b>", "Simulate a keyboard code action.", "K_Press");

////////////////////////////////////////
// Expressions

AddExpression(0, ef_return_number, "", "Keyboard", "CapsLock", "Get Caps Lock engagement as 0 or 1.");

////////////////////////////////////////
ACESDone();

var property_list = [];

// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}
