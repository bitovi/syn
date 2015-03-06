/* global st */
var syn = require('syn');
var locate = require('test/locate_test');
var QUnit = require("steal-qunit");
var st = require("test/helpers_test");

QUnit.module("synthetic/key", {
	setup: function () {
		st.g("qunit-fixture")
			.innerHTML = "<form id='outer'>" +
			"<div id='inner'>" +
			"<input type='input' id='key' value=''/>" +
			"<a href='#abc' id='focusLink'>click me</a>" +
			"<textarea id='synTextArea'></textarea>" +
			"<div id='editable' contenteditable='true'></div>" +
			"</div></form>";
	},

	teardown: function () {
		st.g("qunit-fixture")
			.innerHTML = '';
	}
});
QUnit.test("Key Characters", function () {
	st.g("key")
		.value = "";
	syn.key("key", "a");
	equal(st.g("key")
		.value, "a", "a written");

	st.g("key")
		.value = "";
	syn.key("key", "A");
	equal(st.g("key")
		.value, "A", "A written");

	st.g("key")
		.value = "";
	syn.key("key", "1");
	equal(st.g("key")
		.value, "1", "1 written");
});

QUnit.test("Key \\r Submits Forms", 2, function () {
	var submit = 0,
		change = 0;
	st.binder("key", "change", function (ev) {
		change++;
		if (ev.preventDefault) {
			ev.preventDefault();
		}
		ev.returnValue = false;
		return false;
	});
	st.binder("outer", "submit", function (ev) {
		submit++;
		if (ev.preventDefault) {
			ev.preventDefault();
		}
		ev.returnValue = false;
		return false;
	});
	stop();
	syn.key("key", "\r", function () {
		equal(submit, 1, "submit on keypress");
		equal(change, 1, "submit on keypress");
		start();
	});
});

QUnit.test("Key \\r Clicks Links", 1, function () {
	var clicked = 0;
	st.binder("focusLink", "click", function (ev) {
		clicked++;
		if (ev.preventDefault) {
			ev.preventDefault();
		}
		ev.returnValue = false;
		return false;
	});
	stop();
	syn.key("focusLink", "\r", function () {
		equal(clicked, 1, "clicked");
		start();
	});
});

QUnit.test("Key Event Order", 1, function () {
	var order = [],
		recorder = function (ev) {
			order.push(ev.type);
		};

	st.binder("key", "keydown", recorder);
	st.binder("key", "keypress", recorder);
	st.binder("key", "input", recorder);
	st.binder("key", "keyup", recorder);
	stop();
	syn.key("key", "B", function () {
		var expected = ["keydown", "keypress", "keyup"];
		if (syn.support.oninput) {
			expected.splice(2, 0, "input");
		}

		deepEqual(order, expected, "Key order is correct");
		start();
	});
});

QUnit.test("Key \\r Adds Newline in Textarea", function () {
	st.g('synTextArea')
		.value = "";
	stop();
	syn.type("synTextArea", "ab\rcd", function () {
		equal(st.g('synTextArea')
			.value.replace("\r", ""), "ab\ncd", "typed new line correctly");
		start();
	});
});

QUnit.test("Key \\b", function () {
	st.g("key")
		.value = "";
	stop();
	syn.type("key", "abc", function () {
		equal(st.g("key")
			.value, "abc", "abc written");
		syn.key("key", "\b");
		equal(st.g("key")
			.value, "ab", "ab written (key deleted)");
		start();
	});
});

//tests when the key is inserted
QUnit.test("Key Character Order", function () {

	var upVal,
		pressVal,
		downVal;
	st.binder("key", "keyup", function () {
		upVal = st.g("key")
			.value;
	});
	st.binder("key", "keypress", function () {
		pressVal = st.g("key")
			.value;

	});
	st.binder("key", "keydown", function () {
		downVal = st.g("key")
			.value;
	});
	stop();
	syn.key("key", "J", function () {
		equal(upVal, "J", "Up Typing works");
		equal(pressVal, "", "Press Typing works");
		equal(downVal, "", "Down Typing works");
		start();
	});

});

QUnit.test("page down, page up, home, end", function () {
	st.g("qunit-fixture")
		.innerHTML =
		"<div id='scrolldiv' style='width:100px;height:200px;overflow-y:scroll;' tabindex='0'>" +
		"<div id='innerdiv' style='height:1000px;'><a href='javascript://'>Scroll on me</a></div></div>";

	//reset the scroll top	
	st.g("scrolldiv")
		.scrollTop = 0;

	//list of keys to press and what to test after the scroll event
	var keyTest = {
		"page-down": function () {
			ok(st.g("scrolldiv")
				.scrollTop > 10, "Moved down");
		},
		"page-up": function () {
			ok(st.g("scrolldiv")
				.scrollTop === 0, "Moved back up (page-up)");
		},
		"end": function () {
			var sd = st.g("scrolldiv");
			ok(sd.scrollTop === sd.scrollHeight - sd.clientHeight, "Moved to the end");
		},
		"home": function () {
			ok(st.g("scrolldiv")
				.scrollTop === 0, "Moved back up (home)");
		}
	},
		order = [],
		i = 0,
		runNext = function () {
			var name = order[i];
			if (!name) {
				start();
				return;
			}
			syn.key("scrolldiv", name);
		};
	for (var name in keyTest) {
		if (keyTest.hasOwnProperty(name)) {
			order.push(name);
		}
	}

	st.bind(st.g("scrolldiv"), "scroll", function (ev) {
		keyTest[order[i]]();
		i++;
		setTimeout(runNext, 1);

	});
	stop();

	st.g("scrolldiv")
		.focus();
	runNext();

});
QUnit.test("range tests", function () {
	var selectText = function (el, start, end) {
		if (el.setSelectionRange) {
			if (!end) {
				el.focus();
				el.setSelectionRange(start, start);
			} else {
				el.selectionStart = start;
				el.selectionEnd = end;
			}
		} else if (el.createTextRange) {
			//el.focus();
			var r = el.createTextRange();
			r.moveStart('character', start);
			end = end || start;
			r.moveEnd('character', end - el.value.length);

			r.select();
		}
	};
	st.g("qunit-fixture")
		.innerHTML = "<form id='outer'><div id='inner'><input type='input' id='key' value=''/></div></form>" +
		"<textarea id='mytextarea' />";

	var keyEl = st.g("key");
	var textAreaEl = st.g("mytextarea");

	// test delete range
	keyEl.value = "012345";
	selectText(keyEl, 1, 3);

	syn.key("key", "delete");

	equal(keyEl.value, "0345", "delete range works");

	// test delete key
	keyEl.value = "012345";
	selectText(keyEl, 2);

	syn.key("key", "delete");
	equal(keyEl.value, "01345", "delete works");

	// test character range
	keyEl.value = "123456";
	selectText(keyEl, 1, 3);

	syn.key("key", "a");
	equal(keyEl.value, "1a456", "character range works");

	// test character key
	keyEl.value = "123456";
	selectText(keyEl, 2);

	syn.key("key", "a");
	equal(keyEl.value, "12a3456", "character insertion works");

	// test backspace range
	keyEl.value = "123456";
	selectText(keyEl, 1, 3);
	syn.key("key", "\b");
	equal(keyEl.value, "1456", "backspace range works");

	// test backspace key
	keyEl.value = "123456";
	selectText(keyEl, 2);
	syn.key("key", "\b");
	equal(keyEl.value, "13456", "backspace works");

	// test textarea ranges
	textAreaEl.value = "123456";
	selectText(textAreaEl, 1, 3);

	syn.key(textAreaEl, "delete");
	equal(textAreaEl.value, "1456", "delete range works in a textarea");

	// test textarea ranges
	textAreaEl.value = "123456";
	selectText(textAreaEl, 1, 3);
	syn.key(textAreaEl, "a");
	equal(textAreaEl.value, "1a456", "character range works in a textarea");

	// test textarea ranges
	textAreaEl.value = "123456";
	selectText(textAreaEl, 1, 3);
	syn.key(textAreaEl, "\b");
	equal(textAreaEl.value, "1456", "backspace range works in a textarea");

	// test textarea ranges
	textAreaEl.value = "123456";
	selectText(textAreaEl, 1, 3);
	syn.key(textAreaEl, "\r");

	equal(textAreaEl.value.replace("\r", ""), "1\n456", "return range works in a textarea");

	//st.g("qunit-fixture").innerHTML = "";

});

QUnit.test("Type with tabs", function () {
	st.g("qunit-fixture")
		.innerHTML =
		"<input tabindex='3' id='third'/>" +
		"<a tabindex='1' id='first' href='javascript://'>First</a>" +
		"<input tabindex='2' id='second'/>" +
		"<input tabindex='4' id='fourth'/>";
	st.g('first')
		.focus();

	var clicked = 0;
	st.binder('first', 'click', function () {
		clicked++;
	});
	stop();
	//give ie a second to focus
	setTimeout(function () {
		syn.type('first', '\r\tSecond\tThird\tFourth', function () {
			equal(clicked, 1, "clickd first");
			equal(st.g('second')
				.value, "Second", "moved to second");
			equal(st.g('third')
				.value, "Third", "moved to Third");
			equal(st.g('fourth')
				.value, "Fourth", "moved to Fourth");
			start();
		});
	}, 1);
});

QUnit.test("Type with shift tabs", function () {
	st.g("qunit-fixture")
		.innerHTML =
		"<input tabindex='3' id='third'/>" +
		"<a tabindex='1' id='first' href='javascript://'>First</a>" +
		"<input tabindex='2' id='second'/>" +
		"<input tabindex='4' id='fourth'/>";
	st.g('first')
		.focus();

	var clicked = 0;
	st.binder('first', 'click', function () {
		clicked++;
	});
	stop();
	//give ie a second to focus
	setTimeout(function () {
		syn.type('fourth', '[shift]4\t3\t2\t\r[shift-up]', function () {
			equal(clicked, 1, "clickd first");
			equal(st.g('second')
				.value, "2", "moved to second");
			equal(st.g('third')
				.value, "3", "moved to Third");
			equal(st.g('fourth')
				.value, "4", "moved to Fourth");
			start();
		});
	}, 1);
});

QUnit.test("Type left and right", function () {
	stop();
	syn.type('key', "012345678[left][left][left]\b", function () {
		equal(st.g('key')
			.value, "01234678", "left works");

		syn.type('key', "[right][right]a", function () {
			equal(st.g('key')
				.value, "0123467a8", "right works");
			start();
		});

	});

});
QUnit.test("Type left and delete", function () {
	stop();
	syn.type('key', "123[left][delete]", function () {
		equal(st.g('key')
			.value, "12", "left delete works");
		start();
	});

});
QUnit.test("Typing Shift", function () {
	stop();

	var shift = false;
	st.binder('key', 'keypress', function (ev) {
		shift = ev.shiftKey;
	});
	syn.type('key', "[shift]A[shift-up]", function () {
		ok(shift, "Shift key on");
		start();
	});
});
QUnit.test("Typing Shift then clicking", function () {
	stop();

	var shift = false;
	st.binder('inner', 'click', function (ev) {
		shift = ev.shiftKey;
	});
	syn.type('key', "[shift]A")
		.click('inner', {})
		.type('key', "[shift-up]", function () {
			ok(shift, "Shift key on click");
			start();
		});
});

QUnit.test("Typing Shift Left and Right", function () {
	stop();

	syn.type('key', "012345678[shift][left][left][left][shift-up]\b[left]\b", function () {
		equal(st.g('key')
			.value, "01235", "shift left works");

		syn.type('key', "[left][left][shift][right][right]\b[shift-up]", function () {

			equal(st.g('key')
				.value, "015", "shift right works");
			start();
		});

	});
});

QUnit.test("shift characters", function () {
	stop();
	syn.type('key', "@", function () {
		equal(st.g('key')
			.value, "@", "@ character works");
		start();
	});
});

test("number key codes", 2, function () {
	stop();

	st.binder("key", "keydown", function (ev) {
		ok(ev.keyCode === 40, "key codes are numbers");
		ok(ev.which === ev.keyCode, "which is normalized");
		start();
	});

	syn.type('key', "[down]", function () {});
});

QUnit.test("Key codes of like-keys", function () {
	stop();

	var keys = {
		"subtract": 109,
		"dash": 189,
		"divide": 111,
		"forward-slash": 191,
		"decimal": 110,
		"period": 190
	};

	var cnt = 0;
	var done = function () {
		cnt++;
		if (cnt === 6) {
			start();
		}
	};

	var testKeyCode = function (key, code) {
		var f;
		st.binder("key", "keydown", f = function (ev) {
			st.unbinder("key", "keydown", f);
			ok(ev.keyCode === code);
			ok(ev.which === ev.keyCode);
			done();
		});
		syn.type("key", "[" + key + "]");
	};

	for (var key in keys) {
		testKeyCode(key, keys[key]);
	}
});

QUnit.test("focus moves on keydown to another element", function () {
	stop();
	st.binder("key", "keydown", function (ev) {
		st.g('synTextArea')
			.focus();

	});
	st.binder("synTextArea", "keypress", function (ev) {
		ok(true, "keypress called");
		start();
	});
	syn.type('key', "a", function () {});
});

QUnit.test("typing in a number works", function () {
	stop();
	syn.type('key', 9999, function () {
		equal(st.g('key')
			.value, "9999", "typing in numbers works");
		start();
	});
});

QUnit.test("typing in a contenteditable works", function () {
	stop();
	syn.type("editable", "hello world", function () {
		var editable = st.g("editable");
		var text = editable.textContent || editable.innerText;
		equal(text, "hello world", "Content editable was edited");
		start();
	});
});
