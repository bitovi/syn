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

QUnit.test("Key \\r Submits Forms", 2, async function () {
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


	await syn.key("key", "\r");

	equal(submit, 1, "submit on keypress");
	equal(change, 1, "submit on keypress");
	start();
});

QUnit.test("Key \\r Clicks Links", 1, async function () {
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
	await syn.key("focusLink", "\r");

	equal(clicked, 1, "clicked");
	start();
});

QUnit.test("Key Event Order", 1, async function () {
	var order = [],
		recorder = function (ev) {
			order.push(ev.type);
		};

	st.binder("key", "keydown", recorder);
	st.binder("key", "keypress", recorder);
	st.binder("key", "input", recorder);
	st.binder("key", "keyup", recorder);
	stop();
	await syn.key("key", "B");

	var expected = ["keydown", "keypress", "keyup"];
	if (syn.support.oninput) {
		expected.splice(2, 0, "input");
	}

	deepEqual(order, expected, "Key order is correct");
	start();

});

QUnit.test("Key \\r Adds Newline in Textarea", async function () {
	st.g('synTextArea')
		.value = "";
	stop();

	await syn.type("synTextArea", "ab\rcd");
	console.log("After")
	equal(st.g('synTextArea')
		.value.replace("\r", ""), "ab\ncd", "typed new line correctly");
	start();
});

QUnit.test("Key \\b", async function () {
	st.g("key")
		.value = "";
	stop();
	await syn.type("key", "abc");

	equal(st.g("key")
		.value, "abc", "abc written");
	syn.key("key", "\b");
	equal(st.g("key")
		.value, "ab", "ab written (key deleted)");
	start();
});

//tests when the key is inserted
QUnit.test("Key Character Order", async function () {

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
	await syn.key("key", "J");


	equal(upVal, "J", "Up Typing works");
	equal(pressVal, "", "Press Typing works");
	equal(downVal, "", "Down Typing works");
	start();

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

QUnit.test("Type with tabs", function async () {
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
	setTimeout(async function () {
		await syn.type('first', '\r\tSecond\tThird\tFourth');

		equal(clicked, 1, "clicked first");
		equal(st.g('second')
			.value, "Second", "moved to second");
		equal(st.g('third')
			.value, "Third", "moved to Third");
		equal(st.g('fourth')
			.value, "Fourth", "moved to Fourth");
		start();
	}, 1);
});

QUnit.test("Type left and right", async function () {
	stop();
	await syn.type('key', "012345678[left][left][left]\b");

	equal(st.g('key')
		.value, "01234678", "left works");

	await syn.type('key', "[right][right]a");

	equal(st.g('key')
		.value, "0123467a8", "right works");
	start();

});

QUnit.test("Type left and delete", async function () {
	stop();
	await syn.type('key', "123[left][delete]");

	equal(st.g('key')
		.value, "12", "left delete works");
	start();
});

QUnit.test("Typing Shift", async function () {
	stop();

	var shift = false;
	st.binder('key', 'keypress', function (ev) {
		shift = ev.shiftKey;
	});
	await syn.type('key', "[shift]A[shift-up]");

	ok(shift, "Shift key on");
	start();
});

QUnit.test("Typing Shift then clicking", async function () {
	stop();

	var shift = false;
	st.binder('inner', 'click', function (ev) {
		shift = ev.shiftKey;
	});

	await syn.type('key', "[shift]A")
	await syn.click('inner', {})
	await syn.type('key', "[shift-up]");


	ok(shift, "Shift key on click");
	start();

});

QUnit.test("Typing Shift Left and Right", async function () {
	stop();

	await syn.type('key', "012345678[shift][left][left][left][shift-up]\b[left]\b");

	equal(st.g('key')
		.value, "01235", "shift left works");

	await syn.type('key', "[left][left][shift][right][right]\b[shift-up]");


	equal(st.g('key').value, "015", "shift right works");
	start();


});

QUnit.test("shift characters", async function () {
	stop();

	await syn.type('key', "@");

	equal(st.g('key')
		.value, "@", "@ character works");
	start();
});


QUnit.test("shift keycodes", async function () {
	stop();

	var keyIsDown = false;
	st.binder("key", "keydown", function (ev) {
		keyIsDown = ev.shiftKey;
		ok(ev.shiftKey, "Shift key functioning. Expected: " + ev.which + ", Actual: "+ev.keyCode);
		ok(ev.which === ev.keyCode, "which is normalized");
	});

	var keyIsUp = true;
	st.binder("key", "keyup", function (ev) {
		keyIsUp = ev.shiftKey;
		ok(ev.which === ev.keyCode, "which is normalized");
	});

	await syn.type('key', "[shift]");

	ok(keyIsDown, "shift modifier key pressed successfully");

	await syn.type('key', "[shift-up]");

	ok(!keyIsUp, "shift modifier key released successfully");
	start();
});

QUnit.skip("shift practical test", async function () {
	stop();

	await syn.type('key', "hello [shift]world[shift-up]");

	// TODO: Fix this!
	//equal(key.value, "hello WORLD", "uppercasing successful while using shift");
	equal(true, true, "Test was not run due to known Syn issue : https://github.com/bitovi/syn/issues/97");
	start();
});

QUnit.test("ctrl keycodes", async function () {
	stop();

	var keyIsDown = false;
	st.binder("key", "keydown", function (ev) {
		keyIsDown = ev.ctrlKey;
		ok(ev.ctrlKey, "Ctrl key functioning. Expected: " + ev.which + ", Actual: "+ev.keyCode);
		ok(ev.which === ev.keyCode, "which is normalized");
	});

	var keyIsUp = true;
	st.binder("key", "keyup", function (ev) {
		keyIsUp = ev.ctrlKey;
		ok(ev.which === ev.keyCode, "which is normalized");
	});

	await syn.type('key', "[ctrl]");

	ok(keyIsDown, "ctrl modifier key pressed successfully");

	await syn.type('key', "[ctrl-up]");

	ok(!keyIsUp, "ctrl modifier key released successfully");
	start();
});

QUnit.test("ctrl practical test", async function () {
	stop();

	await syn.type('key', "Hello World");

	ok(key.value, "Hello World");
	equal(key.selectionStart, 11, "pre-selectAll has correct start of 11");
	equal(key.selectionEnd, 11, "pre-selectAll has correct end of 11");

	await syn.type('key', "[ctrl]a[ctrl-up]");

	equal(key.selectionStart, 0, "post-selectAll has correct start of 0");
	equal(key.selectionEnd, 11, "post-selectAll has correct end of 11");
	start();
});

QUnit.test("alt keycodes", async function () {
	stop();

	var keyIsDown = false;
	st.binder("key", "keydown", function (ev) {
		keyIsDown = ev.altKey;
		ok(ev.altKey, "Alt key functioning. Expected: " + ev.which + ", Actual: "+ev.keyCode);
		ok(ev.which === ev.keyCode, "which is normalized");
	});

	var keyIsUp = true;
	st.binder("key", "keyup", async function (ev) {
		keyIsUp = ev.altKey;
		ok(ev.which === ev.keyCode, "which is normalized");
	});

	await syn.type('key', "[alt]");

	ok(keyIsDown, "alt modifier key pressed successfully");

	await syn.type('key', "[alt-up]");

	ok(!keyIsUp, "alt modifier key released successfully");
	start();
});

QUnit.test("meta keycodes", async function () {
	stop();

	var keyIsDown = false;
	st.binder("key", "keydown", function (ev) {
		keyIsDown = ev.metaKey;
		ok(ev.metaKey, "Meta key functioning. Expected: " + ev.which + ", Actual: "+ev.keyCode);
		ok(ev.which === ev.keyCode, "which is normalized");
	});

	var keyIsUp = true;
	st.binder("key", "keyup", function (ev) {
		keyIsUp = ev.metaKey;
		ok(ev.which === ev.keyCode, "which is normalized");
	});

	await syn.type('key', "[meta]");

	ok(keyIsDown, "meta modifier key pressed successfully");

	await syn.type('key', "[meta-up]");

	ok(!keyIsUp, "meta modifier key released successfully");
	start();
});

// INSERT TEST disabled because of https://github.com/bitovi/syn/issues/131

//QUnit.test("insert keycodes", function () {
	//stop();

	//st.binder("key", "keydown", function (ev) {
	//	ok(ev.keyCode === 45, "Received expected insert keycode");
	//	ok(ev.which === ev.keyCode, "which is normalized");
	//	start();
	//});

	//syn.type('key', "[insert]", function () {});
//});

// INSERT TEST disabled because of https://github.com/bitovi/syn/issues/131

//QUnit.test("insert practical test", function () {
//	stop();

//	syn.type('key', "Hello World", function () {
//		equal(key.value, "Hello World", "Verified initial state");
//		selectText(key, 6, 6);

		// TODO: this actually hangs the test. Should I be using something like insert-up ?
		//syn.type('key', "[insert]Universe[insert-up]", function () {
			//equal(key.value, "Hello Universe", "Verified modified state");

//			start();
		//});
//	});
//});

QUnit.test("caps keycodes", async function () {
	stop();

	st.binder("key", "keydown", function (ev) {
		ok(ev.keyCode === 20, "Received expected caps keycode");
		ok(ev.which === ev.keyCode, "which is normalized");
		start();
	});

	await syn.type('key', "[caps]");
});


// CAPS TEST disabled because of https://github.com/bitovi/syn/issues/132

//QUnit.test("caps practical test", function () {
//	stop();

//	syn.type('key', "Hello", function () {
//		equal(key.value, "Hello", "Verified initial state");

		// TODO: this actually hangs the test. Should I be using something like insert-up ?
		//syn.type('key', "[caps] universe[caps]", function () {
		//	equal(key.value, "Hello UNIVERSE", "Verified modified state");

		//	start();
		//});
	//});
//});



test("number key codes", 2, async function () {
	stop();

	st.binder("key", "keydown", function (ev) {
		ok(ev.keyCode === 40, "key codes are numbers");
		ok(ev.which === ev.keyCode, "which is normalized");
		start();
	});

	await syn.type('key', "[down]");
});

QUnit.test("Key codes of like-keys", async function () {
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

	var testKeyCode = async function (key, code) {
		var f;
		st.binder("key", "keydown", f = function (ev) {
			st.unbinder("key", "keydown", f);
			ok(ev.keyCode === code);
			ok(ev.which === ev.keyCode);
			done();
		});
		await syn.type("key", "[" + key + "]");
	};

	for (var key in keys) {
		testKeyCode(key, keys[key]);
	}
});

QUnit.test("focus moves on keydown to another element", async function () {
	stop();
	st.binder("key", "keydown", function (ev) {
		st.g('synTextArea')
			.focus();

	});
	st.binder("synTextArea", "keypress", function (ev) {
		ok(true, "keypress called");
		start();
	});
	await syn.type('key', "a");
});

QUnit.test("typing in a number works", async function () {
	stop();
	await syn.type('key', 9999);

	equal(st.g('key')
		.value, "9999", "typing in numbers works");
	start();
});

QUnit.test("typing in a contenteditable works", async function () {
	stop();
	await syn.type("editable", "hello world");

	var editable = st.g("editable");
	var text = editable.textContent || editable.innerText;
	equal(text, "hello world", "Content editable was edited");
	start();
});

QUnit.test("typing in an input type=number works", async function() {
	stop();

	st.g("qunit-fixture").innerHTML =
		"<form id='outer'>" +
			"<div id='inner'>" +
				"<input type='number' pattern='[0-9]*' id='number' value='' />" +
			"</div>" +
		"</form>";

	await syn.type("number", 123);
	var val = st.g("number").value;
	equal(val, "123", "number input was edited");
	start();
});


QUnit.test("Key property, a typed", async function () {
	stop();

	var a = false;
	st.binder('key', 'keypress', function (ev) {
		a = ev.key;
		equal('a', ev.key);
	});
	await syn.type('key', "a");

	ok(a, "a key typed");
	start();
});

QUnit.test("Control key", async function () {
	stop();

	var keyIsDown = false;
	st.binder("key", "keydown", function (ev) {
		keyIsDown = ev.ctrlKey;
		ok(ev.key === 'Control', "key is normalized");
	});

	var keyIsUp = true;
	st.binder("key", "keyup", function (ev) {
		keyIsUp = ev.ctrlKey;
		ok(ev.key === 'Control', "key is normalized");
	});

	await syn.type('key', "[ctrl]");

	ok(keyIsDown, "Control modifier key pressed successfully");

	await syn.type('key', "[ctrl-up]");
	ok(!keyIsUp, "Control modifier key released successfully");
	start();
});


QUnit.test("alt keycodes", async function () {
	stop();

	var keyIsDown = false;
	st.binder("key", "keydown", function (ev) {
		keyIsDown = ev.altKey;
		ok(ev.key === 'Alt', "key is normalized");
	});

	var keyIsUp = true;
	st.binder("key", "keyup", function (ev) {
		keyIsUp = ev.altKey;
		ok(ev.key === 'Alt', "key is normalized");
	});

	await syn.type('key', "[alt]");

	ok(keyIsDown, "Alt modifier key pressed successfully");

	await syn.type('key', "[alt-up]");

	ok(!keyIsUp, "Alt modifier key released successfully");
	start();
});

QUnit.test("meta keycodes", async function () {
	stop();

	var keyIsDown = false;
	st.binder("key", "keydown", function (ev) {
		keyIsDown = ev.metaKey;
		ok(ev.key === 'Meta', "key is normalized");
	});

	var keyIsUp = true;
	st.binder("key", "keyup", function (ev) {
		keyIsUp = ev.metaKey;
		ok(ev.key === 'Meta', "key is normalized");
	});

	await syn.type('key', "[meta]");

	ok(keyIsDown, "meta modifier key pressed successfully");

	await syn.type('key', "[meta-up]");

	ok(!keyIsUp, "meta modifier key released successfully");
	start();
});
