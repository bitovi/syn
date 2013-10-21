steal('jquery',
	'jquery/event/drag',
	'jquery/event/key',
	'can/control',
function($, Drag, Control) {
	var Tabs = can.Control.extend({
		init: function() {
			this.element.addClass('nav nav-tabs');
			this.element.find('li:first').addClass('active');

			$.each(this.element, function(i, el) {
				$(el).nextAll(':gt(0)').hide();
			});
		},

		'li click': function(el, ev) {
			el.siblings().removeClass('active');
			el.addClass('active');

			el.parent().siblings().hide();
			el.parent().nextAll().eq(el.index()).show();
		}
	});

	new Tabs('#uitabs, #uitabs2');

	var Demo = can.Control.extend({
		init: function() {
			this.element.find('select')[0].selectedIndex = 0;
		},

		'.drag draginit': function(el, ev) {},
		'#numeric keypress': function(el, ev) {
			if(!/^[0-9]*$/.test(ev.keyName())) {
				ev.preventDefault();
			}
		},

		'submit': function(el, ev) {
			ev.preventDefault();
			this.indicate(this.element.find('#indicator'));
		},

		'change': function(el, ev) {
			ev.preventDefault();
			this.indicate(this.element.find('#changeIndicator'));
		},

		indicate: function(el) {
			el.addClass('alert alert-success');
			setTimeout(function() {
				el.removeClass('alert alert-success');
			}, 300);
		}
	});

	new Demo(document);
});