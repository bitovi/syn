/* 
	BROWSER DETECTIVE
	v 0.1
	
	Browser Detective detects which browser is currently being used.
	This is important for testing event accuracy because different browsers send different events
	and/or send events in a different order.
	
	To ensure the accurary of our tools, we must know the browser and be adjust assertions 
	accordingly.
	
*/

var BrowserDetective = {
	version: "version 0.1",

	getBrowserName : function(){

		var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
		if(isOpera){ return "opera"; }

		// Firefox 1.0+
		var isFirefox = typeof InstallTrigger !== 'undefined';
		if(isFirefox){ return "firefox"; }

		// Safari 3.0+ "[object HTMLElementConstructor]" 
		var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
		if(isSafari){ return "safari"; }

		// Internet Explorer 6-11
		var isIE = /*@cc_on!@*/false || !!document.documentMode;
		if(isIE){ return "ie"; }

		// Edge 20+
		var isEdge = !isIE && !!window.StyleMedia;
		if(isEdge){ return "edge"; }
	
		// Chrome 1+
		var isChrome = !!window.chrome && !!window.chrome.webstore;	
		if(isChrome){ return "chrome"; }
	
		return "unknown";
	}
}