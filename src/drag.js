var syn = require('./synthetic');
require('./drag.support');
/*
TODO: This is getting very complicated. We should probably separate the DRAG and MOVE abilities
	into two separate actions
TODO: It might also be worth giving html5drag and jQuery drag two different code paths,
	rather than constantly checking and switching behaviors accordingly mid function
TODO: Very few of our events actually fill the bubbles and cancelable fields. Any products that
	rely on these will not react properly. Is there a way to look up default behaviors for these and
	set to those unless somehow overridden?
*/

// Add high-level functions directly to syn

syn.helpers.extend(syn,{
	/**
	 * @function syn.move move()
	 * @parent mouse
	 * @signature `syn.move(from, options, callback)`
	 * Moves the cursor from one point to another.
	 *
	 * ### Quick Example
	 *
	 * The following moves the cursor from (0,0) in
	 * the window to (100,100) in 1 second.
	 *
	 *     syn.move(
	 *          document.document,
	 *          {
	 *            from: {clientX: 0, clientY: 0},
	 *            to: {clientX: 100, clientY: 100},
	 *            duration: 1000
	 *          })
	 *
	 * ## Options
	 *
	 * There are many ways to configure the endpoints of the move.
	 *
	 * ### PageX and PageY
	 *
	 * If you pass pageX or pageY, these will get converted
	 * to client coordinates.
	 *
	 *     syn.move(
	 *          document.document,
	 *          {
	 *            from: {pageX: 0, pageY: 0},
	 *            to: {pageX: 100, pageY: 100}
	 *          })
	 *
	 * ### String Coordinates
	 *
	 * You can set the pageX and pageY as strings like:
	 *
	 *     syn.move(
	 *          document.document,
	 *          {
	 *            from: "0x0",
	 *            to: "100x100"
	 *          })
	 *
	 * ### Element Coordinates
	 *
	 * If jQuery is present, you can pass an element as the from or to option
	 * and the coordinate will be set as the center of the element.

	 *     syn.move(
	 *          document.document,
	 *          {
	 *            from: $(".recipe")[0],
	 *            to: $("#trash")[0]
	 *          })
	 *
	 * ### Query Strings
	 *
	 * If jQuery is present, you can pass a query string as the from or to option.
	 *
	 * syn.move(
	 *      document.document,
	 *      {
	 *        from: ".recipe",
	 *        to: "#trash"
	 *      })
	 *
	 * ### No From
	 *
	 * If you don't provide a from, the element argument passed to syn is used.
	 *
	 *     syn.move(
	 *          'myrecipe',
	 *          { to: "#trash" })
	 *
	 * ### Relative
	 *
	 * You can move the drag relative to the center of the from element.
	 *
	 *     syn.move("myrecipe", "+20 +30");
	 *
	 * @param {HTMLElement} from the element to move
	 * @param {Object} options options to configure the drag
	 * @param {Function} callback a callback that happens after the drag motion has completed
	 */
	move: function (from, options) {

		var win = syn.helpers.getWindow(from);
		var sourceCoordinates = convertOption(options.from || from, win, from);
		var destinationCoordinates = convertOption(options.to || options, win, from);

		//DragonDrop.html5drag = syn.support.pointerEvents;

		if (options.adjust !== false) {
			adjust(sourceCoordinates, destinationCoordinates, win);
		}

		return pointerMoves({
			start: sourceCoordinates,
			end:destinationCoordinates,
			duration: options.duration || 500,
			startingState: elementFromPoint(sourceCoordinates, win),
			win,
			triggerPointerMove: triggerBasicPointerMove
		});
	},
	/**
	* @function syn.drag drag()
	* @parent mouse
	* @signature `syn.drag(from, options, callback)`
	* Creates a mousedown and drags from one point to another.
	* Check out [syn.prototype.move move] for API details.
	*
	* @param {HTMLElement} from
	* @param {Object} options
	* @param {Object} callback
	*/
	drag: function (from, options, callback) {

		var win = syn.helpers.getWindow(from);
		var sourceCoordinates = convertOption(options.from || from, win, from);
		var destinationCoordinates = convertOption(options.to || options, win, from);

		if (options.adjust !== false) {
			adjust(sourceCoordinates, destinationCoordinates, win);
		}

		if(from.draggable){
			return html5DragAndDrop(win, sourceCoordinates, destinationCoordinates, options.duration || 500);
		} else{
			return pointerDragAndDrop(win, sourceCoordinates, destinationCoordinates, options.duration || 500);
		}
	}
});

syn.helpers.extend(syn.events.types,{
	dragstart: {
		options: { bubbles:false, cancelable:false },
		create: createDragEvent
	},
	drag: {
		options: { bubbles:true, cancelable:true },
		create: createDragEvent
	},
	dragenter: {
		options: { bubbles:true, cancelable:true },
		create: createDragEvent
	},
	dragover: {
		options: { bubbles:true, cancelable:true },
		create: createDragEvent
	},
	dragleave: {
		options: { bubbles:true, cancelable:false },
		create: createDragEvent
	},
	drop: {
		options: { bubbles:true, cancelable:true, buttons:1 },
		create: createDragEvent
	},
	dragend: {
		options: { bubbles:true, cancelable:false },
		create: createDragEvent
	}
});



async function pointerDragAndDrop(win, fromPoint, toPoint, duration = 500) {
	if(syn.support.pointerEvents){
		createEventAtPoint("pointerover", fromPoint, win);
		createEventAtPoint("pointerenter", fromPoint, win);
	}
	createEventAtPoint("mouseover", fromPoint, win);
	createEventAtPoint("mouseenter", fromPoint, win);

	if(syn.support.pointerEvents){ createEventAtPoint("pointermove", fromPoint, win); }
	createEventAtPoint("mousemove", fromPoint, win);

	if(syn.support.pointerEvents){createEventAtPoint("pointerdown", fromPoint, win);}
	if(syn.support.touchEvents){createEventAtPoint("touchstart", fromPoint, win);}
	createEventAtPoint("mousedown", fromPoint, win);

	await pointerMoves({
		start: fromPoint,
		end: toPoint,
		duration,
		// record the element each go-round ..
		startingState: elementFromPoint(fromPoint, win),
		win,
		triggerPointerMove: triggerBasicPointerMove
	});

	if(syn.support.pointerEvents){
		createEventAtPoint("pointerup", toPoint, win);
	}
	if(syn.support.touchEvents){
		createEventAtPoint("touchend", toPoint, win);
	}
	createEventAtPoint("mouseup", toPoint, win);
	if(syn.support.pointerEvents){
		createEventAtPoint("pointerleave", toPoint, win);
	}
	createEventAtPoint("mouseleave", toPoint, win);
}

// Given a new point (and the last element we were on)
// Simulates what would happen moving the mouse to this new position.
function triggerBasicPointerMove(point, last, win){
	var el = elementFromPoint(point, win);

	if (last !== el && el && last) {
		console.log("STATE CHANGE!");
		var options = syn.helpers.extend({}, point);

		// QUESTION: Should we also be sending a pointerleave event?
		options.relatedTarget = el;
		if(syn.support.pointerEvents){
			syn.trigger(last, 'pointerout', options);
			syn.trigger(last, 'pointerleave', options);
		}
		syn.trigger(last, "mouseout", options);
		syn.trigger(last, "mouseleave", options);

		options.relatedTarget = last;
		if(syn.support.pointerEvents){
			syn.trigger(el, 'pointerover', options);
			syn.trigger(el, 'pointerenter', options);
		}
		syn.trigger(el, "mouseover", options);
		syn.trigger(el, "mouseenter", options);
	}

	if(syn.support.pointerEvents){syn.trigger(el || win, "pointermove", point);}
	if(syn.support.touchEvents){syn.trigger(el || win, "touchmove", point);}

	//console.log("DRAGGED: " + DragonDrop.html5drag);

	/*
		The following code needs some explanation. Firefox and Chrome DO NOT issue mousemove events during HTML5-dragdrops
		However, they do issue mousemoves during jQuery-dragdrops. I am making the assumption here (which may or may not
		be valid - let me know if it is wrong and I'll adjust,) that all PointerEvent-type browsers DO NOT issue
		mousemoves during HTML5-dragdrop, but DO issue during jQuery.
	*/
	//if(DragonDrop.html5drag){
	//	if(!syn.support.pointerEvents){ syn.trigger(el || win, "mousemove", point); }
	//}else{
	syn.trigger(el || win, "mousemove", point);
	//}

	return el;
}

let dragAndDropTransferObject =null;

async function html5DragAndDrop(focusWindow, fromPoint, toPoint, duration = 500){
	dragAndDropTransferObject = createDataTransferObject();
	// A series of events to simulate a drag operation
	createEventAtPoint("mouseover", fromPoint, focusWindow);
	createEventAtPoint("mouseenter", fromPoint, focusWindow);
	createEventAtPoint("mousemove", fromPoint, focusWindow);
	createEventAtPoint("mousedown", fromPoint, focusWindow);
	createEventAtPoint("dragstart", fromPoint, focusWindow);
	createEventAtPoint("drag", fromPoint, focusWindow);
	createEventAtPoint("dragenter", fromPoint, focusWindow);
	createEventAtPoint("dragover", fromPoint, focusWindow);

	await pointerMoves({
		start: fromPoint,
		end: toPoint,
		duration,
		startingState: fromPoint,
		win: focusWindow,
		triggerPointerMove: function(newPoint, previousPoint, win){
			var thisElement = elementFromPoint(newPoint, focusWindow);
			var previousElement = elementFromPoint(previousPoint, focusWindow);
			var options = syn.helpers.extend({}, newPoint);

			if (thisElement !== previousElement) {

				options.relatedTarget = thisElement;
				createEventAtPoint("dragleave", options, focusWindow);

				options.relatedTarget = previousElement;
				createEventAtPoint("dragenter", options, focusWindow);
			}
			createEventAtPoint("dragover", options, focusWindow);
			return newPoint;
		}
	});

	createEventAtPoint("dragleave", toPoint, focusWindow);
	createEventAtPoint("dragend", toPoint, focusWindow);
	createEventAtPoint("mouseout", toPoint, focusWindow);
	createEventAtPoint("mouseleave", toPoint, focusWindow);

	createEventAtPoint("drop", toPoint, focusWindow);
	createEventAtPoint("dragend", toPoint, focusWindow);
	createEventAtPoint("mouseover", toPoint, focusWindow);
	createEventAtPoint("mouseenter", toPoint, focusWindow);

	// these are the "user" moving the mouse away after the drop
	createEventAtPoint("mousemove", toPoint, focusWindow);
	createEventAtPoint("mouseout", toPoint, focusWindow);
	createEventAtPoint("mouseleave", toPoint, focusWindow);
}

// used to move an abstract pointer (triggerPointerMove actually does dispatching)
function pointerMoves({start, end, duration, startingState, win, triggerPointerMove}) {
	return new Promise( (resolve)=> {
		var startTime = new Date();
		var distX = end.clientX - start.clientX;
		var distY = end.clientY - start.clientY;

		var currentState = startingState;
		var cursor = win.document.createElement('div');
		var calls = 0;
		var move; // TODO: Does this actually do anything?

		move = function onmove() {
			//get what fraction we are at
			var now = new Date();
			var scrollOffset = syn.helpers.scrollOffset(win);
			var fraction = (calls === 0 ? 0 : now - startTime) / duration;
			var newPoint = {
				clientX: distX * fraction + start.clientX,
				clientY: distY * fraction + start.clientY
			};
			calls++;

			if (fraction < 1) {
				syn.helpers.extend(cursor.style, {
					left: (newPoint.clientX + scrollOffset.left + 2) + "px",
					top: (newPoint.clientY + scrollOffset.top + 2) + "px"
				});
				currentState = triggerPointerMove(newPoint, currentState, win);
				syn.helpers.schedule(onmove, 15); // TODO: What's with the 15 here? What does that even mean? Also: Should it be configurable?
			} else {
				triggerPointerMove(end, currentState, win);
				win.document.body.removeChild(cursor);
				resolve();
			}
		};
		syn.helpers.extend(cursor.style, {
			height: "5px",
			width: "5px",
			backgroundColor: "red",
			position: "absolute",
			zIndex: 19999,
			fontSize: "1px"
		});
		win.document.body.appendChild(cursor);
		move();

	});
}













//creates an event at a certain point. Note: Redundant to DragonDrop.createAndDispatchEvent
// TODO: Consolidate this with DragonDrop.createAndDispatchEvent !!!
function createEventAtPoint(event, point, win) {
	var el = elementFromPoint(point, win);
	syn.trigger(el || win, event, point);
	return el;
}
function center(el) {
	return syn.helpers.addOffset({}, el);
}
function convertOption(option, win, from) {
	var page = /(\d+)[x ](\d+)/,
		client = /(\d+)X(\d+)/,
		relative = /([+-]\d+)[xX ]([+-]\d+)/,
		parts;
	//check relative "+22x-44"
	if (typeof option === 'string' && relative.test(option) && from) {
		var cent = center(from);
		parts = option.match(relative);
		option = {
			pageX: cent.pageX + parseInt(parts[1]),
			pageY: cent.pageY + parseInt(parts[2])
		};
	}
	if (typeof option === "string" && page.test(option)) {
		parts = option.match(page);
		option = {
			pageX: parseInt(parts[1]),
			pageY: parseInt(parts[2])
		};
	}
	if (typeof option === 'string' && client.test(option)) {
		parts = option.match(client);
		option = {
			clientX: parseInt(parts[1]),
			clientY: parseInt(parts[2])
		};
	}
	if (typeof option === 'string') {
		option = win.document.querySelector( option );
	}
	if (option.nodeName) {
		option = center(option);
	}
	if (option.pageX != null) {
		var off = syn.helpers.scrollOffset(win);
		option = {
			clientX: option.pageX - off.left,
			clientY: option.pageY - off.top
		};
	}
	return option;
}



// if the client chords are not going to be visible ... scroll the page so they will be ...
function adjust(from, to, win) {
	if (from.clientY < 0) {
		var off = syn.helpers.scrollOffset(win);
		var top = off.top + (from.clientY) - 100,
			diff = top - off.top;

		// first, lets see if we can scroll 100 px
		if (top > 0) {

		} else {
			top = 0;
			diff = -off.top;
		}
		from.clientY = from.clientY - diff;
		to.clientY = to.clientY - diff;
		syn.helpers.scrollOffset(win, {
			top: top,
			left: off.left
		});
	}
};


function createDragEvent(eventName, options, element){
	var dragEvent = syn.events.kinds.mouse.create(eventName, options, element);

	// TODO: find a nicer way of doing this.
	dragEvent.dataTransfer = dragAndDropTransferObject;
	return syn.dispatch(dragEvent, element, eventName, false);
}

// returns the element that exists at a provided x, y coordinate
// TODO: move this to element.js
function elementFromPoint(point, win) {
	var clientX = point.clientX;
	var clientY = point.clientY;

	if(point == null){return null;}

	if (syn.support.elementFromPage) {
		var off = syn.helpers.scrollOffset(win);
		clientX = clientX + off.left; //convert to pageX
		clientY = clientY + off.top; //convert to pageY
	}

	return win.document.elementFromPoint(Math.round(clientX), Math.round(clientY));
}

/**
* This function defines the dataTransfer Object, which otherwise is immutable. d= DataTrnsfer() is not a valid constructor
* @param node
*/
function createDataTransferObject(){
	var dataTransfer = {
		dropEffect : "none",
		effectAllowed : "uninitialized",
		files: [],
		items:[],
		types:[],
		data:[],

		// setData function assigns the dragValue to an object's property
		setData: function(dataFlavor, value){
			var tempdata = {};
			tempdata.dataFlavor = dataFlavor;
			tempdata.val = value;
			this.data.push(tempdata);
		},

		// getData fetches the dragValue based on the input dataFlavor provided.
		getData: function(dataFlavor){
			for (var i = 0; i < this.data.length; i++){
				var tempdata = this.data[i];
				if (tempdata.dataFlavor === dataFlavor){
					return tempdata.val;
				}
			}
		}
	};
	return dataTransfer;
}
