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
	Syn.trigger(form.childNodes[6], 'click', {});

	checkbox.checked = false;
	checkbox.onchange = function () {
		Syn.support.clickChanges = true;
	};

	Syn.trigger(checkbox, "click", {});
	Syn.support.clickChecks = checkbox.checked;

	checkbox.checked = false;

	Syn.trigger(checkbox, "change", {});

	Syn.support.changeChecks = checkbox.checked;

	form.onsubmit = function (ev) {
		if (ev.preventDefault) {
			ev.preventDefault();
		}
		Syn.support.clickSubmits = true;
		return false;
	};
	Syn.trigger(submit, "click", {});

	form.childNodes[1].onchange = function () {
		Syn.support.radioClickChanges = true;
	};
	Syn.trigger(form.childNodes[1], "click", {});

	Syn.bind(div, 'click', function onclick() {
		Syn.support.optionClickBubbles = true;
		Syn.unbind(div, 'click', onclick);
	});
	Syn.trigger(select.firstChild, "click", {});

	Syn.support.changeBubbles = Syn.eventSupported('change');

	//test if mousedown followed by mouseup causes click (opera), make sure there are no clicks after this
	div.onclick = function () {
		Syn.support.mouseDownUpClicks = true;
	};
	Syn.trigger(div, "mousedown", {});
	Syn.trigger(div, "mouseup", {});

	document.documentElement.removeChild(div);

	//check stuff
	Syn.support.ready++;
});
