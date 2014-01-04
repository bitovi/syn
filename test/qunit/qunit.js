QUnit.config.reorder = false;

steal('jquery')
.then('src/synthetic.js')
.then('src/mouse.js')
.then('src/browsers.js')
.then('src/typeable.js')
.then('src/key.js')
.then('test/qunit/syn_test.js')
.then('test/qunit/key_test.js')
.then('src/drag/drag.js')
.then('src/drag/test/qunit/drag_test.js')
.then('test/qunit/mouse_test.js')
.then('test/qunit/typeable_test.js');
