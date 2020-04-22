var syn = require('syn');
var locate = require('test/locate_test');
var QUnit = require("steal-qunit");

QUnit.module("synthetic/mouse/regressions");
QUnit.module("syn/drag");

var frameHeight = 200;
var regressionsTestpage = 'testpages/regressions_mouse.html';
var buttonCodeTestpage = 'testpages/button_number_tests.html';




QUnit.test("Testing Button codes: left click", 2, function () {
	stop();
	
	var testFrame = document.getElementById('pageUnderTest');
	
	testFrame.addEventListener('load', function loadListener(){
		testFrame.removeEventListener('load', loadListener);
		
		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var clickable = pageUnderTest.querySelector('#clickable');
		var output1 = pageUnderTest.querySelector('#output1');
		var output2 = pageUnderTest.querySelector('#output2');

		syn.click(clickable, {}, function () {

			var buttonCode = getValue('button', output1.value);
			ok( buttonCode == '0', "Mouse 'button' code expected: '0', received: '" + buttonCode + "'.");
			var clickCode = getValue('button', output2.value);
			ok( clickCode == '0', "Mouse 'button' code expected: '0', received: '" + clickCode + "'.");

			start();
		});
	});

	testFrame.height = frameHeight;
	testFrame.src = regressionsTestpage;
});




QUnit.test("Testing Button codes: right click", 1, function () {
	stop();
	
	var testFrame = document.getElementById('pageUnderTest');
	
	testFrame.addEventListener('load', function loadListener(){
		testFrame.removeEventListener('load', loadListener);
		
		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var clickable = pageUnderTest.querySelector('#clickable');
		var output1 = pageUnderTest.querySelector('#output1');
		var output2 = pageUnderTest.querySelector('#output2');

		syn.rightClick(clickable, {}, function () {

			var buttonCode = getValue('button', output1.value);
			ok( buttonCode == '2', "Mouse 'button' code expected: '2', received: '" + buttonCode + "'.");

			start();
		});
	});

	testFrame.height = frameHeight;
	testFrame.src = regressionsTestpage;
});




QUnit.test("Testing ButtonS codes: left click", 2, function () {
	stop();
	
	var testFrame = document.getElementById('pageUnderTest');
	
	testFrame.addEventListener('load', function loadListener(){
		testFrame.removeEventListener('load', loadListener);
		
		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var clickable = pageUnderTest.querySelector('#clickbutton');
		var buttonNumber = pageUnderTest.querySelector('#buttonNumber');
		var buttonsNumber = pageUnderTest.querySelector('#buttonsNumber');

		syn.click(clickable, {}, function () {

			var buttonCode = buttonNumber.innerText;
			ok( buttonCode == 'Button Number: 0', "Mouse 'button' code expected: '0', received: '" + buttonCode + "'.");
			var buttonsCode = buttonsNumber.innerText;
			ok( buttonsCode == 'ButtonS Number: 1', "Mouse 'buttons' code expected: '1', received: '" + buttonsCode + "'.");

			start();
		});
	});

	testFrame.height = 300;
	testFrame.src = buttonCodeTestpage;
});




QUnit.test("Testing ButtonS codes: right click", 2, function () {
	stop();
	
	var testFrame = document.getElementById('pageUnderTest');
	
	testFrame.addEventListener('load', function loadListener(){
		testFrame.removeEventListener('load', loadListener);
		
		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var clickable = pageUnderTest.querySelector('#clickbutton');
		var buttonNumber = pageUnderTest.querySelector('#buttonNumber');
		var buttonsNumber = pageUnderTest.querySelector('#buttonsNumber');

		syn.rightClick(clickable, {}, function () {

			var buttonCode = buttonNumber.innerText;
			ok( buttonCode == 'Button Number: 2', "Mouse 'button' code expected: '2', received: '" + buttonCode + "'.");
			var buttonsCode = buttonsNumber.innerText;
			ok( buttonsCode == 'ButtonS Number: 2', "Mouse 'buttons' code expected: '2', received: '" + buttonsCode + "'.");

			start();
		});
	});

	testFrame.height = 300;
	testFrame.src = buttonCodeTestpage;
});




QUnit.test("Testing ButtonS codes: double click", 2, function () {
	stop();
	
	var testFrame = document.getElementById('pageUnderTest');
	
	testFrame.addEventListener('load', function loadListener(){
		testFrame.removeEventListener('load', loadListener);
		
		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var clickable = pageUnderTest.querySelector('#clickbutton');
		var buttonNumber = pageUnderTest.querySelector('#buttonNumber');
		var buttonsNumber = pageUnderTest.querySelector('#buttonsNumber');

		syn.dblclick(clickable, {}, function () {

			var buttonCode = buttonNumber.innerText;
			ok( buttonCode == 'Button Number: 0 0', "Mouse 'button' code expected: '0 0', received: '" + buttonCode + "'.");
			var buttonsCode = buttonsNumber.innerText;
			ok( buttonsCode == 'ButtonS Number: 1 1', "Mouse 'buttons' code expected: '1 1', received: '" + buttonsCode + "'.");

			start();
		});
	});

	testFrame.height = 300;
	testFrame.src = buttonCodeTestpage;
});




QUnit.test("Testing ButtonS codes: drag", 2, function () {
	stop();
	
	var testFrame = document.getElementById('pageUnderTest');
	
	testFrame.addEventListener('load', function loadListener(){
		testFrame.removeEventListener('load', loadListener);
		
		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var buttonNumber = pageUnderTest.querySelector('#buttonNumber');
		var buttonsNumber = pageUnderTest.querySelector('#buttonsNumber');
		var draggable = pageUnderTest.querySelector('#drag1');
		var target = pageUnderTest.querySelector('#cell_a2');
			
		syn.drag(draggable, {to: target}, function () {


			var buttonCode = buttonNumber.innerText;
			ok( buttonCode == 'Button Number: 0 0 0 0', "Mouse 'button' code expected: '0 0 0 0', received: '" + buttonCode + "'.");
			var buttonsCode = buttonsNumber.innerText;
			// EXPLANATION: Mousedown and drag are 1, mouseup and leave are 0
			ok( buttonsCode == 'ButtonS Number: 1 1 0 0', "Mouse 'buttons' code expected: '1 1 0 0', received: '" + buttonsCode + "'.");

			start();
		});
	});

	testFrame.height = 300;
	testFrame.src = buttonCodeTestpage;
});







function getValue(needle, haystack){
	
	needle = needle + "::"; // Add formatting
	
	var startIndex = haystack.indexOf(needle);
	console.log("Start: "+startIndex);
	
	var endIndex = haystack.indexOf("\n", startIndex);
	console.log("End: " + endIndex)
	
	var substring = haystack.substring(startIndex + needle.length, endIndex);
	console.log("Substring: " + substring)

	return substring;
}

