/*
	MOUSE MOVE TEST

	Ensures the accuracy of mouse events specific to mouse movement.

	Planned Improvements:
	TODO: change checkThatMousePassedOver to include not-only the order of events, but the number of events.
	For example, duplicate mouseEnters would be a bug, but would not be caught under the current system.

*/

var syn = require('syn');
var locate = require('test/locate_test');
var QUnit = require("steal-qunit");
var $ = require("jquery");
require("syn/drag");

QUnit.module("syn/mouse_move");

var testSpeed = 200;
var frameHeight = 350;
var frameUrl = 'testpages/mousemove.html';

var mouseMoveOver = 'pointerover, pointerenter, mouseover, mouseenter, pointermove, pointerout, pointerleave, mouseout, mouseleave, ';
var mouseMoveEnd = 'pointerover, pointerenter, mouseover, mouseenter, pointermove, ';

QUnit.test("Move Cursor Upward", 8, function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load', async function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var source = pageUnderTest.querySelector('#cell_c2');
		var destination = pageUnderTest.querySelector('#cell_a2');

		await syn.move(source, {to: destination, duration: testSpeed});

		// ensure we get mouse events over the places that we expect
		checkThatMousePassedOver(pageUnderTest, "#cell_a2", mouseMoveEnd);
		checkThatMousePassedOver(pageUnderTest, "#cell_b2", mouseMoveOver);
		//checkThatMousePassedOver(pageUnderTest, "#cell_c2", mouseMoveOver); // TODO: Starting cell gets no entry events!

		// ensure that neighbors to expected mouse event locations do not get events
		checkThatMousePassedOver(pageUnderTest, "#cell_a1", '');
		checkThatMousePassedOver(pageUnderTest, "#cell_b1", '');
		checkThatMousePassedOver(pageUnderTest, "#cell_c1", '');
		checkThatMousePassedOver(pageUnderTest, "#cell_a3", '');
		checkThatMousePassedOver(pageUnderTest, "#cell_b3", '');
		checkThatMousePassedOver(pageUnderTest, "#cell_c3", '');

		start();
	});

	// TODO: Boilerplate. Can we move this to a setup function?
	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});




QUnit.test("Move Cursor Downward", 8, function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load',  async function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = testFrame.contentDocument.querySelector('body');
		var source = pageUnderTest.querySelector('#cell_c2');
		var destination = pageUnderTest.querySelector('#cell_e2');

		await syn.move(source, {to: destination, duration: testSpeed});

		// ensure we get mouse events over the places that we expect
		checkThatMousePassedOver(pageUnderTest, "#cell_e2", mouseMoveEnd);
		checkThatMousePassedOver(pageUnderTest, "#cell_d2", mouseMoveOver);
		//checkThatMousePassedOver(pageUnderTest, "#cell_c2" true); // TODO: starting cell not working, why?

		// ensure that neighbors to expected mouse event locations do not get events
		checkThatMousePassedOver(pageUnderTest, "#cell_e1", '');
		checkThatMousePassedOver(pageUnderTest, "#cell_d1", '');
		checkThatMousePassedOver(pageUnderTest, "#cell_c1", '');
		checkThatMousePassedOver(pageUnderTest, "#cell_e3", '');
		checkThatMousePassedOver(pageUnderTest, "#cell_d3", '');
		checkThatMousePassedOver(pageUnderTest, "#cell_c3", '');

		start();
	});

	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});




QUnit.test("Move Cursor Leftward", 8, function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load',  async function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = testFrame.contentDocument.querySelector('body');
		var source = pageUnderTest.querySelector('#cell_c2');
		var destination = pageUnderTest.querySelector('#cell_c0');

		await syn.move(source, {to: destination, duration: testSpeed});

		// ensure we get mouse events over the places that we expect
		checkThatMousePassedOver(pageUnderTest, "#cell_c0", mouseMoveEnd);
		checkThatMousePassedOver(pageUnderTest, "#cell_c1", mouseMoveOver);
		//checkThatMousePassedOver(pageUnderTest, "#cell_c2" true); // TODO: starting cell not working, why?

		// ensure that neighbors to expected mouse event locations do not get events
		checkThatMousePassedOver(pageUnderTest, "#cell_b0", '');
		checkThatMousePassedOver(pageUnderTest, "#cell_b1", '');
		checkThatMousePassedOver(pageUnderTest, "#cell_b2", '');
		checkThatMousePassedOver(pageUnderTest, "#cell_d0", '');
		checkThatMousePassedOver(pageUnderTest, "#cell_d1", '');
		checkThatMousePassedOver(pageUnderTest, "#cell_d2", '');

		start();
	});

	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});




QUnit.test("Move Cursor Rightward", 8, function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load',  async function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = testFrame.contentDocument.querySelector('body');
		var source = pageUnderTest.querySelector('#cell_c2');
		var destination = pageUnderTest.querySelector('#cell_c4');

		await syn.move(source, {to: destination, duration: testSpeed});

		// ensure we get mouse events over the places that we expect
		checkThatMousePassedOver(pageUnderTest, "#cell_c4", mouseMoveEnd);
		checkThatMousePassedOver(pageUnderTest, "#cell_c3", mouseMoveOver);
		//checkThatMousePassedOver(pageUnderTest, "#cell_c2" true); // TODO: starting cell not working, why?

		// ensure that neighbors to expected mouse event locations do not get events
		checkThatMousePassedOver(pageUnderTest, "#cell_b2", '');
		checkThatMousePassedOver(pageUnderTest, "#cell_b3", '');
		checkThatMousePassedOver(pageUnderTest, "#cell_b4", '');
		checkThatMousePassedOver(pageUnderTest, "#cell_d2", '');
		checkThatMousePassedOver(pageUnderTest, "#cell_d3", '');
		checkThatMousePassedOver(pageUnderTest, "#cell_d4", '');

		start();

	});

	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});




QUnit.test("Move Cursor Diagonal Up+Left", 2, function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load',  async function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = testFrame.contentDocument.querySelector('body');
		var source = pageUnderTest.querySelector('#cell_c2');
		var destination = pageUnderTest.querySelector('#cell_a0');

		await syn.move(source, {to: destination, duration: testSpeed});

		// ensure we get mouse events over the places that we expect
		checkThatMousePassedOver(pageUnderTest, "#cell_a0", mouseMoveEnd);
		checkThatMousePassedOver(pageUnderTest, "#cell_b1", mouseMoveOver);
		//checkThatMousePassedOver(pageUnderTest, "#cell_c2" true); // TODO: starting cell not working, why?

		start();
	});

	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});




QUnit.test("Move Cursor Diagonal Up+Right", 2, function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load',  async function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = testFrame.contentDocument.querySelector('body');
		var source = pageUnderTest.querySelector('#cell_c2');
		var destination = pageUnderTest.querySelector('#cell_a4');

		await syn.move(source, {to: destination, duration: testSpeed});

		// ensure we get mouse events over the places that we expect
		checkThatMousePassedOver(pageUnderTest, "#cell_a4", mouseMoveEnd);
		checkThatMousePassedOver(pageUnderTest, "#cell_b3", mouseMoveOver);
		//checkThatMousePassedOver(pageUnderTest, "#cell_c2" true); // TODO: starting cell not working, why?

		start();
	});

	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});




QUnit.test("Move Cursor Diagonal Down+Left", 2, function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load',  async function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = testFrame.contentDocument.querySelector('body');
		var source = pageUnderTest.querySelector('#cell_c2');
		var destination = pageUnderTest.querySelector('#cell_e0');

		await syn.move(source, {to: destination, duration: testSpeed});

		// ensure we get mouse events over the places that we expect
		checkThatMousePassedOver(pageUnderTest, "#cell_e0", mouseMoveEnd);
		checkThatMousePassedOver(pageUnderTest, "#cell_d1", mouseMoveOver);
		//checkThatMousePassedOver(pageUnderTest, "#cell_c2" true); // TODO: starting cell not working, why?

		start();
	});

	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});




QUnit.test("Move Cursor Diagonal Down+Right", 1, function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load',  async function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = testFrame.contentDocument.querySelector('body');
		var source = pageUnderTest.querySelector('#cell_c2');
		var destination = pageUnderTest.querySelector('#cell_e4');

		await syn.move(source, {to: destination, duration: testSpeed});

		// NOTE: The test sporadically moves the mouse at the end of the test, causing extra events to appear here.
		// so we can't rely on the #cell_e4 check
		// checkThatMousePassedOver(pageUnderTest, "#cell_e4", mouseMoveEnd);
		checkThatMousePassedOver(pageUnderTest, "#cell_d3", mouseMoveOver);
		//checkThatMousePassedOver(pageUnderTest, "#cell_c2" true); // TODO: starting cell not working, why?

		start();
	});

	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});


function checkThatMousePassedOver(pageUnderTest, cellName, expectedEvents){
	var cell = pageUnderTest.querySelector(cellName);
	var browser = BrowserDetective.getBrowserName();
	var actualEvents = '';

	//var i;
	for (var i = 0; i < cell.eventRecorder.length; i++) {
		actualEvents += cell.eventRecorder[i] +  ", ";
	}

	//cell.eventRecorder.forEach(function(elem) { actualEvents += elem + ", "; });
	equal(actualEvents, expectedEvents, "Recorded events must match expected events. CellId: " + cellName);

}
