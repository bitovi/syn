var InspectorGadget = {
	version: "version 0.1",
	

	// ====================================









	
	
	//=====================================
	//  Listener Management
	// ====================================
	paused: false,
	events: [],
	eventTypes: ['blur', 'change', 'click', 'dblclick', 'error', 'focus', 'focusin', 'focusout', 'hover', 'keydown', 'keypress', 'keyup', 'load', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'select', 'submit'],
	
	// TODO: More complete list
	// abort afterprint beforeprint beforeunload blur canplay canplaythrough change click contextmenu copy cuechange cut dblclick DOMContentLoaded drag dragend dragenter dragleave dragover dragstart drop durationchange emptied ended error focus focusin focusout formchange forminput hashchange input invalid keydown keypress keyup load loadeddata loadedmetadata loadstart message mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup mousewheel offline online pagehide pageshow paste pause play playing popstate progress ratechange readystatechange redo reset resize scroll seeked seeking select show stalled storage submit suspend timeupdate undo unload volumechange waiting 
		
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
			if(InspectorGadget.paused){return;}
			
			// save event text
			var eventtext = objectToString(event);
			InspectorGadget.events.push(eventtext);
			
			// create GUI list item
			if(InspectorGadget.headless){return;}
			var divItem = document.createElement('div');
			divItem.className = 'InspectorGadgetOutputItem';
			gogoGadgetOutputBox.insertBefore(divItem, gogoGadgetOutputBox.firstChild);
			var eventIndex = InspectorGadget.events.length;
			//divItem.index = eventIndex;
			
			// create GUI list item title
			var itemTitle = document.createElement('div');
			itemTitle.innerHTML = event.type ;
			divItem.appendChild(itemTitle);
			//itemTitle.index = eventIndex;
			itemTitle.setAttribute('index', eventIndex);

			
			// add bit for name
			var nameDiv = document.createElement('div');
			nameDiv.className = 'InspectorGadgetOutputItemName';
			nameDiv.innerHTML = elementName;
			divItem.appendChild(nameDiv);

			// assign event to gui Element Title
			itemTitle.addEventListener('click', function(eventtext){	
				var zombies = this.parentNode.querySelector("textarea");
				if(zombies == null){
					var innerTextarea = document.createElement('textarea')
					this.parentNode.appendChild(innerTextarea);
					innerTextarea.className="InspectorGadgetToolTipTextArea";
					console.log(this.getAttribute("index"));
					var word = this.getAttribute("index");
					var num = parseInt(word);
					console.log(num);
					innerTextarea.value = InspectorGadget.events[num];//objectToString(eventtext);
					innerTextarea.spellcheck=false;
					//innerTextarea.readOnly=true;
				}else{
					this.parentNode.removeChild(zombies);
				}
			});
		});		
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
		
		if(InspectorGadget.headless){return;}
		
		// setup body
		gogoGadgetWindow = document.createElement('div');
		gogoGadgetWindow.className='InspectorGadgetBody dockRight dockBottom';
		document.querySelector('body').appendChild(gogoGadgetWindow);

		
		// setup title
		var gogoGadgetTitle = document.createElement('div');
		gogoGadgetTitle.className = 'InspectorGadgetTitle';
		gogoGadgetTitle.innerHTML+="<span><img class='InspectorGadgetDockHorizontalBox' src='./images/dock_horiz.png' onclick='InspectorGadget.dockHorizontal()'></span>";
		gogoGadgetTitle.innerHTML+="<span><img class='InspectorGadgetDockVerticalBox' src='./images/dock_vert.png' onclick='InspectorGadget.dockVertical()'></span>";
		//gogoGadgetTitle.innerHTML+="<span width='100%'>Inspector Gadget</span>";
		gogoGadgetTitle.innerHTML+="<span><img class='InspectorGadgetPauseBox' src='./images/close.png' onclick='InspectorGadget.hide()'></span>";
		gogoGadgetTitle.innerHTML+="<span><img class='InspectorGadgetCloseBox' src='./images/pause.png' onclick='InspectorGadget.pause();'></span>"
		gogoGadgetWindow.appendChild(gogoGadgetTitle);
		
		// setup scrollable area
		gogoGadgetOutputBox = document.createElement('div');
		gogoGadgetOutputBox.className='InspectorGadgetOutputBox';
		gogoGadgetWindow.appendChild(gogoGadgetOutputBox);
		
		//setup event window
		//gogoGadgetEventWindow = document.createElement('div');
		//gogoGadgetEventWindow.className='InspectorGadgetToolTip';
		//gogoGadgetWindow.appendChild(gogoGadgetEventWindow);
		//gogoGadgetEventWindow.innerHTML = "<textarea class='InspectorGadgetToolTipTextArea'></textarea>";
		
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