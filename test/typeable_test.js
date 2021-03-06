var syn = require('syn');
var locate = require('test/locate_test');
var QUnit = require("steal-qunit");


QUnit.module("synthetic/typeable");

var isTypeable = syn.typeable.test;

QUnit.test("Inputs and textareas", function () {
	var input = document.createElement("input");
	var textarea = document.createElement("textarea");

	equal(isTypeable(input), true, "Input element is typeable.");
	equal(isTypeable(textarea), true, "Text area is typeable.");
});

QUnit.test("Normal divs", function () {
	var div = document.createElement("div");

	equal(isTypeable(div), false, "Divs are not typeable.");
});

QUnit.test("Contenteditable div", function () {
	var div = document.createElement("div");

	// True
	div.setAttribute("contenteditable", "true");
	equal(isTypeable(div), true, "Divs with contenteditable true");

	// Empty string
	div.setAttribute("contenteditable", "");
	equal(isTypeable(div), true, "Divs with contenteditable as empty string.");
});

QUnit.test("User defined typeable function", function () {
	// We're going to define a typeable with a class of foo.
	syn.typeable(function (node) {
		return node.className === "foo";
	});

	var div = document.createElement("div");
	div.className = "foo";

	equal(isTypeable(div), true, "Custom function works.");
});


