
//allow for configuration of syn
var opts = window.syn ? window.syn : {};

var data = {},
	id = 1,
	expando = "_synthetic" + new Date()
		.getTime(),
	bind, unbind, schedule, schedulePromise,


	//this is maintained so we can click on html and blur the active element
	activeElement;


var syn = {
	// ## User actions
	// These are the methods that cause multiple actual events to happen.
	// Click here is for the user-action, not the actual event.

	// ## Event dispatching methods

	/**
	 * Trigger will attempt to create and dispatch a SINGLE event on an element.
	 * It will also run any registered default actions.
	 *
	 * It looks in syn.events for event configuration. The configuration can
	 * either exist on the specific event or the event "kind" (key, page, or mouse).
	 *
	 * Creates a synthetic event and dispatches it on the element.
	 * This will run any default actions for the element.
	 * Typically you want to use syn, but if you want the return value, use this.
	 */
	trigger: function (element, type, options) {
		if (!options) {
			options = {};
		}
		var eventKinds = syn.events.kinds,
			eventTypes = syn.events.types,
			kind = eventKinds.key.events[type] ? 'key' : (eventKinds.page.events[type] ? 'page' : 'mouse'),
			eventType = eventTypes[type],
			setup = eventType && eventType.setup,
			eventKind = eventKinds[kind];

		var event, ret, autoPrevent, dispatchEl = element;

		//any setup code?
		if (syn.support.ready === 2 && setup) {
			setup(type, options, element);
		}

		autoPrevent = options._autoPrevent;
		//get kind
		delete options._autoPrevent;

		if ( eventType && eventType.create ) {
			ret = eventType && eventType.create(type, options, element);
		} else {
			//convert options
			if(typeof eventKind.options === "function") {
				options = eventKind.options(type, options, element);
			} else if(eventKind.options) {
				options = syn.helpers.extend(eventKind.options);
			}

			if (!syn.support.changeBubbles && /option/i.test(element.nodeName)) {
				dispatchEl = element.parentNode; //jQuery expects clicks on select
			}

			//create the event
			event = eventKind.create(type, options, dispatchEl);

			//send the event
			ret = syn.dispatch(event, dispatchEl, type, autoPrevent);
		}

		if (ret && syn.support.ready === 2 && eventType && eventType.default) {
			eventType.default.call(element, options, autoPrevent);
		}
		return ret;
	},

	// Triggers an event on an element, returns true if default events should be run
	dispatch: function (event, element, type, autoPrevent) {
		// dispatchEvent doesn't always work in IE (mostly in a popup)
		if (element.dispatchEvent && event) {
			var preventDefault = event.preventDefault,
				prevents = autoPrevent ? -1 : 0;

			//automatically prevents the default behavior for this event
			//this is to protect agianst nasty browser freezing bug in safari
			if (autoPrevent) {
				syn.helpers.bind(element, type, function ontype(ev) {
					ev.preventDefault();
					syn.helpers.unbind(this, type, ontype);
				});
			}

			event.preventDefault = function () {
				prevents++;
				if (++prevents > 0) {
					preventDefault.apply(this, []);
				}
			};
			element.dispatchEvent(event);
			return prevents <= 0;
		} else {
			try {
				window.event = event;
			} catch (e) {}
			//source element makes sure element is still in the document
			return element.sourceIndex <= 0 || (element.fireEvent && element.fireEvent('on' + type, event));
		}
	},
	args: function () {
		var res = {},
			i = 0;
		for (; i < arguments.length; i++) {
			if (typeof arguments[i] === 'function') {
				res.callback = arguments[i];
			} else if (arguments[i] && arguments[i].jquery) {
				res.element = arguments[i][0];
			} else if (arguments[i] && arguments[i].nodeName) {
				res.element = arguments[i];
			} else if (res.options && typeof arguments[i] === 'string') { //we can get by id
				res.element = document.getElementById(arguments[i]);
			} else if (arguments[i]) {
				res.options = arguments[i];
			}
		}
		return res;
	},

	// ## Configuration based information.

	//Store if these keys are being held down
	keysBeingHeldDown: {
		ctrlKey: null,
		altKey: null,
		shiftKey: null,
		metaKey: null
	},
	// a placeholder for key behavior to be added
	key: {},
	mouse: {},


	// The following properties are used to make sure the right behavior happens.

	// how to create specific events if the default way isn't good enough.

	// {[type]: {create,default}}

	/**
	 * Default actions for events.  Each default function is called with this as its
	 * element.  It should return true if a timeout
	 * should happen after it.  If it returns an element, a timeout will happen
	 * and the next event will happen on that element.
	 */
	events: {
		kinds: {
			page: {
				events: toMap("load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll"),
				create: function (type, options, element) {
					var doc = syn.helpers.getWindow(element)
						.document || document,
						event;
					if (doc.createEvent) {
						event = doc.createEvent("Events");

						event.initEvent(type, true, true);
						return event;
					} else {
						try {
							event = syn.helpers.createEventObject(type, options, element);
						} catch (e) {}
						return event;
					}
				}
			},
			key: {
				events: toMap("keypress|keyup|keydown")
			}
		},
		types: {
			focus: {
				create: function (type, options, element) {
					syn.helpers.onParents(element, function (el) {
						if (syn.helpers.isFocusable(el)) {
							if (el.nodeName.toLowerCase() !== 'html') {
								syn.helpers.tryFocus(el);
								activeElement = el;
							} else if (activeElement) {
								// TODO: The HTML element isn't focasable in IE, but it is
								// in FF.  We should detect this and do a true focus instead
								// of just a blur
								var doc = syn.helpers.getWindow(element)
									.document;
								if (doc !== window.document) {
									return false;
								} else if (doc.activeElement) {
									doc.activeElement.blur();
									activeElement = null;
								} else {
									activeElement.blur();
									activeElement = null;
								}

							}
							return false;
						}
					});
					return true;
				},
				default: function focus() {
					if (!syn.support.focusChanges) {
						var element = this,
							nodeName = element.nodeName.toLowerCase();
						syn.helpers.data(element, "syntheticvalue", element.value);

						//TODO, this should be textarea too
						//and this might be for only text style inputs ... hmmmmm ....
						if (nodeName === "input" || nodeName === "textarea") {
							syn.helpers.bind(element, "blur", function blur() {
								if (syn.helpers.data(element, "syntheticvalue") !== element.value) {

									syn.trigger(element, "change", {});
								}
								syn.helpers.unbind(element, "blur", blur);
							});

						}
					}
				}
			},
			submit: {
				default: function () {
					syn.helpers.onParents(this, function (el) {
						if (el.nodeName.toLowerCase() === 'form') {
							el.submit();
							return false;
						}
					});
				}
			}
		}
	},



	// only uses browser detection for dispatching proper events
	browser: {
		msie: (!!(window.attachEvent && !window.opera) || (navigator.userAgent.indexOf('Trident/') > -1)),
		opera: !! window.opera,
		webkit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
		safari: navigator.userAgent.indexOf('AppleWebKit/') > -1 && navigator.userAgent.indexOf('Chrome/') === -1,
		gecko: navigator.userAgent.indexOf('Gecko') > -1,
		mobilesafari: !! navigator.userAgent.match(/Apple.*Mobile.*Safari/),
		rhino: navigator.userAgent.match(/Rhino/) && true,
		chrome: !!window.chrome && !!window.chrome.webstore
	},
	/**
	 * Feature detected properties of a browser's event system.
	 * Support has the following properties:
	 *
	 *   - `backspaceWorks` - typing a backspace removes a character
	 *   - `clickChanges` - clicking on an option element creates a change event.
	 *   - `clickSubmits` - clicking on a form button submits the form.
	 *   - `focusChanges` - focus/blur creates a change event.
	 *   - `keypressOnAnchorClicks` - Keying enter on an anchor triggers a click.
	 *   - `keypressSubmits` - enter key submits
	 *   - `keyCharacters` - typing a character shows up
	 *   - `keysOnNotFocused` - enters keys when not focused.
	 *   - `linkHrefJS` - An achor's href JavaScript is run.
	 *   - `mouseDownUpClicks` - A mousedown followed by mouseup creates a click event.
	 *   - `mouseupSubmits` - a mouseup on a form button submits the form.
	 *	 - `pointerEvents` - does this browser natively support pointer events (for newer browsers).
	 *   - `radioClickChanges` - clicking a radio button changes the radio.
	 *   - `tabKeyTabs` - A tab key changes tabs.
	 *   - `textareaCarriage` - a new line in a textarea creates a carriage return.
	 *	 - `touchEvents` - does this browser natively support touch events (for older mobile browsers, mostly).
	 *
	 */
	support: {
		clickChanges: false,
		clickSubmits: false,
		keypressSubmits: false,
		mouseupSubmits: false,
		radioClickChanges: false,
		focusChanges: false,
		linkHrefJS: false,
		keyCharacters: false,
		backspaceWorks: false,
		mouseDownUpClicks: false,
		tabKeyTabs: false,
		keypressOnAnchorClicks: false,
		optionClickBubbles: false,
		pointerEvents: false,
		touchEvents: false,
		ready: 0
	},

	// these helpers shouldn't be used directly
	helpers: {
		toMap: toMap,
		extend: function (d, s) {
			var p;
			for (p in s) {
				d[p] = s[p];
			}
			return d;
		},
		createEventObject: function (type, options, element) {
			var event = element.ownerDocument.createEventObject();
			return extend(event, options);
		},
		createBasicStandardEvent: function (type, defaults, doc) {
			var event;
			try {
				event = doc.createEvent("Events");
			} catch (e2) {
				event = doc.createEvent("UIEvents");
			} finally {
				event.initEvent(type, true, true);
				extend(event, defaults);
			}
			return event;
		},
		inArray: function (item, array) {
			var i = 0;
			for (; i < array.length; i++) {
				if (array[i] === item) {
					return i;
				}
			}
			return -1;
		},
		getWindow: function (element) {
			if(!element) {debugger;}
			if (element.ownerDocument) {
				return element.ownerDocument.defaultView || element.ownerDocument.parentWindow;
			}
		},
		scrollOffset: function (win, set) {
			var doc = win.document.documentElement,
				body = win.document.body;
			if (set) {
				window.scrollTo(set.left, set.top);

			} else {
				return {
					left: (doc && doc.scrollLeft || body && body.scrollLeft || 0) + (doc.clientLeft || 0),
					top: (doc && doc.scrollTop || body && body.scrollTop || 0) + (doc.clientTop || 0)
				};
			}

		},
		scrollDimensions: function (win) {
			var doc = win.document.documentElement,
				body = win.document.body,
				docWidth = doc.clientWidth,
				docHeight = doc.clientHeight,
				compat = win.document.compatMode === "CSS1Compat";

			return {
				height: compat && docHeight ||
					body.clientHeight || docHeight,
				width: compat && docWidth ||
					body.clientWidth || docWidth
			};
		},
		addOffset: function (options, el) {
			var rect;
			if (typeof options === 'object' && options.clientX === undefined && options.clientY === undefined && options.pageX === undefined && options.pageY === undefined) {
				rect = el.getBoundingClientRect();
				options.pageX = syn.helpers.getWindow(el).scrollX + rect.left + rect.width / 2;
				options.pageY = syn.helpers.getWindow(el).scrollY + rect.top + rect.height / 2;
			}
			return options;
		},
		tryFocus: function tryFocus(element) {
			try {
				element.focus();
			} catch (e) {}
		},

		bind: function (el, ev, f) {
			return el.addEventListener ? el.addEventListener(ev, f, false) : el.attachEvent("on" + ev, f);
		},
		unbind: function (el, ev, f) {
			return el.addEventListener ? el.removeEventListener(ev, f, false) : el.detachEvent("on" + ev, f);
		},

		schedule: function (fn, ms) {
			setTimeout(fn, ms);
		},
		schedulePromise: function(time) {
			return new Promise(function(resolve){
				setTimeout(resolve, time)
			});
		},
		// Fire a change event if the element is blured and there's a new value
		changeOnBlur: function (element, prop, value) {
			syn.helpers.bind(element, "blur", function onblur() {
				if (value !== element[prop]) {
					syn.trigger(element, "change", {});
				}
				syn.helpers.unbind(element, "blur", onblur);
			});

		},
		// Returns the closest element of a particular type.
		closest: function (el, type) {
			while (el && el.nodeName.toLowerCase() !== type.toLowerCase()) {
				el = el.parentNode;
			}
			return el;
		},
		// adds jQuery like data (adds an expando) and data exists FOREVER :)
		// This could start using weakmap
		data: function (el, key, value) {
			var d;
			if (!el[expando]) {
				el[expando] = id++;
			}
			if (!data[el[expando]]) {
				data[el[expando]] = {};
			}
			d = data[el[expando]];
			if (value) {
				data[el[expando]][key] = value;
			} else {
				return data[el[expando]][key];
			}
		},
		/**
		 * Calls a function on the element and all parents of the element until the function returns
		 * false.
		 */
		onParents: function (el, func) {
			var res;
			while (el && res !== false) {
				res = func(el);
				el = el.parentNode;
			}
			return el;
		},
		/**
		 * Returns if an element is focusable
		 */
		isFocusable: function (elem) {
			var attributeNode;

			// IE8 Standards doesn't like this on some elements
			if (elem.getAttributeNode) {
				attributeNode = elem.getAttributeNode("tabIndex");
			}

			return syn.helpers.focusable.test(elem.nodeName) ||
				(attributeNode && attributeNode.specified) &&
				syn.helpers.isVisible(elem);
		},
		//regex to match focusable elements
		focusable: /^(a|area|frame|iframe|label|input|select|textarea|button|html|object)$/i,
		/**
		 * Returns if an element is visible or not
		 */
		isVisible: function (elem) {
			return (elem.offsetWidth && elem.offsetHeight) || (elem.clientWidth && elem.clientHeight);
		},
		/**
		 * Gets the tabIndex as a number or null
		 */
		tabIndex: function (elem) {
			var attributeNode = elem.getAttributeNode("tabIndex");
			return attributeNode && attributeNode.specified && (parseInt(elem.getAttribute('tabIndex')) || 0);
		},
		eventSupported: function (eventName) {
			var el = document.createElement("div");
			eventName = "on" + eventName;

			var isSupported = (eventName in el);
			if (!isSupported) {
				el.setAttribute(eventName, "return;");
				isSupported = typeof el[eventName] === "function";
			}
			el = null;

			return isSupported;
		}
	}
}

syn.config = opts;

function toMap(str){
	var map = {};
	str.split("|").forEach( ch => { map[ch] = true; });
	return map;
}



// helper for supporting IE8 and below:
// focus will throw in some circumnstances, like element being invisible




module.exports = syn;
