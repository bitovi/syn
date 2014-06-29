QUnit.config.reorder = false;
QUnit.config.testTimeout = 5000;

steal('jquery')
	.then('src/synthetic.js')
	.then('src/mouse.support.js')
	.then('src/browsers.js')
	.then('src/typeable.js')
	.then('src/key.support.js')
	.then('test/qunit/syn_test.js')
	.then('test/qunit/key_test.js')
	.then('src/drag/drag.js')
	.then('src/drag/test/qunit/drag_test.js')
	.then('test/qunit/mouse_test.js')
	.then('test/qunit/typeable_test.js');
