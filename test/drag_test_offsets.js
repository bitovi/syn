var syn = require('syn');
var locate = require('test/locate_test');
var QUnit = require("steal-qunit");
var $ = require("jquery");
require("syn/src/drag");

QUnit.module("syn/drag");

QUnit.test("Drag Item Upward", 2, function () {
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
	testFrame.src = 'testpages/dragdrop.html';

});


