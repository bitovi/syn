steal('src/synthetic.js', 'src/key.js', function (Syn) {

	if (!Syn.config.support) {
		//do support code
		(function checkForSupport() {
			if (!document.body) {
				return Syn.schedule(checkForSupport, 1);
			}

			var div = document.createElement("div"),
				checkbox, submit, form, anchor, textarea, inputter, one, doc;

			doc = document.documentElement;

			div.innerHTML = "<form id='outer'>" +
				"<input name='checkbox' type='checkbox'/>" +
				"<input name='radio' type='radio' />" +
				"<input type='submit' name='submitter'/>" +
				"<input type='input' name='inputter'/>" +
				"<input name='one'>" +
				"<input name='two'/>" +
				"<a href='#abc'></a>" +
				"<textarea>1\n2</textarea>" +
				"</form>";

			doc.insertBefore(div, doc.firstElementChild || doc.children[0]);
			form = div.firstChild;
			checkbox = form.childNodes[0];
			submit = form.childNodes[2];
			anchor = form.getElementsByTagName("a")[0];
			textarea = form.getElementsByTagName("textarea")[0];
			inputter = form.childNodes[3];
			one = form.childNodes[4];

			form.onsubmit = function (ev) {
				if (ev.preventDefault) {
					ev.preventDefault();
				}
				Syn.support.keypressSubmits = true;
				ev.returnValue = false;
				return false;
			};
			// Firefox 4 won't write key events if the element isn't focused
			Syn.__tryFocus(inputter);
			Syn.trigger("keypress", "\r", inputter);

			Syn.trigger("keypress", "a", inputter);
			Syn.support.keyCharacters = inputter.value === "a";

			inputter.value = "a";
			Syn.trigger("keypress", "\b", inputter);
			Syn.support.backspaceWorks = inputter.value === "";

			inputter.onchange = function () {
				Syn.support.focusChanges = true;
			};
			Syn.__tryFocus(inputter);
			Syn.trigger("keypress", "a", inputter);
			Syn.__tryFocus(form.childNodes[5]); // this will throw a change event
			Syn.trigger("keypress", "b", inputter);
			Syn.support.keysOnNotFocused = inputter.value === "ab";

			//test keypress \r on anchor submits
			Syn.bind(anchor, "click", function (ev) {
				if (ev.preventDefault) {
					ev.preventDefault();
				}
				Syn.support.keypressOnAnchorClicks = true;
				ev.returnValue = false;
				return false;
			});
			Syn.trigger("keypress", "\r", anchor);

			Syn.support.textareaCarriage = textarea.value.length === 4;

			// IE only, oninput event.
			Syn.support.oninput = 'oninput' in one;

			doc.removeChild(div);

			Syn.support.ready++;
		})();
	} else {
		Syn.helpers.extend(Syn.support, Syn.config.support);
	}

	return Syn;
});
