var Xenophon = {
	version: "version 0.1",
	
	// TODOS: Private scoped functions should be rescoped

	// ====================================









	
	
	//=====================================
	//  Listener Management
	// ====================================
	paused: false,
	condensed: true,
	events: [],
	eventTypes: ['abort', 'afterprint', 'beforeprint', 'beforeunload', 'blur', 'canplay', 'canplaythrough', 'change', 'click', 'contextmenu', 'copy', 'cuechange', 'cut', 'dblclick', 'DOMContentLoaded', 'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop', 'durationchange', 'emptied', 'ended', 'error', 'focus', 'focusin', 'focusout', 'formchange', 'gotpointercapture','forminput', 'hashchange', 'hover', 'input', 'invalid', 'keydown', 'keypress', 'keyup', 'load', 'loadeddata', 'loadedmetadata', 'loadstart', 'lostpointercapture', 'message', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'mousewheel', 'offline', 'online', 'pagehide', 'pageshow', 'paste', 'pause', 'play', 'playing', 'pointercancel', 'pointerdown', 'pointerenter', 'pointerleave', 'pointermove', 'pointerout', 'pointerover', 'pointerup', 'popstate', 'progress', 'ratechange', 'readystatechange', 'redo', 'reset', 'resize', 'scroll', 'seeked', 'seeking', 'select', 'show', 'stalled', 'storage', 'submit', 'suspend', 'timeupdate', 'undo', 'unload', 'volumechange', 'waiting' ],
	
	register : function(elem, elementName){
		
		if(elementName == null){elementName = elem.getAttribute("name");}
		if(elementName == null){elementName = elem.getAttribute("id");}
		if(elementName == null){elementName = elem.tagName + elem.className;}
		
		if(this.gogoGadgetWindow == null){this.createNewGadgetWindow();}
		for(var i = 0; i < this.eventTypes.length; i++){
			this.appendListeners(elem, this.eventTypes[i], elementName);
		}
	},
  
	appendListeners : function(elem, eventType, elementName){
		elem.addEventListener(eventType, function(event){


			// if Xenophon is paused, it shouldn't be recording. Exit immediately
			if(Xenophon.paused){return;}
			
			// generate a record for the event
			var record = {
				targetElement: this,
				event : event,
				quantity : 1,
				xenophonNode : null
			}
			
			// check to see if an event like this one has already been registered.
			// get that record, if it exists
			var duplicate = Xenophon.getDuplicate(record);
			
			if(duplicate != null){
				duplicate.quantity++;
				//console.log('quantity: '+duplicate.quantity);
				updateItemGui(duplicate);
			}else{
				Xenophon.events.push(record);
				createNewItem(record);
			}
			
			return;
			
			function createNewItem(newRecord){
				if(Xenophon.headless){return;}
				
				// create GUI list item
				var divItem = document.createElement('div');
				divItem.className = 'XenophonOutputItem';
				gogoGadgetOutputBox.insertBefore(divItem, gogoGadgetOutputBox.firstChild);
				var eventIndex = Xenophon.events.length;
				newRecord.xenophonNode = divItem;
			
				// create GUI list item title
				var itemTitle = document.createElement('div');
				itemTitle.innerHTML = "<span>" + newRecord.event.type + "</span><span class='undecided'>" + newRecord.quantity + "</span>" ;
				divItem.appendChild(itemTitle);
				itemTitle.setAttribute('index', eventIndex);

			
				// add node for name
				var nameDiv = document.createElement('div');
				nameDiv.className = 'XenophonOutputItemName';
				nameDiv.innerHTML = elementName;
				divItem.appendChild(nameDiv);

				// assign event to gui Element Title
				itemTitle.addEventListener('click', function(){	
					var zombies = this.parentNode.querySelector("textarea");
					if(zombies == null){
						var innerTextarea = document.createElement('textarea')
						this.parentNode.appendChild(innerTextarea);
						innerTextarea.className="XenophonToolTipTextArea";
						var word = this.getAttribute("index");
						var num = parseInt(word);
						innerTextarea.value = objectToString(Xenophon.events[num].event);
						innerTextarea.spellcheck=false;
						//innerTextarea.readOnly=true;
					}else{
						this.parentNode.removeChild(zombies);
					}
				});
			}
			
			function updateItemGui(){
				if(Xenophon.headless){return;}
				duplicate.xenophonNode.querySelector('span.undecided').innerText = ""+duplicate.quantity;
			}
			
			
		});		
	},
	
	getDuplicate : function(record){
		var stored = null;
		
		// TODO: Should I switch this for a standard for-loop?
		Xenophon.events.forEach(function(recorded){
			if((recorded.targetElement == record.targetElement) && (recorded.event.type == record.event.type)){
				console.log('Match!');
				stored = recorded;
			}
		});
		return stored;
	},
	
	
	
	// ====================================









	
	
	//=====================================
	//  GUI
	// ====================================
	
	gogoGadgetWindow: null,
	gogoGadgetOutputBox: null,
	//gogoGadgetEventWindow: null,
	headless: false,
	
	createNewGadgetWindow : function(){
		//TODO: should I check to see if there's already a window? Kill the old window, or no-op?
		
		if(Xenophon.headless){return;}
		
		// setup body
		gogoGadgetWindow = document.createElement('div');
		gogoGadgetWindow.className='XenophonBody dockRight dockBottom';
		document.querySelector('body').appendChild(gogoGadgetWindow);

		
		// setup title
		var gogoGadgetTitle = document.createElement('div');
		gogoGadgetTitle.className = 'XenophonTitle';
		gogoGadgetTitle.innerHTML+="<span><img class='XenophonDockHorizontalBox' src='../../utils/images/dock_horiz.png' onclick='Xenophon.dockHorizontal()'></span>";
		gogoGadgetTitle.innerHTML+="<span><img class='XenophonDockVerticalBox' src='../../utils/images/dock_vert.png' onclick='Xenophon.dockVertical()'></span>";
		gogoGadgetTitle.innerHTML+="<span><img class='XenophonPauseBox' src='../../utils/images/close.png' onclick='Xenophon.hide()'></span>";
		gogoGadgetTitle.innerHTML+="<span><img class='XenophonCloseBox' src='../../utils/images/pause.png' onclick='Xenophon.pause();'></span>"
		gogoGadgetWindow.appendChild(gogoGadgetTitle);
		
		// setup scrollable area
		gogoGadgetOutputBox = document.createElement('div');
		gogoGadgetOutputBox.className='XenophonOutputBox';
		gogoGadgetWindow.appendChild(gogoGadgetOutputBox);
		
		//setup event window
		//gogoGadgetEventWindow = document.createElement('div');
		//gogoGadgetEventWindow.className='XenophonToolTip';
		//gogoGadgetWindow.appendChild(gogoGadgetEventWindow);
		//gogoGadgetEventWindow.innerHTML = "<textarea class='XenophonToolTipTextArea'></textarea>";
		
	},
	// ====================================









	
	
	//=====================================
	//  Docking, Hide, Show, Pause
	// ====================================
	
	dockHorizontal : function(){
		gogoGadgetWindow.classList.toggle('dockLeft');
		gogoGadgetWindow.classList.toggle('dockRight');
	},
	
	dockVertical : function(){
		gogoGadgetWindow.classList.toggle('dockTop');
		gogoGadgetWindow.classList.toggle('dockBottom');
	},
	
	hide : function(){
		gogoGadgetWindow.parentNode.removeChild(gogoGadgetWindow);
	},
	
	pause : function(){
		this.paused = !this.paused;
	}
	
	

	// ====================================
	

	
}


function objectToString (obj) {
	var str = '';
	
	for (var prop in obj) {
		//if (obj.hasOwnProperty(p)) {
			str += prop + '::' + obj[prop] + '\n';
		//}
	}
	return str;
}