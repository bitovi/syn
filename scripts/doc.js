load('steal/rhino/rhino.js');

steal("documentjs", "steal/rhino/json.js", function (DocumentJS) {

	var cap = function(str){
		return str.substr(0,1).toUpperCase()+str.substr(1)
	}
	var documentTitle = function(){
		if(this.page.toLowerCase() == "index"){
			return "Syn";
		}
		
		if(this.page !== "guides" && this.page !== "docs"){
			return cap(this.page)+" - Syn"
		}
		
		var title = this.title || this.name;
		if(title){
			if(title === "Guides"){
				return cap(this.page)+ " - FuncUnit"
			} else if(title === "FuncUnit"){
				return "API - FuncUnit"
			}
			if(this.page === "docs"){
				return (this.name || this.title) + " - Syn API"
			} else {
				return title+" - FuncUnit "+cap(this.page)
			}
		}
		return "FuncUnit"
	}

	var pkg = JSON.parse(readFile('./syn/bower.json'));

	DocumentJS('scripts/doc.html',{
		"markdown": ['syn'],
		"out": "docs",
		"root": "..",
		"package": pkg,
		"parent": "Syn",
		"static" : "scripts/static",
		"templates": "scripts/templates",
		statics: {
			src: "_pages"
		},
		helpers: function(data, config, getCurrent, oldHelpers){
			return {
				documentTitle: documentTitle,
				validGroup: function(options) {
					if(this.name == "Syn.prototype" || this.name == "Syn.static") {
						return options.inverse(this);
					} else {
						return options.fn(this);
					}
				}
			}
		}
		
	});

});
