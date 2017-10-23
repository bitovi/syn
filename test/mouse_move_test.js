var syn = require('syn');
var locate = require('test/locate_test');
var QUnit = require("steal-qunit");
var $ = require("jquery");
require("syn/drag");

QUnit.module("syn/mouse_move");

var testSpeed = 200;
var frameHeight = 350;
var frameUrl = 'testpages/mousemove.html';

QUnit.test("Move Cursor Upward", 8, function () {
	stop();
	
	var testFrame = document.getElementById('pageUnderTest');
	
	testFrame.addEventListener('load', function loadListener(){
		testFrame.removeEventListener('load', loadListener);
		
		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var source = pageUnderTest.querySelector('#cell_c2');
		var destination = pageUnderTest.querySelector('#cell_a2');
			
		syn.move(source, {to: destination, duration: testSpeed}, function () {
			
			// ensure we get mouse events over the places that we expect
			checkThatMousePassedOver(pageUnderTest, "#cell_a2", true);
			checkThatMousePassedOver(pageUnderTest, "#cell_b2", true);
			//checkThatMousePassedOver(pageUnderTest, "#cell_c2" true); // TODO: starting cell not working, why?
			
			// ensure that neighbors to expected mouse event locations do not get events
			checkThatMousePassedOver(pageUnderTest, "#cell_a1", false);
			checkThatMousePassedOver(pageUnderTest, "#cell_b1", false);
			checkThatMousePassedOver(pageUnderTest, "#cell_c1", false);
			checkThatMousePassedOver(pageUnderTest, "#cell_a3", false);
			checkThatMousePassedOver(pageUnderTest, "#cell_b3", false);
			checkThatMousePassedOver(pageUnderTest, "#cell_c3", false);
					
			start();
		});
	});

	// TODO: Boilerplate. Can we move this to a setup function?
	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});




QUnit.test("Move Cursor Downward", 8, function () {
	stop();
		
	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load',  function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = testFrame.contentDocument.querySelector('body');
		var source = pageUnderTest.querySelector('#cell_c2');
		var destination = pageUnderTest.querySelector('#cell_e2');

		syn.move(source, {to: destination, duration: testSpeed}, function () {
			
			// ensure we get mouse events over the places that we expect
			checkThatMousePassedOver(pageUnderTest, "#cell_e2", true);
			checkThatMousePassedOver(pageUnderTest, "#cell_d2", true);
			//checkThatMousePassedOver(pageUnderTest, "#cell_c2" true); // TODO: starting cell not working, why?
			
			// ensure that neighbors to expected mouse event locations do not get events
			checkThatMousePassedOver(pageUnderTest, "#cell_e1", false);
			checkThatMousePassedOver(pageUnderTest, "#cell_d1", false);
			checkThatMousePassedOver(pageUnderTest, "#cell_c1", false);
			checkThatMousePassedOver(pageUnderTest, "#cell_e3", false);
			checkThatMousePassedOver(pageUnderTest, "#cell_d3", false);
			checkThatMousePassedOver(pageUnderTest, "#cell_c3", false);

			start();
		});
	});

	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});




QUnit.test("Move Cursor Leftward", 8, function () {
	stop();
		
	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load',  function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = testFrame.contentDocument.querySelector('body');
		var source = pageUnderTest.querySelector('#cell_c2');
		var destination = pageUnderTest.querySelector('#cell_c0');

		syn.move(source, {to: destination, duration: testSpeed}, function () {
			
			// ensure we get mouse events over the places that we expect
			checkThatMousePassedOver(pageUnderTest, "#cell_c0", true);
			checkThatMousePassedOver(pageUnderTest, "#cell_c1", true);
			//checkThatMousePassedOver(pageUnderTest, "#cell_c2" true); // TODO: starting cell not working, why?
			
			// ensure that neighbors to expected mouse event locations do not get events
			checkThatMousePassedOver(pageUnderTest, "#cell_b0", false);
			checkThatMousePassedOver(pageUnderTest, "#cell_b1", false);
			checkThatMousePassedOver(pageUnderTest, "#cell_b2", false);
			checkThatMousePassedOver(pageUnderTest, "#cell_d0", false);
			checkThatMousePassedOver(pageUnderTest, "#cell_d1", false);
			checkThatMousePassedOver(pageUnderTest, "#cell_d2", false);

			start();
		});
	});

	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});




QUnit.test("Move Cursor Rightward", 8, function () {
	stop();
		
	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load',  function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = testFrame.contentDocument.querySelector('body');
		var source = pageUnderTest.querySelector('#cell_c2');
		var destination = pageUnderTest.querySelector('#cell_c4');

		syn.move(source, {to: destination, duration: testSpeed}, function () {
			
			// ensure we get mouse events over the places that we expect
			checkThatMousePassedOver(pageUnderTest, "#cell_c4", true);
			checkThatMousePassedOver(pageUnderTest, "#cell_c3", true);
			//checkThatMousePassedOver(pageUnderTest, "#cell_c2" true); // TODO: starting cell not working, why?
			
			// ensure that neighbors to expected mouse event locations do not get events
			checkThatMousePassedOver(pageUnderTest, "#cell_b2", false);
			checkThatMousePassedOver(pageUnderTest, "#cell_b3", false);
			checkThatMousePassedOver(pageUnderTest, "#cell_b4", false);
			checkThatMousePassedOver(pageUnderTest, "#cell_d2", false);
			checkThatMousePassedOver(pageUnderTest, "#cell_d3", false);
			checkThatMousePassedOver(pageUnderTest, "#cell_d4", false);

			start();
		});
	});

	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});




QUnit.test("Move Cursor Diagonal Up+Left", 2, function () {
	stop();
		
	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load',  function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = testFrame.contentDocument.querySelector('body');
		var source = pageUnderTest.querySelector('#cell_c2');
		var destination = pageUnderTest.querySelector('#cell_a0');

		syn.move(source, {to: destination, duration: testSpeed}, function () {
			
			// ensure we get mouse events over the places that we expect
			checkThatMousePassedOver(pageUnderTest, "#cell_a0", true);
			checkThatMousePassedOver(pageUnderTest, "#cell_b1", true);
			//checkThatMousePassedOver(pageUnderTest, "#cell_c2" true); // TODO: starting cell not working, why?
			
			start();
		});
	});

	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});




QUnit.test("Move Cursor Diagonal Up+Right", 2, function () {
	stop();
		
	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load',  function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = testFrame.contentDocument.querySelector('body');
		var source = pageUnderTest.querySelector('#cell_c2');
		var destination = pageUnderTest.querySelector('#cell_a4');

		syn.move(source, {to: destination, duration: testSpeed}, function () {
			
			// ensure we get mouse events over the places that we expect
			checkThatMousePassedOver(pageUnderTest, "#cell_a4", true);
			checkThatMousePassedOver(pageUnderTest, "#cell_b3", true);
			//checkThatMousePassedOver(pageUnderTest, "#cell_c2" true); // TODO: starting cell not working, why?
			
			start();
		});
	});

	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});




QUnit.test("Move Cursor Diagonal Down+Left", 2, function () {
	stop();
		
	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load',  function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = testFrame.contentDocument.querySelector('body');
		var source = pageUnderTest.querySelector('#cell_c2');
		var destination = pageUnderTest.querySelector('#cell_e0');

		syn.move(source, {to: destination, duration: testSpeed}, function () {
			
			// ensure we get mouse events over the places that we expect
			checkThatMousePassedOver(pageUnderTest, "#cell_e0", true);
			checkThatMousePassedOver(pageUnderTest, "#cell_d1", true);
			//checkThatMousePassedOver(pageUnderTest, "#cell_c2" true); // TODO: starting cell not working, why?
			
			start();
		});
	});

	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});




QUnit.test("Move Cursor Diagonal Down+Right", 2, function () {
	stop();
		
	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load',  function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = testFrame.contentDocument.querySelector('body');
		var source = pageUnderTest.querySelector('#cell_c2');
		var destination = pageUnderTest.querySelector('#cell_e4');

		syn.move(source, {to: destination, duration: testSpeed}, function () {
			
			// ensure we get mouse events over the places that we expect
			checkThatMousePassedOver(pageUnderTest, "#cell_e4", true);
			checkThatMousePassedOver(pageUnderTest, "#cell_d3", true);
			//checkThatMousePassedOver(pageUnderTest, "#cell_c2" true); // TODO: starting cell not working, why?
			
			start();
		});
	});

	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});


function checkThatMousePassedOver(pageUnderTest, cellName, expectedState){
	var cell = pageUnderTest.querySelector(cellName);
	ok((cell.classList.contains('mouseOver') == expectedState), "MouseOver on expected node: "+cellName+".");
}

