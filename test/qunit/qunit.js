QUnit.config.reorder = false;

steal('jquery')
.then('synthetic.js')
.then('mouse.js')
.then('browsers.js')
.then('key.js')
.then('test/qunit/syn_test.js')
.then('test/qunit/key_test.js')
.then('drag/drag.js')
.then('drag/test/qunit/drag_test.js')
.then('test/qunit/mouse_test.js')