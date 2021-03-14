var syn = require('./synthetic');

// Add high-level functions directly to syn
syn.helpers.extend(syn, {
	click: function (element, options, force) {
		var args = syn.args(options,element);

		return new Promise((resolve) => {
			var element = args.element;
			syn.helpers.addOffset(options, element);
			if(syn.support.pointerEvents){
				syn.trigger(element, 'pointerdown', options);
			}
			if(syn.support.touchEvents){
				syn.trigger(element, 'touchstart', options);
			}

			syn.trigger(element, "mousedown", options);

			//timeout is b/c IE is stupid and won't call focus handlers
			syn.helpers.schedule(function () {
				if(syn.support.pointerEvents){
					syn.trigger(element, 'pointerup', options);
				}
				if(syn.support.touchEvents){
					syn.trigger(element, 'touchend', options);
				}

				syn.trigger(element, "mouseup", options);
				if (!syn.support.mouseDownUpClicks || force) {
					syn.trigger(element, "click", options);
					resolve(true);
				} else {
					//we still have to run the default (presumably)
					syn.create.click.setup('click', options, element);
					syn.defaults.click.call(element);
					//must give time for callback
					syn.helpers.schedule(function () {
						resolve(true);
					}, 1);
				}

			}, 1);
		})
	},
	rightClick: function (element, options) {
		var args = syn.args(options,element);
		return new Promise((resolve)=>{
			var element = args.element;
			syn.helpers.addOffset(options, element);
			var mouseopts = syn.helpers.extend(syn.helpers.extend({}, syn.mouse.browser.right.mouseup), options);
			if(syn.support.pointerEvents){
				syn.trigger(element, 'pointerdown', mouseopts);
			}

			syn.trigger(element, "mousedown", mouseopts);

			//timeout is b/c IE is stupid and won't call focus handlers
			syn.helpers.schedule(function () {
				if(syn.support.pointerEvents){
					syn.trigger(element, 'pointerup', mouseopts);
				}
				syn.trigger(element, "mouseup", mouseopts);
				if (syn.mouse.browser.right.contextmenu) {
					syn.trigger(element, "contextmenu",
						syn.helpers.extend(
							syn.helpers.extend({}, syn.mouse.browser.right.contextmenu), options )
					);
				}
				resolve();
			}, 1);
		})

	},
	dblclick: async function (element, options) {
		var args = syn.args(options,element);
		syn.helpers.addOffset(options, args.element);
		var self = this;
		await this.click(args.element, options);
		await syn.helpers.schedulePromise(2);
		await this.click(args.element, options);
		syn.trigger(args.element, "dblclick", options);
		return true;
	}
})

// Add the mouse kind of events
syn.helpers.extend(syn.events.kinds, {
	mouse: {
		options: function (type, options, element) {
			var doc = document.documentElement,
				body = document.body,
				center = [options.pageX || 0, options.pageY || 0],
				//browser might not be loaded yet (doing support code)
				left = syn.mouse.browser && syn.mouse.browser.left[type],
				right = syn.mouse.browser && syn.mouse.browser.right[type];
			return syn.helpers.extend({
				bubbles: true,
				cancelable: true,
				view: window,
				detail: 1,
				screenX: 1,
				screenY: 1,
				clientX: options.clientX || center[0] - (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0),
				clientY: options.clientY || center[1] - (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0),
				ctrlKey: !! syn.keysBeingHeldDown.ctrlKey,
				altKey: !! syn.keysBeingHeldDown.altKey,
				shiftKey: !! syn.keysBeingHeldDown.shiftKey,
				metaKey: !! syn.keysBeingHeldDown.metaKey,
				button: left && left.button !== null ? left.button : right && right.button || (type === 'contextmenu' ? 2 : 0),
				relatedTarget: document.documentElement
			}, options);
		},
		create: function (type, defaults, element) { //Everyone Else
			var doc = syn.helpers.getWindow(element)
				.document || document,
				event;
			if (doc.createEvent) {
				try {
					defaults.view = doc.defaultView;

					/* TODO: Eventually replace doc.createEvent / initMouseEvent down below (its deprecated )
						https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/initMouseEvent

						Replace it with this:
						event = new MouseEvent(type, defaults);
					*/

					event = doc.createEvent('MouseEvents');
					event.initMouseEvent(type, defaults.bubbles, defaults.cancelable,
						defaults.view, defaults.detail,
						defaults.screenX, defaults.screenY,
						defaults.clientX, defaults.clientY,
						defaults.ctrlKey, defaults.altKey,
						defaults.shiftKey, defaults.metaKey,
						defaults.button, defaults.relatedTarget);
				} catch (e) {
					event = syn.helpers.createBasicStandardEvent(type, defaults, doc);
				}
				event.synthetic = true;
				return event;
			} else {
				try {
					event = syn.helpers.createEventObject(type, defaults, element);
				} catch (e) {}

				return event;
			}

		}
	}
});

// add type specific overwrites
syn.helpers.extend(syn.events.types, {
	mousedown: {
		setup: function (type, options, element) {
			var nn = element.nodeName.toLowerCase();
			//we have to auto prevent default to prevent freezing error in safari
			if (syn.browser.safari && (nn === "select" || nn === "option")) {
				options._autoPrevent = true;
			}
		},
		default: function (options) {
			syn.trigger(this, "focus", {});
		}
	},
	click: {
		setup: function (type, options, element) {
			var nodeName = element.nodeName.toLowerCase();

			//we need to manually 'check' in browser that can't check
			//so checked has the right value
			if (!syn.support.clickChecks && !syn.support.changeChecks && nodeName === "input") {
				type = element.type.toLowerCase(); //pretty sure lowercase isn't needed
				if (type === 'checkbox') {
					element.checked = !element.checked;
				}
				if (type === "radio") {
					//do the checks manually
					if (!element.checked) { //do nothing, no change
						try {
							syn.helpers.data(element, "radioChanged", true);
						} catch (e) {}
						element.checked = true;
					}
				}
			}

			if (nodeName === "a" && element.href && !/^\s*javascript:/.test(element.href)) {

				//save href
				syn.helpers.data(element, "href", element.href);

				//remove b/c safari/opera will open a new tab instead of changing the page
				// this has been removed because newer versions don't have this problem
				//element.setAttribute('href', 'javascript://')
				//however this breaks scripts using the href
				//we need to listen to this and prevent the default behavior
				//and run the default behavior ourselves. Boo!
			}
			//if select or option, save old value and mark to change
			if (/option/i.test(element.nodeName)) {
				var child = element.parentNode.firstChild,
					i = -1;
				while (child) {
					if (child.nodeType === 1) {
						i++;
						if (child === element) {
							break;
						}
					}
					child = child.nextSibling;
				}
				if (i !== element.parentNode.selectedIndex) {
					//shouldn't this wait on triggering
					//change?
					element.parentNode.selectedIndex = i;
					syn.helpers.data(element, "createChange", true);
				}
			}

		},
		default: function () {
			// prevents the access denied issue in IE if the click causes the element to be destroyed
			var element = this,
				href, type, createChange, radioChanged, nodeName, scope;
			try {
				href = element.href;
				type = element.type;
				createChange = syn.helpers.data(element, "createChange");
				radioChanged = syn.helpers.data(element, "radioChanged");
				scope = syn.helpers.getWindow(element);
				nodeName = element.nodeName.toLowerCase();
			} catch (e) {
				return;
			}
			//get old values

			//this code was for restoring the href attribute to prevent popup opening
			//if ((href = syn.helpers.data(element, "href"))) {
			//	element.setAttribute('href', href)
			//}

			//run href javascript
			if (!syn.support.linkHrefJS && /^\s*javascript:/.test(href)) {
				//eval js
				var code = href.replace(/^\s*javascript:/, "");

				//try{
				if (code !== "//" && code.indexOf("void(0)") === -1) {
					if (window.selenium) {
						eval("with(selenium.browserbot.getCurrentWindow()){" + code + "}");
					} else {
						eval("with(scope){" + code + "}");
					}
				}
			}

			//submit a form
			if (!(syn.support.clickSubmits) && ((nodeName === "input" ||
				nodeName === "button") &&
					type === "submit")) {

				var form = syn.helpers.closest(element, "form");
				if (form) {
					syn.trigger(form, "submit", {});
				}

			}
			//follow a link, probably needs to check if in an a.
			if (nodeName === "a" && element.href && !/^\s*javascript:/.test(href)) {
				scope.location.href = href;

			}

			//change a checkbox
			if (nodeName === "input" && type === "checkbox") {

				//if(!syn.support.clickChecks && !syn.support.changeChecks){
				//	element.checked = !element.checked;
				//}
				if (!syn.support.clickChanges) {
					syn.trigger(element, "change", {});
				}
			}

			//change a radio button
			if (nodeName === "input" && type === "radio") { // need to uncheck others if not checked
				if (radioChanged && !syn.support.radioClickChanges) {
					syn.trigger(element, "change", {});
				}
			}
			// change options
			if (nodeName === "option" && createChange) {
				syn.trigger(element.parentNode, "change", {}); //does not bubble
				syn.helpers.data(element, "createChange", false);
			}
		}
	}
});
