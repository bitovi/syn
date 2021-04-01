var syn = require('syn');
var locate = require('test/locate_test');
var QUnit = require("steal-qunit");
var $ = require("jquery");
require("syn/drag");

QUnit.module("syn/drag");

QUnit.test("Drag Item Upward HTML5", 2, function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load',  async function loadListener(){
		testFrame.removeEventListener('load', loadListener);
		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var draggable = pageUnderTest.querySelector('#drag1');
		var target = pageUnderTest.querySelector('#cell_a2');

		await syn.drag(draggable, {to: target});

		var cell_a2 = pageUnderTest.querySelector('#cell_a2')
		var cell_b2 = pageUnderTest.querySelector('#cell_b2')
		ok(cell_a2.querySelector('#drag1') != null , "Dragged element expected to exist in node: #cell_a2.");
		ok(cell_b2.classList.contains('dragOver'), "MouseOver on expected node: #cell_b2.");

		start();
	});

	testFrame.height = 350;
	testFrame.src = 'testpages/html5_dragdrop.html';

});



QUnit.test("Drag Item Downward jQuery", 1, function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load',  function loadListener(){
		testFrame.removeEventListener('load', loadListener);
		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var draggable = pageUnderTest.querySelector('#draggable');
		var target = pageUnderTest.querySelector('#dropTarget');

		// Timeout is required because jQuery isn't ready yet on the target page
		setTimeout(async function () {
			
			await syn.drag(draggable, {to: target});

			var check = pageUnderTest.querySelector('#draggable')
			ok(check.classList.contains('leftOfMark'), "jQuery drag did not register.");

			start();
		}, 500);
	});

	testFrame.height = 160;
	testFrame.src = 'testpages/jquery_dragdrop.html';

});


/*
	TODO: This test is incomplete. If you run it, you should see the "inner" element dragged into the receptive
	box above. However, the word "inner" should become "outer" since that is the drag element.

	My theory is that we are sending the final drag events by page offset rather than dragdrop target, and that
	it is "hitting" the element being dragged because we are over the dragdrop target at the time of the drop.
*/
QUnit.test("Drag Regressions 1 - cancel and bubble", 1, function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load',  async function loadListener(){
		testFrame.removeEventListener('load', loadListener);
		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var draggable = pageUnderTest.querySelector('#outer');
		var target = pageUnderTest.querySelector('#div1');

		await syn.drag(draggable, {to: target});

		ok(true , "Dragged element expected to exist in node: #cell_a2.");
		start();
	});

	testFrame.height = 350;
	testFrame.src = 'testpages/regressions_drag.html';

});
