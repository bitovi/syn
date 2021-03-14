import syn from '../syn.js'
import locate from './locate_test.js'


QUnit.module("synthetic/mouse/regressions");

var frameHeight = 200;
var frameUrl = 'testpages/regressions_mouse.html';




QUnit.test("Testing Button codes: left click", function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load', async function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var clickable = pageUnderTest.querySelector('#clickable');
		var output1 = pageUnderTest.querySelector('#output1');
		var output2 = pageUnderTest.querySelector('#output2');

		await syn.click(clickable, {});

		var buttonCode = getValue('button', output1.value);
		ok( buttonCode == '0', "Mouse 'button' code expected: '0', received: '" + buttonCode + "'.");
		var clickCode = getValue('button', output2.value);
		ok( clickCode == '0', "Mouse 'button' code expected: '0', received: '" + clickCode + "'.");

		start();
	});

	// TODO: Boilerplate. Can we move this to a setup function?
	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
});




QUnit.test("Testing Button codes: right click",  function () {
	stop();

	var testFrame = document.getElementById('pageUnderTest');

	testFrame.addEventListener('load', async function loadListener(){
		testFrame.removeEventListener('load', loadListener);

		var pageUnderTest = document.getElementById('pageUnderTest').contentDocument.querySelector('body');
		var clickable = pageUnderTest.querySelector('#clickable');
		var output1 = pageUnderTest.querySelector('#output1');
		var output2 = pageUnderTest.querySelector('#output2');

		await syn.rightClick(clickable, {});

		var buttonCode = getValue('button', output1.value);
		ok( buttonCode == '2', "Mouse 'button' code expected: '2', received: '" + buttonCode + "'.");

		start();
	});

	// TODO: Boilerplate. Can we move this to a setup function?
	testFrame.height = frameHeight;
	testFrame.src = frameUrl;
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
