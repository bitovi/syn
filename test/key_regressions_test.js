var syn = require('syn');
var locate = require('test/locate_test');
var QUnit = require("steal-qunit");

QUnit.module("synthetic/key/regressions");

var frameHeight = 110;
var frameUrl = 'testpages/regressions_keyboard.html';

QUnit.test("Testing Keycodes for !", 2, function () {
	stop();
	
	var testFrame = document.getElementById('pageUnderTest');
	
	testFrame.addEventListener('load', function loadListener(){
		testFrame.removeEventListener('load', loadListener);
		
		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var source = pageUnderTest.querySelector('#Box1');
		
		syn.type(source, "!", function(){
			
			ok(pageUnderTest.querySelector('#keycodeOutput').innerHTML == "33");
			ok(pageUnderTest.querySelector('#charcodeOutput').innerHTML == "33");
			start();
		});
	});

	// TODO: Boilerplate. Can we move this to a setup function?
	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});


QUnit.test("Special keycodes for enter on TextBox", 1, function () {
	stop();
	
	var testFrame = document.getElementById('pageUnderTest');
	
	testFrame.addEventListener('load', function loadListener(){
		testFrame.removeEventListener('load', loadListener);
		
		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var keyTarget = pageUnderTest.querySelector('#synthetic');
		var output = pageUnderTest.querySelector('#synthetic_events');
		var browser = browserDetective();
		
		console.log(browser);
		
		syn.type(keyTarget, "\b\r", function(){

			var outputText = output.textContent;
			var expected = (browser == 'firefox') ? 
				'keydown, keypress, input, keyup, keydown, keypress, change, keyup, ' :
				'keydown, input, keyup, keydown, keypress, change, keyup, ' ;
			ok(outputText == expected, 
				'Recorded events were not as-expected. \n' +
				'Expect: ' + expected + '\n' +
				'Actual: ' + outputText);
			start();
		});		
	});

	testFrame.height = 100;
	testFrame.src = 'testpages/regressions_keyboard2.html';
});


QUnit.test("Special keycodes for enter on TextArea", 1, function () {
	stop();
	
	var testFrame = document.getElementById('pageUnderTest');
	
	testFrame.addEventListener('load', function loadListener(){
		testFrame.removeEventListener('load', loadListener);
		
		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var keyTarget = pageUnderTest.querySelector('#area');
		var output = pageUnderTest.querySelector('#synthetic_events');
		var browser = browserDetective();
		
		syn.type(keyTarget, "\b\r", function(){

			var outputText = output.textContent;
			
			 // TODO: Maybe also add "change" at the end, which should occur on blur
			var expected = (browser == 'firefox') ? 
				'keydown, keypress, input, keyup, keydown, keypress, input, keyup, ' :
				'keydown, input, keyup, keydown, keypress, input, keyup, ' ;				
			ok(outputText == expected, 
				'Recorded events were not as-expected. \n' +
				'Expect: ' + expected + '\n' +
				'Actual: ' + outputText);
			start();
		});		
	});

	testFrame.height = 100;
	testFrame.src = 'testpages/regressions_keyboard2.html';
});


// Note: This is required because different browsers send different key events
// Note also: I am currently only checking this against DESKTOP browsers. Events may be different on mobile
//      if-so, we will have to make this smarter.
function browserDetective(){
	
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


