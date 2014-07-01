/* global st:true */

steal("src/synthetic.js", function (syn) {

	QUnit.module("syn");

	st = {
		g: function (id) {
			return document.getElementById(id);
		},
		log: function (c) {
			if (st.g("mlog")) {
				st.g("mlog")
					.innerHTML = st.g("mlog")
					.innerHTML + c + "<br/>";
			}
		},
		binder: function (id, ev, f) {
			st.bind(st.g(id), ev, f);
		},
		unbinder: function (id, ev, f) {
			st.unbind(st.g(id), ev, f);
		},
		bind: function (el, ev, f) {
			return el.addEventListener ?
				el.addEventListener(ev, f, false) :
				el.attachEvent("on" + ev, f);
		},
		unbind: function (el, ev, f) {
			return el.addEventListener ?
				el.removeEventListener(ev, f, false) :
				el.detachEvent("on" + ev, f);
		},
		rootJoin: (typeof steal === "undefined" ? function (path) {
				return "../../" + path;
			} :
			function (path) {
				var base = System.baseURL;
				return steal.joinURIs(base, path);
			})
	};

	setTimeout(function supportLog() {
		if (syn.support.ready === 2) {
			for (var name in syn.support) {
				st.log(name + ": " + syn.support[name]);
			}
		} else {
			setTimeout(supportLog, 1);
		}
	}, 1);

	test("Selecting a select element", function () {
		st.g("qunit-test-area")
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
		syn.click(st.g("two"), function () {
			equal(change, 1, "change called once");
			equal(st.g("outer")
				.select.selectedIndex, 1, "Change Selected Index");

			start();
			st.g("qunit-test-area")
				.innerHTML = "";
		});
	});

	test("scrollTop triggers scroll events", function () {
		st.g("qunit-test-area")
			.innerHTML = "<div id='scroller' style='height:100px;width: 100px;overflow:auto'>" +
			"<div style='height: 200px; width: 100%'>text" +
			"</div>" +
			"</div>";

		st.binder("scroller", "scroll", function (ev) {
			ok(true, "scrolling created just by changing ScrollTop");
			st.g("qunit-test-area")
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
		test("focus triggers focus events", function () {
			st.g("qunit-test-area")
				.innerHTML = "<input type='text' id='focusme'/>";

			st.binder("focusme", "focus", function (ev) {
				ok(true, "focus creates event");
				st.g("qunit-test-area")
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

	test("syn.support effect on scroll position, #30", function () {
		stop();

		// Make sure the browser hasn't scrolled on account of feature detection.
		// We're going to do this by opening a new page with a lot of text that might
		// cause scroll.
		var iframe = document.createElement("iframe");
		iframe.setAttribute("height", "100");
		var scroll30 = st.rootJoin("test/qunit/scroll_30/index.html");
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

		st.g("qunit-test-area")
			.appendChild(iframe);
	});

	test("syn.schedule gets called when syn.delay is used", function () {
		stop();

		var iframe = document.createElement("iframe");
		iframe.src = st.rootJoin("test/qunit/syn.schedule.html");
		window.synSchedule = function (fn, ms) {
			// fn should be a function
			equal(typeof fn, "function");
			// ms is a Number
			equal(typeof ms, "number");

			start();
		};

		st.g("qunit-test-area")
			.appendChild(iframe);
	});

});
