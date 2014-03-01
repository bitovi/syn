steal("jquery","can","can/construct/super").then("./lib/lib.js","./models/models.js","./controls/controls.js")
.then(function() {
	Bitovi.OSS.initTwitterWidgets = function() {
		if($('.twitter-follow-button').length) {
			// replace the "Follow @canjs!" link with a little wiget with follower count.
			$('#twitter-wjs').remove();
			!function (d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (!d.getElementById(id)) {
					js = d.createElement(s);
					js.id = id;
					js.src = "//platform.twitter.com/widgets.js";
					fjs.parentNode.insertBefore(js, fjs);
				}
			}(document, "script", "twitter-wjs");
		}
	};

	Bitovi.OSS.redrawFont = function() {
		var style = $('<style>:before,:after{content:none !important}</style>');
		$('head').append(style);

		window.setTimeout(function() {
			style.remove();
		}, 0);
	};
	
	
	
	var initControls = function(mappings) {
		can.each(mappings, function(name, selector) {
			$(selector).each(function() {
				new Bitovi.OSS[name]($(this));
			});
		});
	}

	$(function() {
		Bitovi.OSS.initTwitterWidgets();
		initControls({
			'.social': 'SocialStats',
			'.cdn': 'CDNChooser',
			'.communityTabs': 'CommunityTabs',
			'.sidebar': 'Menu'
		});

		new Bitovi.OSS.Example('.container.example', {});

		// Syntax highlighting
		$('pre code').each(function() {
			var el = $(this).parent();
			el.addClass('prettyprint');
			if(!el.hasClass('nolinenums')) {
				el.addClass('linenums');
			}
		});

		prettyPrint();
	});

	// feature-test for canvas
	var canvas = !!((document.createElement('canvas')).getContext);

	if(canvas) {
		// this needs to wait until everything is loaded.
		$(window).load(function() {

			// Grayscaling for our featured apps.
			Grayscale($('.carousel img'), 300);
		});
	}
});