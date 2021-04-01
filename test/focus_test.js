var syn = require('syn');
var locate = require('test/locate_test');
var QUnit = require("steal-qunit");

QUnit.module("syn/focus");

var testSpeed = 200;
var frameHeight = 80;
var frameUrl = 'testpages/focus.html';

/* TODO:
Tests added:
- Click [*]
- Doubleclick  [*]
- Rightclick [*]
- Tab-into [*]
- Tab-wrap [*]
- Anti-tab back [*]
- Anti-tab back-wrap [*]

Tests left to add:

*/

QUnit.test("Focus from click", 1, function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load', async function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var source = pageUnderTest.querySelectorAll('span.focusbox');


		await syn.click(source[0]);

		checkForFocus(source[0], true);

		start();
	});

	// TODO: Boilerplate. Can we move this to a setup function?
	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});



QUnit.test("Focus from double-click", 1, function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load', async function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var source = pageUnderTest.querySelectorAll('span.focusbox');


		await syn.dblclick(source[0]);

		checkForFocus(source[0], true);

		start();
	});

	// TODO: Boilerplate. Can we move this to a setup function?
	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});



QUnit.test("Focus from right-click", 1, function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load', async function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var source = pageUnderTest.querySelectorAll('span.focusbox');


		await syn.rightClick(source[0]);

		checkForFocus(source[0], true);

		start();
	});

	// TODO: Boilerplate. Can we move this to a setup function?
	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});



QUnit.test("Focus on next element upon tab", 3, function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load', async function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var source = pageUnderTest.querySelectorAll('span.focusbox');


		await syn.click(source[1],{});

		checkForFocus(source[1], true);

		await syn.type(source[1], '\t');

		checkForFocus(source[1], false);
		checkForFocus(source[2], true);
		start();
	});

	// TODO: Boilerplate. Can we move this to a setup function?
	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});



QUnit.test("Focus wraps when tabbed upon last focusable element", 3, function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load', async function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var source = pageUnderTest.querySelectorAll('span.focusbox');


		await syn.click(source[3], {});

		checkForFocus(source[3], true);

		await syn.type(source[3], '\t');

		checkForFocus(source[3], false);
		checkForFocus(source[0], true);
		start();
	});

	// TODO: Boilerplate. Can we move this to a setup function?
	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});



QUnit.test("Focus on prev element upon anti-tab", 3, function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load', async function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var source = pageUnderTest.querySelectorAll('span.focusbox');


		await syn.click(source[1], {});

		checkForFocus(source[1], true);
		await syn.type(source[1], '[shift]\t[shift-up]');

		checkForFocus(source[1], false);
		checkForFocus(source[0], true);
		start();
	});

	// TODO: Boilerplate. Can we move this to a setup function?
	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});



QUnit.test("Focus wraps when anti-tabbed upon first focusable element", 3, function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load', async function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var source = pageUnderTest.querySelectorAll('span.focusbox');


		await syn.click(source[0], {});

		checkForFocus(source[0], true);

		await syn.type(source[0], '[shift]\t[shift-up]');

		checkForFocus(source[0], false);
		checkForFocus(source[3], true);
		start();
	});

	// TODO: Boilerplate. Can we move this to a setup function?
	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});


function checkForFocus(elem, expectedState){
	ok((elem.classList.contains('hasfocus') == expectedState), "Focus on expected node.");
}
