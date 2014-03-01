if(!window.Bitovi){
	window.Bitovi = {
			URL: {
				BUILDER: 'http://bitbuilder.herokuapp.com/can.custom.js',
				BUILDER_DATA: 'http://bitbuilder.herokuapp.com/canjs',
				BITHUB: 'http://api.bithub.com/api/events/',
				CDN: '//canjs.com/release/'
			}
		}
}
steal(
	// documentjs's dependencies
	"./content_list.js",
	"./frame_helper.js",
	"./styles/styles.less",
	"./prettify",
	
	// canjs.com's stuff
	"./app.js",
	
	function(ContentList, FrameHelper){
	var codes = document.getElementsByTagName("code");
	for(var i = 0; i < codes.length; i ++){
		var code = codes[i];
		if(code.parentNode.nodeName.toUpperCase() === "PRE"){
			code.className = code.className +" prettyprint"
		}
	}
	prettyPrint();
	
	new ContentList(".contents");
	new FrameHelper(".docs")
})