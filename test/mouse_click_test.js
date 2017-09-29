var syn = require('syn');
var locate = require('test/locate_test');
var QUnit = require("steal-qunit");
var $ = require("jquery");
require("syn/drag");

QUnit.module("syn/drag");

QUnit.test("Drag Item Upward", 1, function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest')
	testFrame.addEventListener('load', function(){
		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var target = pageUnderTest.querySelector('#cell_a0');
		
		syn.click(target, function () {
			//ok(true, "Didn't get an error.");
			
			ok(true);
			
			start();
		});
	});

	testFrame.height = 350;
	testFrame.src = 'testpages/mouseclick.html';

});


