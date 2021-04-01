steal('jquery', 'can/control', 'src/syn.js', function($, Control, syn) {
	var Resize = can.Control.extend({
		init: function() {
			this.resize();
		},

		'{window} resize': function() {
			this.resize();
		},

		resize: function() {
			this.element.height($(window).height() - $('#bottom').height());
		}
	});

	new Resize('#app');

	//Safari doesn't send mouse/click on option
	$(function() {
		syn.autoDelay = true;
		REPLAY = false;
		ADD = true;

		Recorder = {
			cb: function(i) {
				return function() {
					$('#code div:nth('+(i)+')').css('color', 'black').css('font-weight', '');
					$('#code div:nth('+(i+1)+')').css('color', 'orange').css('font-weight', 'bold');
					if(i === commands.length - 1) {
						Recorder.done();
					}
				}
			},

			done: function() {
				ADD = true;
				$('#code div').css('color','black');
			}
		};

		var commands =[],
			downKeys = [],
			keytarget = null,
			current = [],
			mousedown,
			mousemove,
			mouseup,
			h = {
				commandsText: function(func) {
					var text = [],
						command,
						prev,
						args;

					for(var i=0; i < commands.length; i++) {
						command = commands[i];
						args = [];
						command.options && args.push(command.options);

						(!prev || prev.selector !== command.selector) && args.push('$(\''+command.selector+'\')');
						func && args.push('Recorder.cb('+i+')');

						text.push(func ? '':'<div>',
							i > 0 ? '   .' : 'syn.',
							command.type,
							'(',
							args.join(', '),
							')\n',
							func ? '':'</div>');
						prev = command;
					}
					return text.join('');
				},

				addCode: function(type, options, target) {
					if(!ADD) {
						return;
					}

					var selector = h.selector(target),
						last = commands[commands.length - 1] || {};

					if(last.type === type && type === 'type' && last.selector === selector) {
						last.options = options
					}
					else {
						commands.push({
							type : type,
							options: options,
							selector: selector
						});
					}

					$('#code').html(h.commandsText());
				},

				getKey: function(code) {
					for(var key in syn.key.keycodes) {
						if(syn.key.keycodes[key] === code) {
							return key;
						}
					}
				},

				showChar: function(character, target) {
					var convert = {
						'\r' : '\\r',
						'\t' :'\\t',
						'\b' : '\\b'
					};

					if(convert[character]) {
						character = convert[character];
					} else if(character == '[' || character.length > 1) {
						character = '['+character+']';
					}

					current.push(character);

					h.addCode('type','\''+current.join('')+'\'', target);
				},

				keydown: function(ev) {
					var key = h.getKey(ev.keyCode);

					if(keytarget != ev.target) {
						current = [];
						keytarget = ev.target;
					}

					if($.inArray(key, downKeys) == -1) {
						downKeys.push(key);
						h.showChar(key, ev.target);
					}
				},

				keyup: function(ev) {
					var key = h.getKey(ev.keyCode);
					if(syn.key.helpers.isSpecial(ev.keyCode)) {
						h.showChar(key+'-up', ev.target);
					}

					var location = $.inArray(key, downKeys);
					downKeys.splice(location,1);
					justKey = true;
					setTimeout(function() {
						justKey = false;
					},20)
				},

				// returns a selector
				selector: function(target) {
					var selector = target.nodeName.toLowerCase();

					if(target.id) {
						return '#' + target.id;
					} else {
						var parent = target.parentNode;
						while(parent) {
							if(parent.id) {
								selector = '#'+parent.id+' '+selector;
								break;
							} else {
								parent = parent.parentNode;
							}
						}
					}

					if(target.className) {
						selector += '.'+target.className.split(' ')[0];
					}

					var others = jQuery(selector, syn.helpers.getWindow(target).document);

					if(others.length > 1) {
						return selector+':eq('+others.index(target)+')';
					} else {
						return selector;
					}
				}
			},

			lastX,
			lastY,
			justKey = false,

			mousedownH = function(ev) {
				mousedown = ev.target;
				mousemove = 0
				lastX = ev.pageX
				lastY = ev.pageY;
			},

			mouseupH = function(ev){
				if(/option/i.test(ev.target.nodeName)) {

				} else if(!mousemove || (lastX == ev.pageX && lastY == ev.pageY)) {
					h.addCode('click',undefined,ev.target);
				} else if(mousemove > 2 && mousedown) {
					h.addCode('drag','\''+ev.clientX+'X'+ev.clientY+'\'', mousedown);
				}

				mousedown = null;
				mousemove = 0;
				lastY = lastX = null;
			},

			mousemoveH = function(ev) {
				mousemove++;
			},

			changeH = function(ev) {
				//if we changed without a previous keypress
				if(!justKey && ev.target.nodeName.toLowerCase() == 'select') {

					var el = $('option:eq('+ev.target.selectedIndex+')', ev.target);
					h.addCode('click',undefined, el[0])
				}
			};

		$('<iframe src="demo.html"></iframe>').load(function() {
			var iframe = $('iframe');
			var frameWindow = iframe[0].contentWindow;

			keytarget = null;
			$(frameWindow.document).keydown(h.keydown).keyup(h.keyup)
				.mousedown(mousedownH).mousemove(mousemoveH).mouseup(mouseupH)
				.change(changeH)
				.click(function(ev){});

			if(REPLAY) {
				REPLAY = false;
				setTimeout(function() {
					var text = h.commandsText(true);
					ADD = false;
					$('#code div:first').css('color','red')
					eval('with(frameWindow){'+ text +'}' );

					if(commands.length === 0) {
						Recorder.done();
					}
				}, 500);
			}
		}).appendTo($('#app'));

		$('#clear').click(function() {
			$('#code, #clearme').text('');
			commands = [];
		});

		$('#run').click(function() {
			REPLAY = true;
			$('iframe')[0].contentWindow.location.reload(true);
			$('#code div').css('color','gray')
		});
	});
});
