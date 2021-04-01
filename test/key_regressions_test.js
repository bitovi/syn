var syn = require('syn');
var locate = require('test/locate_test');
var QUnit = require("steal-qunit");

QUnit.module("synthetic/key/regressions");

var frameHeight = 110;
var frameUrl = 'testpages/regressions_keyboard.html';

QUnit.test("Testing Keycodes for !", 2, async function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load', async function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var source = pageUnderTest.querySelector('#Box1');

		await syn.type(source, "!");
		ok(pageUnderTest.querySelector('#keycodeOutput').innerHTML == "33");
		ok(pageUnderTest.querySelector('#charcodeOutput').innerHTML == "33");
		start();
	});

	// TODO: Boilerplate. Can we move this to a setup function?
	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});


QUnit.test("Special keycodes for enter on TextBox", 1, async function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load', async function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var keyTarget = pageUnderTest.querySelector('#synthetic');
		var output = pageUnderTest.querySelector('#synthetic_events');
		var browser = BrowserDetective.getBrowserName();


		await syn.type(keyTarget, "\b\r");

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

	testFrame.height = 100;
	testFrame.src = 'testpages/regressions_keyboard2.html';
});


QUnit.test("Special keycodes for enter on TextArea", 1, async function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load', async function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var keyTarget = pageUnderTest.querySelector('#area');
		var output = pageUnderTest.querySelector('#synthetic_events');
		var browser = BrowserDetective.getBrowserName();

		await syn.type(keyTarget, "\b\r");

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

	testFrame.height = 100;
	testFrame.src = 'testpages/regressions_keyboard2.html';
});
