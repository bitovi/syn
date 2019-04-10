var syn = require('syn');
var locate = require('test/locate_test');
var QUnit = require("steal-qunit");
var $ = require("jquery");
require("syn/drag");

QUnit.module("syn/drag");

QUnit.test("Drag Item Upward HTML5", 2, function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest');
	
	testFrame.addEventListener('load',  function loadListener(){
		testFrame.removeEventListener('load', loadListener);	
		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var draggable = pageUnderTest.querySelector('#drag1');
		var target = pageUnderTest.querySelector('#cell_a2');
			
		syn.drag(draggable, {to: target}, function () {
			
			var cell_a2 = pageUnderTest.querySelector('#cell_a2')
			var cell_b2 = pageUnderTest.querySelector('#cell_b2')
			ok(cell_a2.querySelector('#drag1') != null , "Dragged element expected to exist in node: #cell_a2.");
			ok(cell_b2.classList.contains('dragOver'), "MouseOver on expected node: #cell_b2.");
			
			start();
		});
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
		setTimeout(function () {
			syn.drag(draggable, {to: target}, function () {
				var check = pageUnderTest.querySelector('#draggable')
				ok(check.classList.contains('leftOfMark'), "jQuery drag did not register.");
				
				start();
			});
		}, 500);			
	});

	testFrame.height = 160;
	testFrame.src = 'testpages/jquery_dragdrop.html';

});


QUnit.test("Drag Regressions 1 - cancel and bubble", 1, function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest');
	
	testFrame.addEventListener('load',  function loadListener(){
		testFrame.removeEventListener('load', loadListener);	
		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var draggable = pageUnderTest.querySelector('#outer');
		var target = pageUnderTest.querySelector('#div1');
			
		syn.drag(draggable, {to: target}, function () {
			
			ok(true , "Dragged element expected to exist in node: #cell_a2.");		
			start();
		});
	});

	testFrame.height = 350;
	testFrame.src = 'testpages/regressions_drag.html';

});

