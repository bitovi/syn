/* global st */

steal("src/synthetic.js", function (Syn) {
	var didSomething = 0;
	window.doSomething = function () {
		++didSomething;
	};

	module("synthetic/mouse", {
		setup: function () {
			st.g("qunit-test-area")
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

	test("Syn basics", function () {

		ok(Syn, "Syn exists");

		st.g("qunit-test-area")
			.innerHTML = "<div id='outer'><div id='inner'></div></div>";
		var mouseover = 0,
			mouseoverf = function () {
				mouseover++;
			};
		st.bind(st.g("outer"), "mouseover", mouseoverf);
		Syn("mouseover", st.g("inner"));

		st.unbinder("outer", "mouseover", mouseoverf);
		equal(mouseover, 1, "Mouseover");
		Syn("mouseover", 'inner', {});

		equal(mouseover, 1, "Mouseover on no event handlers");
		st.g("qunit-test-area")
			.innerHTML = "";

	});

	test("Click Forms", function () {
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
		Syn.trigger(st.g("submit"), "click", {});
		Syn("submit", "outer", {});

		equal(submit, 2, "Click on submit");

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

		Syn.trigger(st.g("submit"), "click", {});

		equal(submit, 2, "Submit prevented");
		equal(click, 1, "Clicked");

		st.unbinder("outer", "submit", submitf);
		st.unbinder("inner", "click", clickf);
	});
	test("Click Checkboxes", function () {
		var checkbox = 0;

		st.binder("checkbox", "change", function (ev) {
			checkbox++;
		});

		st.g("checkbox")
			.checked = false;

		Syn.trigger(st.g("checkbox"), "click", {});

		ok(st.g("checkbox")
			.checked, "click checks on");

		Syn.trigger(st.g("checkbox"), "click", {});

		ok(!st.g("checkbox")
			.checked, "click checks off");
	});

	test("Checkbox is checked on click", function () {
		st.g("checkbox")
			.checked = false;

		st.binder("checkbox", "click", function (ev) {
			ok(st.g("checkbox")
				.checked, "check is on during click");
		});

		Syn.trigger(st.g("checkbox"), "click", {});
	});

	test("Select is changed on click", function () {

		var select1 = 0,
			select2 = 0;

		st.g("qunit-test-area")
			.innerHTML = '<select id="s1"><option id="s1o1">One</option><option id="s1o2">Two</option></select><select id="s2"><option id="s2o1">One</option><option id="s2o2">Two</option></select>';

		st.bind(st.g("s1"), "change", function (ev) {
			select1++;
		});
		st.bind(st.g("s2"), "change", function (ev) {
			select2++;
		});

		Syn.trigger(st.g('s1o2'), 'click', {});
		equal(st.g('s1')
			.selectedIndex, 1, "select worked");
		equal(select1, 1, "change event");
		Syn.trigger(st.g('s2o2'), 'click', {});
		equal(st.g('s2')
			.selectedIndex, 1, "select worked");
		equal(select2, 1, "change event");
		Syn.trigger(st.g('s1o1'), 'click', {});
		equal(st.g('s1')
			.selectedIndex, 0, "select worked");
		equal(select1, 2, "change event");
	});

	test("Select is change on click (iframe)", function () {
		stop();
		var rootJoin = st.rootJoin;

		var page3 = rootJoin("test/qunit/page3.html"),
			iframe = document.createElement('iframe');

		st.bind(iframe, "load", function () {
			var iget = function (id) {
				return iframe.contentWindow.document.getElementById(id);
			};
			st.bind(iget('select1'), "change", function () {
				ok(true, "select worked");
			});
			st.bind(iget('select2'), "change", function () {
				ok(true, "select worked");
			});

			Syn.click(iget('s1o2'), {}, function () {
				start();
				Syn.click(iget('s2o2'));
				Syn.click(iget('s1o1'));
			});

		});

		iframe.src = page3;

		st.g("qunit-test-area")
			.appendChild(iframe);

	});

	test("Click Radio Buttons", function () {

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

		Syn.trigger(st.g("radio1"), "click", {});

		equal(radio1, 1, "radio event");
		ok(st.g("radio1")
			.checked, "radio checked");

		Syn.trigger(st.g("radio2"), "click", {});

		equal(radio2, 1, "radio event");
		ok(st.g("radio2")
			.checked, "radio checked");

		ok(!st.g("radio1")
			.checked, "radio unchecked");

	});

	test("Click! Event Order", Syn.skipFocusTests ? 3 : 4, function () {
		var order = 0;
		st.g("qunit-test-area")
			.innerHTML = "<input id='focusme'/>";

		st.binder("focusme", "mousedown", function () {
			equal(++order, 1, "mousedown");
		});

		if (!Syn.skipFocusTests) {
			st.binder("focusme", "focus", function () {
				equal(++order, 2, "focus");
			});
		}

		st.binder("focusme", "mouseup", function () {
			equal(++order, Syn.skipFocusTests ? 2 : 3, "mouseup");
		});
		st.binder("focusme", "click", function (ev) {
			equal(++order, Syn.skipFocusTests ? 3 : 4, "click");
			if (ev.preventDefault) {
				ev.preventDefault();
			}
			ev.returnValue = false;
		});

		stop();
		Syn.click("focusme", {}, function () {
			start();
		});

	});

	test("Click Anchor Runs HREF JavaScript", function () {
		stop();
		Syn.trigger(st.g("jsHref"), "click", {});
		// Firefox triggers href javascript async so need to
		// wait for it to complete.
		setTimeout(function () {
			equal(didSomething, 1, "link href JS run");
			start();
		}, 50);
	});

	test("Click! Anchor has href", function () {
		stop();
		st.binder("jsHrefHash", "click", function (ev) {
			var target = ev.target || ev.srcElement;
			ok(target.href.indexOf("#aHash") > -1, "got href");
		});

		Syn.click("jsHrefHash", {}, function () {
			equal(window.location.hash, "#aHash", "hash set ...");
			start();
			window.location.hash = "";
		});
	});

	test("Click! Anchor Focuses", Syn.skipFocusTests ? 1 : 2, function () {
		st.g("qunit-test-area")
			.innerHTML = "<a href='#abc' id='focusme'>I am visible</a>";

		if (!Syn.skipFocusTests) {
			st.binder("focusme", "focus", function (ev) {
				ok(true, "focused");
			});
		}

		st.binder("focusme", "click", function (ev) {
			ok(true, "clicked");
			st.g("qunit-test-area")
				.innerHTML = "";
			if (ev.preventDefault) {
				ev.preventDefault();
			}
			ev.returnValue = false;
			return false;
		});
		stop();
		//need to give browsers a second to show element

		Syn.click("focusme", {}, function () {
			start();
		});

	});

	if (!Syn.skipFocusTests) {
		test("Click away causes Blur Change", function () {
			st.g("qunit-test-area")
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
			Syn.click("one", {})
				.key("a")
				.click("two", {}, function () {
					start();
					equal(change, 1, "Change called once");
					equal(blur, 1, "Blur called once");
				});

		});

		test("Click HTML causes blur  change", function () {
			st.g("qunit-test-area")
				.innerHTML = "<input id='one'/><input id='two'/>";

			var change = 0;
			st.binder("one", "change", function () {
				change++;
			});

			stop();
			Syn.click("one", {})
				.key("a")
				.click(document.documentElement, {}, function () {
					start();
					equal(change, 1, "Change called once");
				});
		});
	}
	test("Right Click", function () {
		st.g("qunit-test-area")
			.innerHTML = "<div id='one'>right click me</div>";
		stop();
		var context = 0;
		st.binder("one", "contextmenu", function () {
			context++;
		});

		Syn.rightClick("one", {}, function () {
			if (Syn.mouse.browser.contextmenu) {
				equal(1, context, "context was called");
			} else {
				ok(true, "context shouldn't be called in this browser");
			}
			start();
		});
	});

	test("Double Click", function () {
		st.g("qunit-test-area")
			.innerHTML = "<div id='dblclickme'>double click me</div>";
		stop();
		var eventSequence = [];
		st.binder("dblclickme", "dblclick", function () {
			eventSequence.push('dblclick');
		});
		st.binder("dblclickme", "click", function () {
			eventSequence.push('click');
		});

		Syn.dblclick("dblclickme", {}, function () {
			equal(eventSequence.join(', '), 'click, click, dblclick', 'expected event sequence for doubleclick');
			start();
		});
	});

	// tests against IE9's weirdness where popup windows don't have dispatchEvent
	test("h3 click in popup", 1, function () {
		st.g("qunit-test-area")
			.innerHTML = "";

		stop();
		/*var page1 = st.rootJoin("funcunit/syn/test/qunit/h3.html"),
		iframe = document.createElement('iframe'),
		calls = 0;

	st.bind(iframe,"load",function(){
		var el = iframe.contentWindow.document.getElementById('strange')
		st.bind(el,"click",function(){
			ok(true, "h3 was clicked");
			
		});
		Syn.click(el ,{}, function(){
			start();
		})

			
			
	});
	iframe.src = page1
	st.g("qunit-test-area").appendChild(iframe);*/

		var path = "test/qunit/h3.html";
		if (typeof steal !== 'undefined') {
			path = st.rootJoin("test/qunit/h3.html");
		}
		var popup = window.open(path, "synthing");

		setTimeout(function () {
			var el = popup.document.getElementById('strange');
			st.bind(el, "click", function () {
				ok(true, "h3 was clicked");
			});
			Syn.click(el, {}, function () {
				start();
				popup.close();
			});

		}, 500);
	});

	test("focus on an element then another in another page", function () {
		stop();

		var page1 = "test/qunit/page1.html",
			page2 = "test/qunit/page2.html";

		if (typeof steal !== 'undefined') {
			page1 = st.rootJoin("test/qunit/page1.html");
			page2 = st.rootJoin("test/qunit/page2.html");
		}

		var iframe = document.createElement('iframe'),
			calls = 0;

		st.bind(iframe, "load", function () {
			if (calls === 0) {
				Syn.click(iframe.contentWindow.document.getElementById("first"), {}, function () {
					iframe.contentWindow.location = page2;
				});
				calls++;
			} else {
				Syn.click(iframe.contentWindow.document.getElementById("second"), {}, function () {
					ok(iframe.contentWindow.document.getElementById("second") === iframe.contentWindow.document.activeElement);
					start();
				});
			}
		});
		iframe.src = page1;
		st.g("qunit-test-area")
			.appendChild(iframe);
	});

});
