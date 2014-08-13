/**
 * Syn - 0.0.2
 * 
 * @copyright 2014 Bitovi
 * Wed, 13 Aug 2014 23:04:05 GMT
 * @license MIT
 */

/*[global-shim]*/
(function (exports, global){
	var origDefine = global.define;

	var get = function(name){
		var parts = name.split("."),
			cur = global,
			i;
		for(i = 0 ; i < parts.length; i++){
			cur = cur[parts[i]];
		}
		return cur;
	};
	var modules = global.define && global.define.modules || {};
	var ourDefine = global.define = function(moduleName, deps, callback){
		var module;
		if(typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for(i =0; i < deps.length; i++) {
			args.push( exports[deps[i]] ? get(exports[deps[i]]) : modules[deps[i]]  );
		}
		// CJS has no dependencies but 3 callback arguments
		if(!deps.length && callback.length) {
			module = { exports: {} };
			var require = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args.push(require, module.exports, module);
		}

		global.define = origDefine;
		var result = callback.apply(null, args);
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		modules[moduleName] = module && module.exports ? module.exports : result;
	};
	global.define.modules = modules;
	global.System = {
		define: function(__name, __code){
			eval(__code);
		}
	};
})({},window)
/*test/qunit/syn_test*/
define('test/qunit/syn_test', ['src/synthetic'], function (syn) {
    QUnit.module('syn');
    st = {
        g: function (id) {
            return document.getElementById(id);
        },
        log: function (c) {
            if (st.g('mlog')) {
                st.g('mlog').innerHTML = st.g('mlog').innerHTML + c + '<br/>';
            }
        },
        binder: function (id, ev, f) {
            st.bind(st.g(id), ev, f);
        },
        unbinder: function (id, ev, f) {
            st.unbind(st.g(id), ev, f);
        },
        bind: function (el, ev, f) {
            return el.addEventListener ? el.addEventListener(ev, f, false) : el.attachEvent('on' + ev, f);
        },
        unbind: function (el, ev, f) {
            return el.addEventListener ? el.removeEventListener(ev, f, false) : el.detachEvent('on' + ev, f);
        },
        rootJoin: typeof steal === 'undefined' ? function (path) {
            return '../' + path;
        } : function (path) {
            var base = System.baseURL;
            return steal.joinURIs(base, path);
        }
    };
    setTimeout(function supportLog() {
        if (syn.support.ready === 2) {
            for (var name in syn.support) {
                st.log(name + ': ' + syn.support[name]);
            }
        } else {
            setTimeout(supportLog, 1);
        }
    }, 1);
    test('Selecting a select element', function () {
        st.g('qunit-test-area').innerHTML = '<form id=\'outer\'><select name=\'select\'><option value=\'1\' id=\'one\'>one</option><option value=\'2\' id=\'two\'>two</option></select></form>';
        var change = 0, changef = function () {
                change++;
            };
        st.g('outer').select.selectedIndex = 0;
        st.bind(st.g('outer').select, 'change', changef);
        stop();
        syn.click(st.g('two'), function () {
            equal(change, 1, 'change called once');
            equal(st.g('outer').select.selectedIndex, 1, 'Change Selected Index');
            start();
            st.g('qunit-test-area').innerHTML = '';
        });
    });
    test('scrollTop triggers scroll events', function () {
        st.g('qunit-test-area').innerHTML = '<div id=\'scroller\' style=\'height:100px;width: 100px;overflow:auto\'>' + '<div style=\'height: 200px; width: 100%\'>text' + '</div>' + '</div>';
        st.binder('scroller', 'scroll', function (ev) {
            ok(true, 'scrolling created just by changing ScrollTop');
            st.g('qunit-test-area').innerHTML = '';
            start();
        });
        stop();
        setTimeout(function () {
            var sc = st.g('scroller');
            if (sc) {
                sc.scrollTop = 10;
            }
        }, 13);
    });
    if (!syn.skipFocusTests) {
        test('focus triggers focus events', function () {
            st.g('qunit-test-area').innerHTML = '<input type=\'text\' id=\'focusme\'/>';
            st.binder('focusme', 'focus', function (ev) {
                ok(true, 'focus creates event');
                st.g('qunit-test-area').innerHTML = '';
                start();
            });
            stop();
            setTimeout(function () {
                st.g('focusme').focus();
            }, 10);
        });
    }
    test('syn.support effect on scroll position, #30', function () {
        stop();
        var iframe = document.createElement('iframe');
        iframe.setAttribute('height', '100');
        var scroll30 = st.rootJoin('test/qunit/scroll_30/index.html');
        iframe.src = scroll30;
        window.synReady = function () {
            try {
                delete window.synReady;
            } catch (e) {
                window.synReady = undefined;
            }
            var win = iframe.contentWindow;
            var scrollTop = win.document.body.scrollTop;
            equal(scrollTop, 0);
            start();
        };
        st.g('qunit-test-area').appendChild(iframe);
    });
    test('syn.schedule gets called when syn.delay is used', function () {
        stop();
        var iframe = document.createElement('iframe');
        iframe.src = st.rootJoin('test/qunit/syn.schedule.html');
        window.synSchedule = function (fn, ms) {
            equal(typeof fn, 'function');
            equal(typeof ms, 'number');
            start();
        };
        st.g('qunit-test-area').appendChild(iframe);
    });
});
/*test/qunit/key_test*/
define('test/qunit/key_test', ['src/synthetic'], function (syn) {
    QUnit.module('synthetic/key', {
        setup: function () {
            st.g('qunit-test-area').innerHTML = '<form id=\'outer\'>' + '<div id=\'inner\'>' + '<input type=\'input\' id=\'key\' value=\'\'/>' + '<a href=\'#abc\' id=\'focusLink\'>click me</a>' + '<textarea id=\'synTextArea\'></textarea>' + '<div id=\'editable\' contenteditable=\'true\'></div>' + '</div></form>';
        },
        teardown: function () {
            st.g('qunit-test-area').innerHTML = '';
        }
    });
    test('Key Characters', function () {
        st.g('key').value = '';
        syn.key('key', 'a');
        equal(st.g('key').value, 'a', 'a written');
        st.g('key').value = '';
        syn.key('key', 'A');
        equal(st.g('key').value, 'A', 'A written');
        st.g('key').value = '';
        syn.key('key', '1');
        equal(st.g('key').value, '1', '1 written');
    });
    test('Key \\r Submits Forms', 2, function () {
        var submit = 0, change = 0;
        st.binder('key', 'change', function (ev) {
            change++;
            if (ev.preventDefault) {
                ev.preventDefault();
            }
            ev.returnValue = false;
            return false;
        });
        st.binder('outer', 'submit', function (ev) {
            submit++;
            if (ev.preventDefault) {
                ev.preventDefault();
            }
            ev.returnValue = false;
            return false;
        });
        stop();
        syn.key('key', '\r', function () {
            equal(submit, 1, 'submit on keypress');
            equal(change, 1, 'submit on keypress');
            start();
        });
    });
    test('Key \\r Clicks Links', 1, function () {
        var clicked = 0;
        st.binder('focusLink', 'click', function (ev) {
            clicked++;
            if (ev.preventDefault) {
                ev.preventDefault();
            }
            ev.returnValue = false;
            return false;
        });
        stop();
        syn.key('focusLink', '\r', function () {
            equal(clicked, 1, 'clicked');
            start();
        });
    });
    test('Key Event Order', 1, function () {
        var order = [], recorder = function (ev) {
                order.push(ev.type);
            };
        st.binder('key', 'keydown', recorder);
        st.binder('key', 'keypress', recorder);
        st.binder('key', 'input', recorder);
        st.binder('key', 'keyup', recorder);
        stop();
        syn.key('key', 'B', function () {
            var expected = [
                    'keydown',
                    'keypress',
                    'keyup'
                ];
            if (syn.support.oninput) {
                expected.splice(2, 0, 'input');
            }
            deepEqual(order, expected, 'Key order is correct');
            start();
        });
    });
    test('Key \\r Adds Newline in Textarea', function () {
        st.g('synTextArea').value = '';
        stop();
        syn.type('synTextArea', 'ab\rcd', function () {
            equal(st.g('synTextArea').value.replace('\r', ''), 'ab\ncd', 'typed new line correctly');
            start();
        });
    });
    test('Key \\b', function () {
        st.g('key').value = '';
        stop();
        syn.type('key', 'abc', function () {
            equal(st.g('key').value, 'abc', 'abc written');
            syn.key('key', '\b');
            equal(st.g('key').value, 'ab', 'ab written (key deleted)');
            start();
        });
    });
    test('Key Character Order', function () {
        var upVal, pressVal, downVal;
        st.binder('key', 'keyup', function () {
            upVal = st.g('key').value;
        });
        st.binder('key', 'keypress', function () {
            pressVal = st.g('key').value;
        });
        st.binder('key', 'keydown', function () {
            downVal = st.g('key').value;
        });
        stop();
        syn.key('key', 'J', function () {
            equal(upVal, 'J', 'Up Typing works');
            equal(pressVal, '', 'Press Typing works');
            equal(downVal, '', 'Down Typing works');
            start();
        });
    });
    test('page down, page up, home, end', function () {
        st.g('qunit-test-area').innerHTML = '<div id=\'scrolldiv\' style=\'width:100px;height:200px;overflow-y:scroll;\' tabindex=\'0\'>' + '<div id=\'innerdiv\' style=\'height:1000px;\'><a href=\'javascript://\'>Scroll on me</a></div></div>';
        st.g('scrolldiv').scrollTop = 0;
        var keyTest = {
                'page-down': function () {
                    ok(st.g('scrolldiv').scrollTop > 10, 'Moved down');
                },
                'page-up': function () {
                    ok(st.g('scrolldiv').scrollTop === 0, 'Moved back up (page-up)');
                },
                'end': function () {
                    var sd = st.g('scrolldiv');
                    ok(sd.scrollTop === sd.scrollHeight - sd.clientHeight, 'Moved to the end');
                },
                'home': function () {
                    ok(st.g('scrolldiv').scrollTop === 0, 'Moved back up (home)');
                }
            }, order = [], i = 0, runNext = function () {
                var name = order[i];
                if (!name) {
                    start();
                    return;
                }
                syn.key('scrolldiv', name);
            };
        for (var name in keyTest) {
            if (keyTest.hasOwnProperty(name)) {
                order.push(name);
            }
        }
        st.bind(st.g('scrolldiv'), 'scroll', function (ev) {
            keyTest[order[i]]();
            i++;
            setTimeout(runNext, 1);
        });
        stop();
        st.g('scrolldiv').focus();
        runNext();
    });
    test('range tests', function () {
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
                var r = el.createTextRange();
                r.moveStart('character', start);
                end = end || start;
                r.moveEnd('character', end - el.value.length);
                r.select();
            }
        };
        st.g('qunit-test-area').innerHTML = '<form id=\'outer\'><div id=\'inner\'><input type=\'input\' id=\'key\' value=\'\'/></div></form>' + '<textarea id=\'mytextarea\' />';
        var keyEl = st.g('key');
        var textAreaEl = st.g('mytextarea');
        keyEl.value = '012345';
        selectText(keyEl, 1, 3);
        syn.key('key', 'delete');
        equal(keyEl.value, '0345', 'delete range works');
        keyEl.value = '012345';
        selectText(keyEl, 2);
        syn.key('key', 'delete');
        equal(keyEl.value, '01345', 'delete works');
        keyEl.value = '123456';
        selectText(keyEl, 1, 3);
        syn.key('key', 'a');
        equal(keyEl.value, '1a456', 'character range works');
        keyEl.value = '123456';
        selectText(keyEl, 2);
        syn.key('key', 'a');
        equal(keyEl.value, '12a3456', 'character insertion works');
        keyEl.value = '123456';
        selectText(keyEl, 1, 3);
        syn.key('key', '\b');
        equal(keyEl.value, '1456', 'backspace range works');
        keyEl.value = '123456';
        selectText(keyEl, 2);
        syn.key('key', '\b');
        equal(keyEl.value, '13456', 'backspace works');
        textAreaEl.value = '123456';
        selectText(textAreaEl, 1, 3);
        syn.key(textAreaEl, 'delete');
        equal(textAreaEl.value, '1456', 'delete range works in a textarea');
        textAreaEl.value = '123456';
        selectText(textAreaEl, 1, 3);
        syn.key(textAreaEl, 'a');
        equal(textAreaEl.value, '1a456', 'character range works in a textarea');
        textAreaEl.value = '123456';
        selectText(textAreaEl, 1, 3);
        syn.key(textAreaEl, '\b');
        equal(textAreaEl.value, '1456', 'backspace range works in a textarea');
        textAreaEl.value = '123456';
        selectText(textAreaEl, 1, 3);
        syn.key(textAreaEl, '\r');
        equal(textAreaEl.value.replace('\r', ''), '1\n456', 'return range works in a textarea');
    });
    test('Type with tabs', function () {
        st.g('qunit-test-area').innerHTML = '<input tabindex=\'3\' id=\'third\'/>' + '<a tabindex=\'1\' id=\'first\' href=\'javascript://\'>First</a>' + '<input tabindex=\'2\' id=\'second\'/>' + '<input tabindex=\'4\' id=\'fourth\'/>';
        st.g('first').focus();
        var clicked = 0;
        st.binder('first', 'click', function () {
            clicked++;
        });
        stop();
        setTimeout(function () {
            syn.type('first', '\r\tSecond\tThird\tFourth', function () {
                equal(clicked, 1, 'clickd first');
                equal(st.g('second').value, 'Second', 'moved to second');
                equal(st.g('third').value, 'Third', 'moved to Third');
                equal(st.g('fourth').value, 'Fourth', 'moved to Fourth');
                start();
            });
        }, 1);
    });
    test('Type with shift tabs', function () {
        st.g('qunit-test-area').innerHTML = '<input tabindex=\'3\' id=\'third\'/>' + '<a tabindex=\'1\' id=\'first\' href=\'javascript://\'>First</a>' + '<input tabindex=\'2\' id=\'second\'/>' + '<input tabindex=\'4\' id=\'fourth\'/>';
        st.g('first').focus();
        var clicked = 0;
        st.binder('first', 'click', function () {
            clicked++;
        });
        stop();
        setTimeout(function () {
            syn.type('fourth', '[shift]4\t3\t2\t\r[shift-up]', function () {
                equal(clicked, 1, 'clickd first');
                equal(st.g('second').value, '2', 'moved to second');
                equal(st.g('third').value, '3', 'moved to Third');
                equal(st.g('fourth').value, '4', 'moved to Fourth');
                start();
            });
        }, 1);
    });
    test('Type left and right', function () {
        stop();
        syn.type('key', '012345678[left][left][left]\b', function () {
            equal(st.g('key').value, '01234678', 'left works');
            syn.type('key', '[right][right]a', function () {
                equal(st.g('key').value, '0123467a8', 'right works');
                start();
            });
        });
    });
    test('Type left and delete', function () {
        stop();
        syn.type('key', '123[left][delete]', function () {
            equal(st.g('key').value, '12', 'left delete works');
            start();
        });
    });
    test('Typing Shift', function () {
        stop();
        var shift = false;
        st.binder('key', 'keypress', function (ev) {
            shift = ev.shiftKey;
        });
        syn.type('key', '[shift]A[shift-up]', function () {
            ok(shift, 'Shift key on');
            start();
        });
    });
    test('Typing Shift then clicking', function () {
        stop();
        var shift = false;
        st.binder('inner', 'click', function (ev) {
            shift = ev.shiftKey;
        });
        syn.type('key', '[shift]A').click('inner', {}).type('key', '[shift-up]', function () {
            ok(shift, 'Shift key on click');
            start();
        });
    });
    test('Typing Shift Left and Right', function () {
        stop();
        syn.type('key', '012345678[shift][left][left][left][shift-up]\b[left]\b', function () {
            equal(st.g('key').value, '01235', 'shift left works');
            syn.type('key', '[left][left][shift][right][right]\b[shift-up]', function () {
                equal(st.g('key').value, '015', 'shift right works');
                start();
            });
        });
    });
    test('shift characters', function () {
        stop();
        syn.type('key', '@', function () {
            equal(st.g('key').value, '@', '@ character works');
            start();
        });
    });
    test('number key codes', 2, function () {
        stop();
        st.binder('key', 'keydown', function (ev) {
            ok(ev.keyCode === 40, 'key codes are numbers');
            ok(ev.which === ev.keyCode, 'which is normalized');
            start();
        });
        syn.type('key', '[down]', function () {
        });
    });
    test('Key codes of like-keys', function () {
        stop();
        var keys = {
                'subtract': 109,
                'dash': 189,
                'divide': 111,
                'forward-slash': 191,
                'decimal': 110,
                'period': 190
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
            st.binder('key', 'keydown', f = function (ev) {
                st.unbinder('key', 'keydown', f);
                ok(ev.keyCode === code);
                ok(ev.which === ev.keyCode);
                done();
            });
            syn.type('key', '[' + key + ']');
        };
        for (var key in keys) {
            testKeyCode(key, keys[key]);
        }
    });
    test('focus moves on keydown to another element', function () {
        stop();
        st.binder('key', 'keydown', function (ev) {
            st.g('synTextArea').focus();
        });
        st.binder('synTextArea', 'keypress', function (ev) {
            ok(true, 'keypress called');
            start();
        });
        syn.type('key', 'a', function () {
        });
    });
    test('typing in a number works', function () {
        stop();
        syn.type('key', 9999, function () {
            equal(st.g('key').value, '9999', 'typing in numbers works');
            start();
        });
    });
    test('typing in a contenteditable works', function () {
        stop();
        syn.type('editable', 'hello world', function () {
            var editable = st.g('editable');
            var text = editable.textContent || editable.innerText;
            equal(text, 'hello world', 'Content editable was edited');
            start();
        });
    });
});
/*src/drag/test/qunit/drag_test*/
define('src/drag/test/qunit/drag_test', ['src/synthetic'], function (syn) {
    QUnit.module('drag');
    test('move', function () {
        var div = $('<div id=\'wrap\'>' + '<div id=\'left\'></div>' + '<div id=\'right\'></div>' + '</div>');
        div.appendTo($('#qunit-test-area'));
        var basicCss = {
                width: '90px',
                height: '100px',
                position: 'absolute',
                border: 'solid 1px black'
            };
        $('#wrap').css({
            position: 'absolute',
            top: '0px',
            left: '0px',
            width: '200px',
            height: '100px',
            backgroundColor: 'yellow'
        });
        $('#left').css(basicCss).css({
            top: '0px',
            left: '10px',
            backgroundColor: 'green'
        });
        $('#right').css(basicCss).css({
            top: '0px',
            left: '100px',
            backgroundColor: 'blue'
        });
        var clientX = -1, clientY = -1, els = [
                $('#wrap')[0],
                $('#left')[0],
                $('#right')[0],
                $('#wrap')[0]
            ], targets = [];
        var move = function (ev) {
            if (ev.clientX === 0 && ev.clientY === 0) {
                return;
            }
            if (ev.clientX < clientX) {
                ok(false, 'mouse isn\'t moving right');
            }
            clientX = ev.clientX;
            if (ev.clientY < clientY) {
                console.log('y', ev.clientY, clientY);
                ok(false, 'mouse isn\'t moving right');
            }
            clientY = ev.clientY;
            if (!targets.length || targets[targets.length - 1] !== ev.target) {
                targets.push(ev.target);
            }
        };
        $(document.documentElement).bind('mousemove', move);
        stop();
        syn.move('wrap', {
            from: {
                pageX: 2,
                pageY: 50
            },
            to: {
                pageX: 199,
                pageY: 50
            },
            duration: 1000
        }, function () {
            equal(clientX, 199);
            equal(clientY, 50);
            $(document.documentElement).unbind('mousemove', move);
            for (var i = 0; i < els.length; i++) {
                ok(els[i] === targets[i], 'target is right');
            }
            $('#qunit-test-area').html('');
            start();
        });
    });
});
/*test/qunit/mouse_test*/
define('test/qunit/mouse_test', ['src/synthetic'], function (syn) {
    var didSomething = 0;
    window.doSomething = function () {
        ++didSomething;
    };
    QUnit.module('synthetic/mouse', {
        setup: function () {
            st.g('qunit-test-area').innerHTML = '<form id=\'outer\'><div id=\'inner\'>' + '<input type=\'checkbox\' id=\'checkbox\'/>' + '<input type=\'radio\' name=\'radio\' value=\'radio1\' id=\'radio1\'/>' + '<input type=\'radio\' name=\'radio\' value=\'radio2\' id=\'radio2\'/>' + '<a href=\'javascript:doSomething()\' id=\'jsHref\'>click me</a>' + '<a href=\'#aHash\' id=\'jsHrefHash\'>click me</a>' + '<input type=\'submit\' id=\'submit\'/></div></form>';
        },
        teardown: function () {
            didSomething = 0;
        }
    });
    test('syn basics', function () {
        ok(syn, 'syn exists');
        st.g('qunit-test-area').innerHTML = '<div id=\'outer\'><div id=\'inner\'></div></div>';
        var mouseover = 0, mouseoverf = function () {
                mouseover++;
            };
        st.bind(st.g('outer'), 'mouseover', mouseoverf);
        syn('mouseover', st.g('inner'));
        st.unbinder('outer', 'mouseover', mouseoverf);
        equal(mouseover, 1, 'Mouseover');
        syn('mouseover', 'inner', {});
        equal(mouseover, 1, 'Mouseover on no event handlers');
        st.g('qunit-test-area').innerHTML = '';
    });
    test('Click Forms', function () {
        var submit = 0, submitf = function (ev) {
                submit++;
                if (ev.preventDefault) {
                    ev.preventDefault();
                }
                ev.returnValue = false;
                return false;
            };
        st.bind(st.g('outer'), 'submit', submitf);
        syn.trigger(st.g('submit'), 'click', {});
        syn('submit', 'outer', {});
        equal(submit, 2, 'Click on submit');
        var click = 0, clickf = function (ev) {
                click++;
                if (ev.preventDefault) {
                    ev.preventDefault();
                }
                return false;
            };
        st.binder('inner', 'click', clickf);
        syn.trigger(st.g('submit'), 'click', {});
        equal(submit, 2, 'Submit prevented');
        equal(click, 1, 'Clicked');
        st.unbinder('outer', 'submit', submitf);
        st.unbinder('inner', 'click', clickf);
    });
    test('Click Checkboxes', function () {
        var checkbox = 0;
        st.binder('checkbox', 'change', function (ev) {
            checkbox++;
        });
        st.g('checkbox').checked = false;
        syn.trigger(st.g('checkbox'), 'click', {});
        ok(st.g('checkbox').checked, 'click checks on');
        syn.trigger(st.g('checkbox'), 'click', {});
        ok(!st.g('checkbox').checked, 'click checks off');
    });
    test('Checkbox is checked on click', function () {
        st.g('checkbox').checked = false;
        st.binder('checkbox', 'click', function (ev) {
            ok(st.g('checkbox').checked, 'check is on during click');
        });
        syn.trigger(st.g('checkbox'), 'click', {});
    });
    test('Select is changed on click', function () {
        var select1 = 0, select2 = 0;
        st.g('qunit-test-area').innerHTML = '<select id="s1"><option id="s1o1">One</option><option id="s1o2">Two</option></select><select id="s2"><option id="s2o1">One</option><option id="s2o2">Two</option></select>';
        st.bind(st.g('s1'), 'change', function (ev) {
            select1++;
        });
        st.bind(st.g('s2'), 'change', function (ev) {
            select2++;
        });
        syn.trigger(st.g('s1o2'), 'click', {});
        equal(st.g('s1').selectedIndex, 1, 'select worked');
        equal(select1, 1, 'change event');
        syn.trigger(st.g('s2o2'), 'click', {});
        equal(st.g('s2').selectedIndex, 1, 'select worked');
        equal(select2, 1, 'change event');
        syn.trigger(st.g('s1o1'), 'click', {});
        equal(st.g('s1').selectedIndex, 0, 'select worked');
        equal(select1, 2, 'change event');
    });
    test('Select is change on click (iframe)', function () {
        stop();
        var rootJoin = st.rootJoin;
        var page3 = rootJoin('test/qunit/page3.html'), iframe = document.createElement('iframe');
        st.bind(iframe, 'load', function () {
            var iget = function (id) {
                return iframe.contentWindow.document.getElementById(id);
            };
            st.bind(iget('select1'), 'change', function () {
                ok(true, 'select worked');
            });
            st.bind(iget('select2'), 'change', function () {
                ok(true, 'select worked');
            });
            syn.click(iget('s1o2'), {}, function () {
                start();
                syn.click(iget('s2o2'));
                syn.click(iget('s1o1'));
            });
        });
        iframe.src = page3;
        st.g('qunit-test-area').appendChild(iframe);
    });
    test('Click Radio Buttons', function () {
        var radio1 = 0, radio2 = 0;
        st.g('radio1').checked = false;
        st.bind(st.g('radio1'), 'change', function (ev) {
            radio1++;
        });
        st.bind(st.g('radio2'), 'change', function (ev) {
            radio2++;
        });
        syn.trigger(st.g('radio1'), 'click', {});
        equal(radio1, 1, 'radio event');
        ok(st.g('radio1').checked, 'radio checked');
        syn.trigger(st.g('radio2'), 'click', {});
        equal(radio2, 1, 'radio event');
        ok(st.g('radio2').checked, 'radio checked');
        ok(!st.g('radio1').checked, 'radio unchecked');
    });
    test('Click! Event Order', syn.skipFocusTests ? 3 : 4, function () {
        var order = 0;
        st.g('qunit-test-area').innerHTML = '<input id=\'focusme\'/>';
        st.binder('focusme', 'mousedown', function () {
            equal(++order, 1, 'mousedown');
        });
        if (!syn.skipFocusTests) {
            st.binder('focusme', 'focus', function () {
                equal(++order, 2, 'focus');
            });
        }
        st.binder('focusme', 'mouseup', function () {
            equal(++order, syn.skipFocusTests ? 2 : 3, 'mouseup');
        });
        st.binder('focusme', 'click', function (ev) {
            equal(++order, syn.skipFocusTests ? 3 : 4, 'click');
            if (ev.preventDefault) {
                ev.preventDefault();
            }
            ev.returnValue = false;
        });
        stop();
        syn.click('focusme', {}, function () {
            start();
        });
    });
    test('Click Anchor Runs HREF JavaScript', function () {
        stop();
        syn.trigger(st.g('jsHref'), 'click', {});
        setTimeout(function () {
            equal(didSomething, 1, 'link href JS run');
            start();
        }, 50);
    });
    test('Click! Anchor has href', function () {
        stop();
        st.binder('jsHrefHash', 'click', function (ev) {
            var target = ev.target || ev.srcElement;
            ok(target.href.indexOf('#aHash') > -1, 'got href');
        });
        syn.click('jsHrefHash', {}, function () {
            equal(window.location.hash, '#aHash', 'hash set ...');
            start();
            window.location.hash = '';
        });
    });
    test('Click! Anchor Focuses', syn.skipFocusTests ? 1 : 2, function () {
        st.g('qunit-test-area').innerHTML = '<a href=\'#abc\' id=\'focusme\'>I am visible</a>';
        if (!syn.skipFocusTests) {
            st.binder('focusme', 'focus', function (ev) {
                ok(true, 'focused');
            });
        }
        st.binder('focusme', 'click', function (ev) {
            ok(true, 'clicked');
            st.g('qunit-test-area').innerHTML = '';
            if (ev.preventDefault) {
                ev.preventDefault();
            }
            ev.returnValue = false;
            return false;
        });
        stop();
        syn.click('focusme', {}, function () {
            start();
        });
    });
    if (!syn.skipFocusTests) {
        test('Click away causes Blur Change', function () {
            st.g('qunit-test-area').innerHTML = '<input id=\'one\'/><input id=\'two\'/>';
            var change = 0, blur = 0;
            st.binder('one', 'blur', function () {
                blur++;
            });
            st.binder('one', 'change', function () {
                change++;
            });
            stop();
            syn.click('one', {}).key('a').click('two', {}, function () {
                start();
                equal(change, 1, 'Change called once');
                equal(blur, 1, 'Blur called once');
            });
        });
        test('Click HTML causes blur  change', function () {
            st.g('qunit-test-area').innerHTML = '<input id=\'one\'/><input id=\'two\'/>';
            var change = 0;
            st.binder('one', 'change', function () {
                change++;
            });
            stop();
            syn.click('one', {}).key('a').click(document.documentElement, {}, function () {
                start();
                equal(change, 1, 'Change called once');
            });
        });
    }
    test('Right Click', function () {
        st.g('qunit-test-area').innerHTML = '<div id=\'one\'>right click me</div>';
        stop();
        var context = 0;
        st.binder('one', 'contextmenu', function () {
            context++;
        });
        syn.rightClick('one', {}, function () {
            if (syn.mouse.browser.contextmenu) {
                equal(1, context, 'context was called');
            } else {
                ok(true, 'context shouldn\'t be called in this browser');
            }
            start();
        });
    });
    test('Double Click', function () {
        st.g('qunit-test-area').innerHTML = '<div id=\'dblclickme\'>double click me</div>';
        stop();
        var eventSequence = [];
        st.binder('dblclickme', 'dblclick', function () {
            eventSequence.push('dblclick');
        });
        st.binder('dblclickme', 'click', function () {
            eventSequence.push('click');
        });
        syn.dblclick('dblclickme', {}, function () {
            equal(eventSequence.join(', '), 'click, click, dblclick', 'expected event sequence for doubleclick');
            start();
        });
    });
    test('h3 click in popup', 1, function () {
        st.g('qunit-test-area').innerHTML = '';
        stop();
        var path = st.rootJoin('test/qunit/h3.html');
        var popup = window.open(path, 'synthing');
        setTimeout(function () {
            var el = popup.document.getElementById('strange');
            st.bind(el, 'click', function () {
                ok(true, 'h3 was clicked');
            });
            syn.click(el, {}, function () {
                start();
                popup.close();
            });
        }, 500);
    });
    test('focus on an element then another in another page', function () {
        stop();
        var page1 = st.rootJoin('test/qunit/page1.html'), page2 = st.rootJoin('test/qunit/page2.html');
        var iframe = document.createElement('iframe'), calls = 0;
        st.bind(iframe, 'load', function () {
            if (calls === 0) {
                syn.click(iframe.contentWindow.document.getElementById('first'), {}, function () {
                    iframe.contentWindow.location = page2;
                });
                calls++;
            } else {
                syn.click(iframe.contentWindow.document.getElementById('second'), {}, function () {
                    ok(iframe.contentWindow.document.getElementById('second') === iframe.contentWindow.document.activeElement);
                    start();
                });
            }
        });
        iframe.src = page1;
        st.g('qunit-test-area').appendChild(iframe);
    });
});
/*test/qunit/typeable_test*/
define('test/qunit/typeable_test', ['src/synthetic'], function (syn) {
    QUnit.module('synthetic/typeable');
    var isTypeable = syn.typeable.test;
    test('Inputs and textareas', function () {
        var input = document.createElement('input');
        var textarea = document.createElement('textarea');
        equal(isTypeable(input), true, 'Input element is typeable.');
        equal(isTypeable(textarea), true, 'Text area is typeable.');
    });
    test('Normal divs', function () {
        var div = document.createElement('div');
        equal(isTypeable(div), false, 'Divs are not typeable.');
    });
    test('Contenteditable div', function () {
        var div = document.createElement('div');
        div.setAttribute('contenteditable', 'true');
        equal(isTypeable(div), true, 'Divs with contenteditable true');
        div.setAttribute('contenteditable', '');
        equal(isTypeable(div), true, 'Divs with contenteditable as empty string.');
    });
    test('User defined typeable function', function () {
        syn.typeable(function (node) {
            return node.className === 'foo';
        });
        var div = document.createElement('div');
        div.className = 'foo';
        equal(isTypeable(div), true, 'Custom function works.');
    });
});
