var st = {
	g: function (id) {
		return document.getElementById(id);
	},
	log: function (c) {
		if (st.g("mlog")) {
			st.g("mlog")
				.innerHTML = st.g("mlog")
				.innerHTML + c + "<br/>";
		}
	},
	binder: function (id, ev, f) {
		st.bind(st.g(id), ev, f);
	},
	unbinder: function (id, ev, f) {
		st.unbind(st.g(id), ev, f);
	},
	bind: function (el, ev, f) {
		return el.addEventListener ?
			el.addEventListener(ev, f, false) :
			el.attachEvent("on" + ev, f);
	},
	unbind: function (el, ev, f) {
		return el.addEventListener ?
			el.removeEventListener(ev, f, false) :
			el.detachEvent("on" + ev, f);
	},
	rootJoin: (typeof steal === "undefined" ? function (path) {
		return "../" + path;
	} :
	function (path) {
		var base = System.baseURL;
		return steal.joinURIs(base, path);
	})
};
module.exports = st;