/* global st:true */
var syn = require('syn');
var locate = require('test/locate_test');
var st = require("test/helpers_test");
var QUnit = require("steal-qunit");

QUnit.module("syn");



setTimeout(function supportLog() {
	if (syn.support.ready === 2) {
		for (var name in syn.support) {
			st.log(name + ": " + syn.support[name]);
		}
	} else {
		setTimeout(supportLog, 1);
	}
}, 1);

QUnit.test("Selecting a select element", async function() {
	st.g("qunit-fixture")
		.innerHTML =
		"<form id='outer'><select name='select'><option value='1' id='one'>one</option><option value='2' id='two'>two</option></select></form>";

	var change = 0,
		changef = function () {
			change++;
		};

	st.g("outer")
		.select.selectedIndex = 0;

	st.bind(st.g("outer")
		.select, "change", changef);

	stop();
	await syn.click(st.g("two"));

	equal(change, 1, "change called once");
	equal(st.g("outer")
		.select.selectedIndex, 1, "Change Selected Index");

	start();
	st.g("qunit-fixture")
		.innerHTML = "";
});

QUnit.test("scrollTop triggers scroll events", async function () {
	st.g("qunit-fixture")
		.innerHTML = "<div id='scroller' style='height:100px;width: 100px;overflow:auto'>" +
		"<div style='height: 200px; width: 100%'>text" +
		"</div>" +
		"</div>";

	st.binder("scroller", "scroll", function (ev) {
		ok(true, "scrolling created just by changing ScrollTop");
		st.g("qunit-fixture")
			.innerHTML = "";
		start();
	});
	stop();
	setTimeout(function () {
		var sc = st.g("scroller");
		if (sc) {
			sc.scrollTop = 10;
		}
	}, 13);
});

if (!syn.skipFocusTests) {
	QUnit.test("focus triggers focus events", function () {
		st.g("qunit-fixture")
			.innerHTML = "<input type='text' id='focusme'/>";

		st.binder("focusme", "focus", function (ev) {
			ok(true, "focus creates event");
			st.g("qunit-fixture")
				.innerHTML = "";
			start();
		});
		stop();
		setTimeout(function () {
			st.g("focusme")
				.focus();
		}, 10);

	});
}

QUnit.test("syn.support effect on scroll position, #30", function () {
	stop();

	// Make sure the browser hasn't scrolled on account of feature detection.
	// We're going to do this by opening a new page with a lot of text that might
	// cause scroll.
	// test/qunit/page1.html
	locate("test/pages/scroll_30.html",function(scroll30){
		scroll30 = scroll30.replace(".js","");

		var iframe = document.createElement("iframe");
		iframe.setAttribute("height", "100");
		iframe.src = scroll30;
		window.synReady = function () {
			try {
				delete window.synReady;
			} catch (e) {
				window.synReady = undefined; // IE 8 and below
			}
			var win = iframe.contentWindow;
			var scrollTop = win.document.body.scrollTop;

			equal(scrollTop, 0);
			start();
		};

		st.g("qunit-fixture")
			.appendChild(iframe);
	});

});

QUnit.test("syn.schedule gets called when syn.delay is used", function () {
	stop();
	locate("test/pages/syn.schedule.html",function(synUrl){
		var iframe = document.createElement("iframe");
		iframe.src = synUrl.replace(".js","");
		window.synSchedule = function (fn, ms) {
			// fn should be a function
			equal(typeof fn, "function");
			// ms is a Number
			equal(typeof ms, "number");

			start();
		};

		st.g("qunit-fixture")
			.appendChild(iframe);

	});

});
