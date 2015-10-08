/* global st */

var syn = require('syn');
var locate = require('test/locate_test');
var QUnit = require("steal-qunit");
var st = require("test/helpers_test");


var didSomething = 0;


QUnit.module("syn/mouse", {
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
			"<input type='submit' id='submit'/></div></form>";
	},

	teardown: function () {
		didSomething = 0;
	}
});

QUnit.test("syn basics", function () {

	QUnit.ok(syn, "syn exists");

	st.g("qunit-fixture")
		.innerHTML = "<div id='outer'><div id='inner'></div></div>";
	var mouseover = 0,
		mouseoverf = function () {
			mouseover++;
		};
	st.bind(st.g("outer"), "mouseover", mouseoverf);
	syn("mouseover", st.g("inner"));

	st.unbinder("outer", "mouseover", mouseoverf);
	QUnit.equal(mouseover, 1, "Mouseover");
	syn("mouseover", 'inner', {});

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
	syn("submit", "outer", {});

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

QUnit.test("Select is changed on click", function () {

	var select1 = 0,
		select2 = 0;

	st.g("qunit-fixture")
		.innerHTML = '<select id="s1"><option id="s1o1">One</option><option id="s1o2">Two</option></select><select id="s2"><option id="s2o1">One</option><option id="s2o2">Two</option></select>';

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
	
		st.bind(iframe, "load", function () {
			var iget = function (id) {
				return iframe.contentWindow.document.getElementById(id);
			};
			st.bind(iget('select1'), "change", function () {
				QUnit.ok(true, "select worked");
			});
			st.bind(iget('select2'), "change", function () {
				QUnit.ok(true, "select worked");
			});
	
			syn.click(iget('s1o2'), {}, function () {
				QUnit.start();
				syn.click(iget('s2o2'));
				syn.click(iget('s1o1'));
			});
	
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

QUnit.test("Click! Event Order", syn.skipFocusTests ? 3 : 4, function () {
	var order = 0;
	st.g("qunit-fixture")
		.innerHTML = "<input id='focusme'/>";

	st.binder("focusme", "mousedown", function () {
		QUnit.equal(++order, 1, "mousedown");
	});

	if (!syn.skipFocusTests) {
		st.binder("focusme", "focus", function () {
			QUnit.equal(++order, 2, "focus");
		});
	}

	st.binder("focusme", "mouseup", function () {
		QUnit.equal(++order, syn.skipFocusTests ? 2 : 3, "mouseup");
	});
	st.binder("focusme", "click", function (ev) {
		QUnit.equal(++order, syn.skipFocusTests ? 3 : 4, "click");
		if (ev.preventDefault) {
			ev.preventDefault();
		}
		ev.returnValue = false;
	});

	stop();
	syn.click("focusme", {}, function () {
		QUnit.start();
	});

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

QUnit.test("Click! Anchor has href", function () {
	stop();
	st.binder("jsHrefHash", "click", function (ev) {
		var target = ev.target || ev.srcElement;
		QUnit.ok(target.href.indexOf("#aHash") > -1, "got href");
	});

	syn.click("jsHrefHash", {}, function () {
		QUnit.equal(window.location.hash, "#aHash", "hash set ...");
		QUnit.start();
		window.location.hash = "";
	});
});

QUnit.test("Click! Anchor Focuses", syn.skipFocusTests ? 1 : 2, function () {
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

	syn.click("focusme", {}, function () {
		QUnit.start();
	});

});

if (!syn.skipFocusTests) {
	QUnit.test("Click away causes Blur Change", function () {
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
		syn.click("one", {})
			.key("a")
			.click("two", {}, function () {
				QUnit.start();
				QUnit.equal(change, 1, "Change called once");
				QUnit.equal(blur, 1, "Blur called once");
			});

	});

	QUnit.test("Click HTML causes blur  change", function () {
		st.g("qunit-fixture")
			.innerHTML = "<input id='one'/><input id='two'/>";

		var change = 0;
		st.binder("one", "change", function () {
			change++;
		});

		stop();
		syn.click("one", {})
			.key("a")
			.click(document.documentElement, {}, function () {
				QUnit.start();
				QUnit.equal(change, 1, "Change called once");
			});
	});
}
QUnit.test("Right Click", function () {
	st.g("qunit-fixture")
		.innerHTML = "<div id='one'>right click me</div>";
	stop();
	var context = 0;
	st.binder("one", "contextmenu", function () {
		context++;
	});

	syn.rightClick("one", {}, function () {
		if (syn.mouse.browser.contextmenu) {
			QUnit.equal(1, context, "context was called");
		} else {
			QUnit.ok(true, "context shouldn't be called in this browser");
		}
		QUnit.start();
	});
});

QUnit.test("Double Click", function () {
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

	syn.dblclick("dblclickme", {}, function () {
		QUnit.equal(eventSequence.join(', '), 'click, click, dblclick', 'expected event sequence for doubleclick');
		QUnit.start();
	});
});



//check for IE
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
			
			var runTest = function(el){
				st.bind(el, "click", function () {
					QUnit.ok(true, "h3 was clicked");
				});
				syn.click(el, {}, function () {
					QUnit.start();
					popup.close();
				});
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
			
			st.bind(iframe, "load", function () {
				if (calls === 0) {
					syn.click(iframe.contentWindow.document.getElementById("first"), {}, function () {
						iframe.contentWindow.location = page2;
					});
					calls++;
				} else {
					syn.click(iframe.contentWindow.document.getElementById("second"), {}, function () {
						QUnit.ok(iframe.contentWindow.document.getElementById("second") === iframe.contentWindow.document.activeElement);
						QUnit.start();
					});
				}
			});
			iframe.src = page1;
			st.g("qunit-fixture")
				.appendChild(iframe);
		});
	});
	

});
