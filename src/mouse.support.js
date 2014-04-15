steal('src/synthetic.js', 'src/mouse.js', function checkSupport(Syn) {

	if (!document.body) {
		Syn.schedule(function () {
			checkSupport(Syn);
		}, 1);
		return;
	}

	window.__synthTest = function () {
		Syn.support.linkHrefJS = true;
	};

	var div = document.createElement("div"),
		checkbox, submit, form, select;

	div.innerHTML = "<form id='outer'>" + "<input name='checkbox' type='checkbox'/>" + "<input name='radio' type='radio' />" + "<input type='submit' name='submitter'/>" + "<input type='input' name='inputter'/>" + "<input name='one'>" + "<input name='two'/>" + "<a href='javascript:__synthTest()' id='synlink'></a>" + "<select><option></option></select>" + "</form>";
	document.documentElement.appendChild(div);
	form = div.firstChild;
	checkbox = form.childNodes[0];
	submit = form.childNodes[2];
	select = form.getElementsByTagName('select')[0];

	//trigger click for linkHrefJS support, childNodes[6] === anchor
	Syn.trigger('click', {}, form.childNodes[6]);

	checkbox.checked = false;
	checkbox.onchange = function () {
		Syn.support.clickChanges = true;
	};

	Syn.trigger("click", {}, checkbox);
	Syn.support.clickChecks = checkbox.checked;

	checkbox.checked = false;

	Syn.trigger("change", {}, checkbox);

	Syn.support.changeChecks = checkbox.checked;

	form.onsubmit = function (ev) {
		if (ev.preventDefault) {
			ev.preventDefault();
		}
		Syn.support.clickSubmits = true;
		return false;
	};
	Syn.trigger("click", {}, submit);

	form.childNodes[1].onchange = function () {
		Syn.support.radioClickChanges = true;
	};
	Syn.trigger("click", {}, form.childNodes[1]);

	Syn.bind(div, 'click', function onclick() {
		Syn.support.optionClickBubbles = true;
		Syn.unbind(div, 'click', onclick);
	});
	Syn.trigger("click", {}, select.firstChild);

	Syn.support.changeBubbles = Syn.eventSupported('change');

	//test if mousedown followed by mouseup causes click (opera), make sure there are no clicks after this
	div.onclick = function () {
		Syn.support.mouseDownUpClicks = true;
	};
	Syn.trigger("mousedown", {}, div);
	Syn.trigger("mouseup", {}, div);

	document.documentElement.removeChild(div);

	//check stuff
	Syn.support.ready++;
});
