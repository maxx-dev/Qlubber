/*
	----------------------------------------------------
	Event.js : 1.1.3 : 2013/07/17 : MIT License
	----------------------------------------------------
	https://github.com/mudcube/Event.js
	----------------------------------------------------
	1  : click, dblclick, dbltap
	1+ : tap, longpress, drag, swipe
	2+ : pinch, rotate
	   : mousewheel, devicemotion, shake
	----------------------------------------------------
	Ideas for the future
	----------------------------------------------------
	* GamePad, and other input abstractions.
	* Event batching - i.e. for every x fingers down a new gesture is created.
	----------------------------------------------------
	http://www.w3.org/TR/2011/WD-touch-events-20110505/
	----------------------------------------------------
	
*/

if (typeof(Event) === "undefined") var Event = {};
if (typeof(eventjs) === "undefined") var eventjs = Event;

(function(root) { "use strict";

// Add custom *EventListener commands to HTMLElements (set false to prevent funkiness).
root.modifyEventListener = true;

// Add bulk *EventListener commands on NodeLists from querySelectorAll and others  (set false to prevent funkiness).
root.modifySelectors = true;

// Event maintenance.
root.add = function(target, type, listener, configure) {
	return eventManager(target, type, listener, configure, "add");
};

root.remove = function(target, type, listener, configure) {
	return eventManager(target, type, listener, configure, "remove");
};

root.stop = function(event) {
	if (!event) return;
	if (event.stopPropagation) event.stopPropagation();
	event.cancelBubble = true; // <= IE8
	event.bubble = 0;
};

root.prevent = function(event) {
	if (!event) return;
	if (event.preventDefault) event.preventDefault();
	if (event.preventManipulation) event.preventManipulation(); // MS
	event.returnValue = false; // <= IE8
};

root.cancel = function(event) {
	root.stop(event);
	root.prevent(event);
};

// Check whether event is natively supported (via @kangax)
root.getEventSupport = function (target, type) {
	if (typeof(target) === "string") {
		type = target;
		target = window;
	}
	type = "on" + type;
	if (type in target) return true;
	if (!target.setAttribute) target = document.createElement("div");
	if (target.setAttribute && target.removeAttribute) {
		target.setAttribute(type, "");
		var isSupported = typeof target[type] === "function";
		if (typeof target[type] !== "undefined") target[type] = null;
		target.removeAttribute(type);
		return isSupported;
	}
};

var clone = function (obj) {
	if (!obj || typeof (obj) !== 'object') return obj;
	var temp = new obj.constructor();
	for (var key in obj) {
		if (!obj[key] || typeof (obj[key]) !== 'object') {
			temp[key] = obj[key];
		} else { // clone sub-object
			temp[key] = clone(obj[key]);
		}
	}
	return temp;
};

/// Handle custom *EventListener commands.
var eventManager = function(target, type, listener, configure, trigger, fromOverwrite) {
	configure = configure || {};
	// Check whether target is a configuration variable;
	if (String(target) === "[object Object]") {
		var data = target;
		target = data.target;
		type = data.type;
		listener = data.listener;
		delete data.target;
		delete data.type;
		delete data.listener;
		for (var key in data) {
			configure[key] = data[key];
		}
	}
	///
	if (!target || !type || !listener) return;
	// Check for element to load on interval (before onload).
	if (typeof(target) === "string" && type === "ready") {
		var time = (new Date()).getTime();
		var timeout = configure.timeout;
		var ms = configure.interval || 1000 / 60;
		var interval = window.setInterval(function() {
			if ((new Date()).getTime() - time > timeout) {
				window.clearInterval(interval);
			}
			if (document.querySelector(target)) {
				window.clearInterval(interval);
				setTimeout(listener, 1);
			}
		}, ms);
		return;
	}
	// Get DOM element from Query Selector.
	if (typeof(target) === "string") {
		target = document.querySelectorAll(target);
		if (target.length === 0) return createError("Missing target on listener!", arguments); // No results.
		if (target.length === 1) { // Single target.
			target = target[0];
		}
	}

	/// Handle multiple targets.
	var event;
	var events = {};
	if (target.length > 0 && target !== window) { 
		for (var n0 = 0, length0 = target.length; n0 < length0; n0 ++) {
			event = eventManager(target[n0], type, listener, clone(configure), trigger);
			if (event) events[n0] = event;
		}	
		return createBatchCommands(events);
	}
	// Check for multiple events in one string.
	if (type.indexOf && type.indexOf(" ") !== -1) type = type.split(" ");
	if (type.indexOf && type.indexOf(",") !== -1) type = type.split(",");
	// Attach or remove multiple events associated with a target.
	if (typeof(type) !== "string") { // Has multiple events.
		if (typeof(type.length) === "number") { // Handle multiple listeners glued together.
			for (var n1 = 0, length1 = type.length; n1 < length1; n1 ++) { // Array [type]
				event = eventManager(target, type[n1], listener, clone(configure), trigger);
				if (event) events[type[n1]] = event;
			}
		} else { // Handle multiple listeners.
			for (var key in type) { // Object {type}
				if (typeof(type[key]) === "function") { // without configuration.
					event = eventManager(target, key, type[key], clone(configure), trigger);
				} else { // with configuration.
					event = eventManager(target, key, type[key].listener, clone(type[key]), trigger);
				}
				if (event) events[key] = event;
			}
		}
		return createBatchCommands(events);
	}
	// Ensure listener is a function.
	if (typeof(target) !== "object") return createError("Target is not defined!", arguments);
	if (typeof(listener) !== "function") return createError("Listener is not a function!", arguments);
	// Generate a unique wrapper identifier.
	var useCapture = configure.useCapture || false;
	var id = getID(target) + "." + getID(listener) + "." + (useCapture ? 1 : 0);
	// Handle the event.
	if (root.Gesture && root.Gesture._gestureHandlers[type]) { // Fire custom event.
		id = type + id;
		if (trigger === "remove") { // Remove event listener.
			if (!wrappers[id]) return; // Already removed.
			wrappers[id].remove();
			delete wrappers[id];
		} else if (trigger === "add") { // Attach event listener.
			if (wrappers[id]) {
				wrappers[id].add();
				return wrappers[id]; // Already attached.
			}
			// Retains "this" orientation.
			if (configure.useCall && !root.modifyEventListener) {
				var tmp = listener;
				listener = function(event, self) {
					for (var key in self) event[key] = self[key];
					return tmp.call(target, event);
				};
			}
			// Create listener proxy.
			configure.gesture = type; 
			configure.target = target;
			configure.listener = listener;
			configure.fromOverwrite = fromOverwrite;
			// Record wrapper.
			wrappers[id] = root.proxy[type](configure); 
		}
		return wrappers[id];
	} else { // Fire native event.
		var eventList = getEventList(type);
		for (var n = 0, eventId; n < eventList.length; n ++) {
			type = eventList[n];
			eventId = type + "." + id;
			if (trigger === "remove") { // Remove event listener.
				if (!wrappers[eventId]) continue; // Already removed.
				target[remove](type, listener, useCapture); 
				delete wrappers[eventId];
			} else if (trigger === "add") { // Attach event listener.
				if (wrappers[eventId]) return wrappers[eventId]; // Already attached.
				target[add](type, listener, useCapture); 
				// Record wrapper.
				wrappers[eventId] = { 
					id: eventId,
					type: type,
					target: target,
					listener: listener,
					remove: function() {
						for (var n = 0; n < eventList.length; n ++) {
							root.remove(target, eventList[n], listener, configure);
						}
					}
				};
			}
		}
		return wrappers[eventId];
	}
};

/// Perform batch actions on multiple events.
var createBatchCommands = function(events) {
	return {
		remove: function() { // Remove multiple events.
			for (var key in events) {
				events[key].remove();
			}
		},
		add: function() { // Add multiple events.
			for (var key in events) {
				events[key].add();
			}
		}
	};
};

/// Display error message in console.
var createError = function(message, data) {
	if (typeof(console) === "undefined") return;
	if (typeof(console.error) === "undefined") return;
	console.error(message, data);
};

/// Handle naming discrepancies between platforms.
var pointerDefs = {
	"msPointer": [ "MSPointerDown", "MSPointerMove", "MSPointerUp" ],
	"touch": [ "touchstart", "touchmove", "touchend" ],
	"mouse": [ "mousedown", "mousemove", "mouseup" ]
};

var pointerDetect = {
	// MSPointer
	"MSPointerDown": 0, 
	"MSPointerMove": 1, 
	"MSPointerUp": 2,
	// Touch
	"touchstart": 0,
	"touchmove": 1,
	"touchend": 2,
	// Mouse
	"mousedown": 0,
	"mousemove": 1,
	"mouseup": 2
};

var getEventSupport = (function() {
	root.supports = {};
	if (window.navigator.msPointerEnabled) {
		root.supports.msPointer = true;
	}
	if (root.getEventSupport("touchstart")) {
		root.supports.touch = true;
	}
	if (root.getEventSupport("mousedown")) {
		root.supports.mouse = true;
	}
})();

var getEventList = (function() {
	return function(type) {
		var prefix = document.addEventListener ? "" : "on"; // IE
		var idx = pointerDetect[type];
		if (isFinite(idx)) {
			var types = [];
			for (var key in root.supports) {
				types.push(prefix + pointerDefs[key][idx]);
			}
			return types;
		} else {
			return [ prefix + type ];
		}
	};
})();

/// Event wrappers to keep track of all events placed in the window.
var wrappers = {};
var counter = 0;
var getID = function(object) {
	if (object === window) return "#window";
	if (object === document) return "#document";
	if (!object.uniqueID) object.uniqueID = "e" + counter ++;
	return object.uniqueID;
};

/// Detect platforms native *EventListener command.
var add = document.addEventListener ? "addEventListener" : "attachEvent";
var remove = document.removeEventListener ? "removeEventListener" : "detachEvent";

/*
	Pointer.js
	------------------------
	Modified from; https://github.com/borismus/pointer.js
*/

root.createPointerEvent = function (event, self, preventRecord) {
	var eventName = self.gesture;
	var target = self.target;
	var pts = event.changedTouches || root.proxy.getCoords(event);
	if (pts.length) {
		var pt = pts[0];
		self.pointers = preventRecord ? [] : pts;
		self.pageX = pt.pageX;
		self.pageY = pt.pageY;
		self.x = self.pageX;
		self.y = self.pageY;
	}
	///
	var newEvent = document.createEvent("Event");
	newEvent.initEvent(eventName, true, true);
	newEvent.originalEvent = event;
	for (var k in self) {
		if (k === "target") continue;
		newEvent[k] = self[k];
	}
	///
	var type = newEvent.type;
	if (root.Gesture && root.Gesture._gestureHandlers[type]) { // capture custom events.
//		target.dispatchEvent(newEvent);
		self.oldListener.call(target, newEvent, self, false);
	}
};

/// Allows *EventListener to use custom event proxies.
if (root.modifyEventListener && window.HTMLElement) (function() {
	var augmentEventListener = function(proto) {
		var recall = function(trigger) { // overwrite native *EventListener's
			var handle = trigger + "EventListener";
			var handler = proto[handle];
			proto[handle] = function (type, listener, useCapture) {
				if (root.Gesture && root.Gesture._gestureHandlers[type]) { // capture custom events.
					var configure = useCapture;
					if (typeof(useCapture) === "object") {
						configure.useCall = true;
					} else { // convert to configuration object.
						configure = {
							useCall: true,
							useCapture: useCapture
						};
					}
					eventManager(this, type, listener, configure, trigger, true);
//					handler.call(this, type, listener, useCapture);
				} else { // use native function.
					var types = getEventList(type);
					for (var n = 0; n < types.length; n ++) {
						handler.call(this, types[n], listener, useCapture);
					}
				}
			};
		};
		recall("add");
		recall("remove");
	};
	// NOTE: overwriting HTMLElement doesn't do anything in Firefox.
	if (navigator.userAgent.match(/Firefox/)) {
		// TODO: fix Firefox for the general case.
		augmentEventListener(HTMLDivElement.prototype);
		augmentEventListener(HTMLCanvasElement.prototype);
	} else {
		augmentEventListener(HTMLElement.prototype);
	}
	augmentEventListener(document);
	augmentEventListener(window);
})();

/// Allows querySelectorAll and other NodeLists to perform *EventListener commands in bulk.
if (root.modifySelectors) (function() {
	var proto = NodeList.prototype;
	proto.removeEventListener = function(type, listener, useCapture) {
		for (var n = 0, length = this.length; n < length; n ++) {
			this[n].removeEventListener(type, listener, useCapture);
		}
	};
	proto.addEventListener = function(type, listener, useCapture) {
		for (var n = 0, length = this.length; n < length; n ++) {
			this[n].addEventListener(type, listener, useCapture);
		}
	};
})();

return root;

})(Event);