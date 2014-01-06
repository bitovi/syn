steal("src/synthetic.js", function(Syn){
	module("synthetic/typeable");

	var isTypeable = Syn.typeable.test;

	test("Inputs and textareas", function(){
		var input = document.createElement("input");
		var textarea = document.createElement("textarea");

		equal(isTypeable(input), true, "Input element is typeable.");
		equal(isTypeable(textarea), true, "Text area is typeable.");
	});

	test("Normal divs", function(){
		var div = document.createElement("div");

		equal(isTypeable(div), false, "Divs are not typeable.");
	});

	test("Contenteditable div", function(){
		var div = document.createElement("div");

		// True
		div.setAttribute("contenteditable", "true");
		equal(isTypeable(div), true, "Divs with contenteditable true");

		// Empty string
		div.setAttribute("contenteditable", "");
		equal(isTypeable(div), true, "Divs with contenteditable as empty string.");
	});

	test("User defined typeable function", function(){
		// We're going to define a typeable with a class of foo.
		Syn.typeable(function(node){
			return node.className.split(" ").indexOf("foo") !== -1;
		});

		var div = document.createElement("div");
		div.className = "foo";

		equal(isTypeable(div), true, "Custom function works.");
	});

});
