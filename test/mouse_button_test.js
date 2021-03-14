/* global st */

var syn = require('syn');
var locate = require('test/locate_test');
var QUnit = require("steal-qunit");
var st = require("test/helpers_test");


var didSomething = 0;


QUnit.module("syn/mouse_button", {
	setup: function () {
		window.doSomething = function () {
			++didSomething;
		};
		st.g("qunit-fixture")
			.innerHTML = "<form id='outer'><div id='inner'>" +
			"<input type='checkbox' id='checkbox'/>" +
			"<input type='radio' name='radio' value='radio1' id='radio1'/>" +
			"<input type='radio' name='radio' value='radio2' id='radio2'/>" +
			"<a href='javascript:doSomething()' id='jsHref'>click me</a>" +
			"<a href='#aHash' id='jsHrefHash'>click me</a>" +
			"<button id='button' type='button'>Click me</button>" +
			"<input type='submit' id='submit'/></div></form>";
	},

	teardown: function () {
		didSomething = 0;
	}
});

QUnit.test("syn trigger", function () {

	QUnit.ok(syn, "syn exists");

	st.g("qunit-fixture")
		.innerHTML = "<div id='outer'><div id='inner'></div></div>";
	var mouseover = 0,
		mouseoverf = function () {
			mouseover++;
		};
	st.bind(st.g("outer"), "mouseover", mouseoverf);
	syn.trigger(st.g("inner"), "mouseover");

	st.unbinder("outer", "mouseover", mouseoverf);
	QUnit.equal(mouseover, 1, "Mouseover");
	syn.trigger(st.g("inner"), "mouseover", {});

	QUnit.equal(mouseover, 1, "Mouseover on no event handlers");
	st.g("qunit-fixture")
		.innerHTML = "";

});

QUnit.test("Click Forms", function () {
	var submit = 0,
		submitf = function (ev) {
			submit++;
			if (ev.preventDefault) {
				ev.preventDefault();
			}
			ev.returnValue = false;
			return false;
		};
	st.bind(st.g("outer"), "submit", submitf);
	syn.trigger(st.g("submit"), "click", {});
	syn.trigger(st.g("outer"), "submit", {});

	QUnit.equal(submit, 2, "Click on submit");

	//make sure clicking the div does not submit the form
	var click = 0,
		clickf = function (ev) {
			click++;
			if (ev.preventDefault) {
				ev.preventDefault();
			}
			return false;
		};
	st.binder("inner", "click", clickf);

	syn.trigger(st.g("submit"), "click", {});

	QUnit.equal(submit, 2, "Submit prevented");
	QUnit.equal(click, 1, "Clicked");

	st.unbinder("outer", "submit", submitf);
	st.unbinder("inner", "click", clickf);
});

QUnit.test("Click Checkboxes", function () {
	var checkbox = 0;

	st.binder("checkbox", "change", function (ev) {
		checkbox++;
	});

	st.g("checkbox")
		.checked = false;

	syn.trigger(st.g("checkbox"), "click", {});

	QUnit.ok(st.g("checkbox")
		.checked, "click checks on");

	syn.trigger(st.g("checkbox"), "click", {});

	QUnit.ok(!st.g("checkbox")
		.checked, "click checks off");
});

QUnit.test("Checkbox is checked on click", function () {
	st.g("checkbox")
		.checked = false;

	st.binder("checkbox", "click", function (ev) {
		QUnit.ok(st.g("checkbox")
			.checked, "check is on during click");
	});

	syn.trigger(st.g("checkbox"), "click", {});
});

QUnit.test("Click a button that is type=button should not trigger form submit", function(){
	var timeout = setTimeout(function(){
		ok(true, "Form was not submitted");
		start();
	});
	st.binder("outer", "submit", function(ev){
		clearTimeout(timeout);
		ev.preventDefault();
	});

	syn.trigger(st.g("button"), "click", {});
	stop();
});

QUnit.test("Select is changed on click", function () {

	var select1 = 0,
		select2 = 0;

	st.g("qunit-fixture")
		.innerHTML =
			'<select id="s1">'+
				'<option id="s1o1">One</option>'+
				'<option id="s1o2">Two</option>'+
			'</select>'+
			'<select id="s2">'+
				'<option id="s2o1">One</option>'+
				'<option id="s2o2">Two</option>'+
			'</select>';

	st.bind(st.g("s1"), "change", function (ev) {
		select1++;
	});
	st.bind(st.g("s2"), "change", function (ev) {
		select2++;
	});

	syn.trigger(st.g('s1o2'), 'click', {});
	QUnit.equal(st.g('s1')
		.selectedIndex, 1, "select worked");
	QUnit.equal(select1, 1, "change event");
	syn.trigger(st.g('s2o2'), 'click', {});
	QUnit.equal(st.g('s2')
		.selectedIndex, 1, "select worked");
	QUnit.equal(select2, 1, "change event");
	syn.trigger(st.g('s1o1'), 'click', {});
	QUnit.equal(st.g('s1')
		.selectedIndex, 0, "select worked");
	QUnit.equal(select1, 2, "change event");
});

QUnit.test("Select is change on click (iframe)", function () {
	stop();

	locate("test/pages/page3.html",function(page3){
		page3 = page3.replace(".js","");

		var iframe = document.createElement('iframe');

		st.bind(iframe, "load", async function () {
			var iget = function (id) {
				return iframe.contentWindow.document.getElementById(id);
			};
			st.bind(iget('select1'), "change", function () {
				QUnit.ok(true, "select worked");
			});
			st.bind(iget('select2'), "change", function () {
				QUnit.ok(true, "select worked");
			});

			await syn.click(iget('s1o2') );


			QUnit.start();
			await syn.click(iget('s2o2'));
			await syn.click(iget('s1o1'));


		});

		iframe.src = page3;

		st.g("qunit-fixture")
			.appendChild(iframe);
	});
});

QUnit.test("Click Radio Buttons", function () {

	var radio1 = 0,
		radio2 = 0;

	st.g("radio1")
		.checked = false;
	//make sure changes are called
	st.bind(st.g("radio1"), "change", function (ev) {
		radio1++;
	});
	st.bind(st.g("radio2"), "change", function (ev) {
		radio2++;
	});

	syn.trigger(st.g("radio1"), "click", {});

	QUnit.equal(radio1, 1, "radio event");
	QUnit.ok(st.g("radio1")
		.checked, "radio checked");

	syn.trigger(st.g("radio2"), "click", {});

	QUnit.equal(radio2, 1, "radio event");
	QUnit.ok(st.g("radio2")
		.checked, "radio checked");

	QUnit.ok(!st.g("radio1")
		.checked, "radio unchecked");

});

// this test can be flaky ... I think we need methods like .click to wait on the page loading
QUnit.test("Click! Event Order", 1, async function () {
	var order = 0;
	st.g("qunit-fixture")
		.innerHTML = "<input id='focusme'/>";

	var actualOrder = [];
	var expectedOrder = ["mousedown","focus","mouseup","click"];
	if(syn.skipFocusTests) {
		expectedOrder = ["mousedown","mouseup","click"];
	}
	function pushType(event) {
		actualOrder.push(event.type);
	}
	st.binder("focusme", "mousedown", pushType);

	if (!syn.skipFocusTests) {
		st.binder("focusme", "focus", pushType);
	}

	st.binder("focusme", "mouseup", pushType);
	st.binder("focusme", "click", pushType);

	stop();
	await syn.click("#focusme", {});

	QUnit.deepEqual(actualOrder, expectedOrder);
	QUnit.start();

});

QUnit.test("Click! Pointer Event Order", syn.support.pointerEvents ? 3 : 0, async function () {
	var order = 0;
	st.g("qunit-fixture").innerHTML = "<input id='pointerTarget'/>";

	if(syn.support.pointerEvents){ // skips test on browsers that do not support pointer events

		st.binder("pointerTarget", "pointerdown", function () {
			QUnit.equal(++order, 1, "pointerdown");
		});

		st.binder("pointerTarget", "pointerup", function () {
			QUnit.equal(++order, 2, "pointerup");
		});

		st.binder("pointerTarget", "click", function (ev) {
			QUnit.equal(++order, 3, "click");
			if (ev.preventDefault) {
				ev.preventDefault();
			}
			ev.returnValue = false;
		});
	}

	stop();
	await syn.click("#pointerTarget", {});

	QUnit.start();
});

QUnit.test("Click! Touch Event Order", syn.support.touchEvents ? 3 : 0, async function () {
	var order = 0;
	st.g("qunit-fixture").innerHTML = "<input id='touchTarget'/>";

	if(syn.support.touchEvents){ // skips test on browsers that do not support touch events

		st.binder("touchTarget", "touchstart", function () {
			QUnit.equal(++order, 1, "touchstart");
		});

		st.binder("touchTarget", "touchend", function () {
			QUnit.equal(++order, 2, "touchend");
		});

		st.binder("touchTarget", "click", function (ev) {
			QUnit.equal(++order, 3, "click");
			if (ev.preventDefault) {
				ev.preventDefault();
			}
			ev.returnValue = false;
		});
	}

	stop();
	syn.click("#touchTarget", {});

	QUnit.start();
});

QUnit.test("Click Anchor Runs HREF JavaScript", function () {
	stop();
	syn.trigger(st.g("jsHref"), "click", {});
	// Firefox triggers href javascript async so need to
	// wait for it to complete.
	setTimeout(function () {
		QUnit.equal(didSomething, 1, "link href JS run");
		QUnit.start();
	}, 50);
});

QUnit.test("Click! Anchor has href", async function () {
	stop();
	st.binder("jsHrefHash", "click", function (ev) {
		var target = ev.target || ev.srcElement;
		QUnit.ok(target.href.indexOf("#aHash") > -1, "got href");
	});

	await syn.click("#jsHrefHash", {});

	QUnit.equal(window.location.hash, "#aHash", "hash set ...");
	QUnit.start();
	window.location.hash = "";
});

QUnit.test("Click! Anchor Focuses", syn.skipFocusTests ? 1 : 2, async function () {
	st.g("qunit-fixture")
		.innerHTML = "<a href='#abc' id='focusme'>I am visible</a>";

	if (!syn.skipFocusTests) {
		st.binder("focusme", "focus", function (ev) {
			QUnit.ok(true, "focused");
		});
	}

	st.binder("focusme", "click", function (ev) {
		QUnit.ok(true, "clicked");
		st.g("qunit-fixture")
			.innerHTML = "";
		if (ev.preventDefault) {
			ev.preventDefault();
		}
		ev.returnValue = false;
		return false;
	});
	stop();
	//need to give browsers a second to show element

	await syn.click("#focusme", {});

	QUnit.start();

});

if (!syn.skipFocusTests) {
	QUnit.test("Click away causes Blur Change", async function() {
		st.g("qunit-fixture")
			.innerHTML = "<input id='one'/><input id='two'/>";

		var change = 0,
			blur = 0;

		st.binder("one", "blur", function () {
			blur++;
		});
		st.binder("one", "change", function () {
			change++;
		});

		stop();
		await syn.click("#one", {});
		await syn.key("#one","a");
		await syn.click("#two", {});

		QUnit.start();
		QUnit.equal(change, 1, "Change called once");
		QUnit.equal(blur, 1, "Blur called once");

	});

	QUnit.test("Click HTML causes blur  change", async function () {
		st.g("qunit-fixture")
			.innerHTML = "<input id='one'/><input id='two'/>";

		var change = 0;
		st.binder("one", "change", function () {
			change++;
		});

		stop();
		await syn.click("#one", {});
		await syn.key("#one","a");
		await syn.click(document.documentElement, {});
		QUnit.start();
		QUnit.equal(change, 1, "Change called once");
	});
}
QUnit.test("Right Click", async function () {
	st.g("qunit-fixture").innerHTML = "<div id='one'>right click me</div>";
	stop();
	var context = 0;
	st.binder("one", "contextmenu", function () {
		context++;
	});

	await syn.rightClick("#one", {});

	if (syn.mouse.browser.contextmenu) {
		QUnit.equal(1, context, "context was called");
	} else {
		QUnit.ok(true, "context shouldn't be called in this browser");
	}
	QUnit.start();
});


QUnit.test("Right Click Issues PointerEvents", syn.support.pointerEvents ? 2 : 0, async function () {
	var order = 1;
	st.g("qunit-fixture").innerHTML = "<input id='pointerTarget'/>";

	if(syn.support.pointerEvents){ // skips test on browsers that do not support pointer events
		st.binder("pointerTarget", "pointerdown", function (ev) {
			QUnit.equal(ev.button, 2, "pointerdown");
		});
	}

	if(syn.support.pointerEvents){ // skips test on browsers that do not support pointer events
		st.binder("pointerTarget", "pointerup", function (ev) {
			QUnit.equal(ev.button, 2, "pointerup");
		});
	}
	stop();
	await syn.rightClick("#pointerTarget", {});
	QUnit.start();
});


QUnit.test("Double Click", async function () {
	st.g("qunit-fixture")
		.innerHTML = "<div id='dblclickme'>double click me</div>";
	stop();
	var eventSequence = [];
	st.binder("dblclickme", "dblclick", function () {
		eventSequence.push('dblclick');
	});
	st.binder("dblclickme", "click", function () {
		eventSequence.push('click');
	});

	await syn.dblclick("#dblclickme", {});

	QUnit.equal(eventSequence.join(', '), 'click, click, dblclick', 'expected event sequence for doubleclick');
	QUnit.start();
});



//check for IE - opening a popup with firefox breaks for CI
var htmlElement = document.getElementsByTagName("html")[0],
	htmlClassName = htmlElement.className;
if(htmlClassName.indexOf('ie9') > -1){
	// tests against IE9's weirdness where popup windows don't have dispatchEvent
	QUnit.test("h3 click in popup", 1, function () {
		st.g("qunit-fixture")
			.innerHTML = "";

		stop();
		/*var page1 = st.rootJoin("funcunit/syn/test/qunit/h3.html"),
		iframe = document.createElement('iframe'),
		calls = 0;

	st.bind(iframe,"load",function(){
		var el = iframe.contentWindow.document.getElementById('strange')
		st.bind(el,"click",function(){
			QUnit.ok(true, "h3 was clicked");

		});
		syn.click(el ,{}, function(){
			QUnit.start();
		})



	});
	iframe.src = page1
	st.g("qunit-fixture").appendChild(iframe);*/

		locate("test/pages/h3.html",function(path){
			path = path.replace(".js","");

			var popup = window.open(path, "synthing");

			var runTest = async function(el){
				st.bind(el, "click", function () {
					QUnit.ok(true, "h3 was clicked");
				});
				await syn.click(el, {});

				QUnit.start();
				popup.close();
			};
			var ready = function(){
				var el = popup.document.getElementById('strange');
				if(el) {
					runTest(el);
				} else {
					setTimeout(ready,100);
				}
			};

			setTimeout(ready, 100);
		});
	});
}

QUnit.test("focus on an element then another in another page", function () {
	stop();
	locate("test/pages/page1.html", function(page1){

		locate("test/pages/page2.html", function(page2){
			var iframe = document.createElement('iframe'),
				calls = 0;

			st.bind(iframe, "load", async function () {
				if (calls === 0) {
					await syn.click(iframe.contentWindow.document.getElementById("first"), {});
					iframe.contentWindow.location = page2;
					calls++;
				} else {
					await syn.click(iframe.contentWindow.document.getElementById("second"), {});

					QUnit.ok(iframe.contentWindow.document.getElementById("second") === iframe.contentWindow.document.activeElement);
					QUnit.start();
				}
			});
			iframe.src = page1;
			st.g("qunit-fixture")
				.appendChild(iframe);
		});
	});


});
