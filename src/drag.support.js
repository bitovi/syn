import syn from "./synthetic.js";

// check if elementFromPageExists
(function dragSupport() {

	// document body has to exists for this test
	if (!document.body) {
		syn.helpers.schedule(dragSupport, 1);
		return;
	}
	var div = document.createElement('div');
	document.body.appendChild(div);
	syn.helpers.extend(div.style, {
		width: "100px",
		height: "10000px",
		backgroundColor: "blue",
		position: "absolute",
		top: "10px",
		left: "0px",
		zIndex: 19999
	});
	document.body.scrollTop = 11;
	if (!document.elementFromPoint) {
		return;
	}
	var el = document.elementFromPoint(3, 1);
	if (el === div) {
		syn.support.elementFromClient = true;
	} else {
		syn.support.elementFromPage = true;
	}
	document.body.removeChild(div);
	document.body.scrollTop = 0;
})();
