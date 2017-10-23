var syn = require('syn');
var locate = require('test/locate_test');
var QUnit = require("steal-qunit");

QUnit.module("synthetic/key");

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
			
			ok(pageUnderTest.querySelector('#keycodeOutput').innerHTML == "33")
			ok(pageUnderTest.querySelector('#charcodeOutput').innerHTML == "33")
			start();
		});
	});

	// TODO: Boilerplate. Can we move this to a setup function?
	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});




