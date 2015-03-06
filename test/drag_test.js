var syn = require('syn');
var locate = require('test/locate_test');
var QUnit = require("steal-qunit");
var $ = require("jquery");
require("syn/drag");

QUnit.module("syn/drag");

// test("dragging off the page", function(){
// var drags = ( {}),
// drops = ({});
// 
// 
// 
// var div = $("<div>"+
// "<div id='drag'></div>"+
// "<div id='drop'></div>"+
// "</div>");
// 	
// div.appendTo($("#qunit-fixture"));
// var basicCss = {
// width: "20px",
// height: "20px",
// border: "solid 1px black"
// }
// $("#drag").css(basicCss).css({top: "300px", left: "0px", backgroundColor: "green", zIndex: 99})
// $("#drop").css(basicCss).css({top: "300px", marginTop: "1000px", left: "30px", backgroundColor: "yellow"});
// 	
// 	
// $('#drag')
// .on("draginit", function(){})
// 		
// $('#drop')
// .on("dropinit", function(){ })
// .on("dropover", function(){ 
// drops.dropover = true;
// })
// 	
// stop();
// 	
// syn.drag($("#drag")[0], {to: "#drop", duration: 700}, function(){
// ok(drops.dropover,"dropover fired correctly")
// $("#qunit-fixture").innerHTML = "";
// start();
// })
// })

QUnit.test("move", function () {
	var div = $("<div id='wrap'>" +
		"<div id='left'></div>" +
		"<div id='right'></div>" +
		"</div>");

	div.appendTo(document.body);
	var basicCss = {
		width: "90px",
		height: "100px",
		position: "absolute",
		border: "solid 1px black"
	};
	$('#wrap')
		.css({
			position: "absolute",
			top: "0px",
			left: "0px",
			width: "200px",
			height: "100px",
			backgroundColor: "yellow"
		});
	$("#left")
		.css(basicCss)
		.css({
			top: "0px",
			left: "10px",
			backgroundColor: "green"
		});
	$("#right")
		.css(basicCss)
		.css({
			top: "0px",
			left: "100px",
			backgroundColor: "blue"
		});

	var clientX = -1,
		clientY = -1,
		els = [$('#wrap')[0], $('#left')[0], $('#right')[0], $('#wrap')[0]],
		targets = [];

	var move = function (ev) {
		if (ev.clientX === 0 && ev.clientY === 0) {
			// this happens once per run in Chrome only
			return;
		}
		if (ev.clientX < clientX) {
			ok(false, "mouse isn't moving right");
		}
		clientX = ev.clientX;
		if (ev.clientY < clientY) {
			console.log('y', ev.clientY, clientY);
			ok(false, "mouse isn't moving right");
		}
		clientY = ev.clientY;
		if (!targets.length || targets[targets.length - 1] !== ev.target) {
			targets.push(ev.target);
		}
	};
	$(document.documentElement)
		.bind('mousemove', move);

	stop();
	syn.move("wrap", {
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
		$(document.documentElement)
			.unbind('mousemove', move);
			
		for (var i = 0; i < els.length; i++) {
			equal(targets[i], els[i], "target is right");
		}

		div.remove();
		start();
	});
});

//These rely on jquery++ events atm. TODO: remove tests as this produces a circular dependency between jQuery++ and syn
// test("dragging an element with duration", function(){
// 	var drags = ( {}),
// 		drops = ({});

// 	var div = $("<div>"+
// 			"<div id='drag'></div>"+
// 			"<div id='midpoint'></div>"+
// 			"<div id='drop'></div>"+
// 			"</div>");

// 	div.appendTo($("#qunit-fixture"));
// 	var basicCss = {
// 		width: "20px",
// 		height: "20px",
// 		border: "solid 1px black",
// 		position: "absolute"
// 	}
// 	$("#drag").css(basicCss).css({top: "300px", left: "0px", backgroundColor: "green", zIndex: 99})
// 	$("#midpoint").css(basicCss).css({top: "300px", left: "30px", backgroundColor: "blue"})
// 	$("#drop").css(basicCss).css({top: "330px", left: "30px", backgroundColor: "yellow"});

// 	$('#drag')
// 		.on("dragdown", function(){
// 			drags.dragdown = true;
// 		})
// 		.on("draginit", function(){
// 			drags.draginit = true;
// 		})
// 		.on("dragmove", function(){
// 			drags.dragmove = true;
// 		})
// 		.on("dragend", function(){
// 			drags.dragend = true;
// 		})
// 		.on("dragover", function(){
// 			drags.dragover = true;
// 		})
// 		.on("dragout", function(){
// 			drags.dragout = true;
// 		});

// 	$('#drop')
// 		.on("dropinit", function(){ 
// 			drops.dropinit = true;
// 		})
// 		.on("dropover", function(){ 
// 			drops.dropover = true;
// 		})
// 		.on("dropout", function(){ 
// 			drops.dropout = true;
// 		})
// 		.on("dropmove", function(){ 
// 			drops.dropmove = true;
// 		})
// 		.on("dropon", function(){ 
// 			drops.dropon = true;
// 		})
// 		.on("dropend", function(){ 
// 			drops.dropend = true;
// 		})

// 	stop();

// 	syn.drag($("#drag")[0], {to: "#midpoint", duration: 700}, function(){

// 		ok(drags.draginit, "draginit fired correctly")
// 		ok(drags.dragmove, "dragmove fired correctly")
// 		ok(!drags.dragover,"dragover not fired yet")

// 		ok(!drops.dropover,"dropover fired correctly")
// 		ok(!drops.dropon,	"dropon not fired yet")
// 		ok(drops.dropend, 	"dropend fired");

// 		syn.drag($("#drag")[0], {to: "#drop", duration: 700}, function(){
// 			ok(drops.dropinit, 	"dropinit fired correctly")
// 			ok(drops.dropover, 	"dropover fired correctly")
// 			ok(drops.dropmove, 	"dropmove fired correctly")
// 			ok(drops.dropon, 	"dropon fired correctly")

// 			syn.drag($("#drag")[0], {to: "#midpoint", duration: 700}, function(){
// 				ok(drags.dragout, 	"dragout fired correctly")
// 				ok(drops.dropout, 	"dropout fired correctly")
// 				$("#qunit-fixture").innerHTML = "";
// 				start();
// 			})

// 		});
// 	})
// })

