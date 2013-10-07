What It Is

Syn is a synthetic event library that pretty much handles typing, clicking, moving, and 
dragging exactly how a real user would perform those actions.

Relevant Links

1. http://bitovi.com/blog/2010/07/syn-a-standalone-synthetic-event-library.html
2. Full Syn docs coming soon!

Using Syn

You'd use syn to perform functional testing or simulate user actions on a JavaScript application. To add syn to your page all you need to do is add [syn.js](http://github.com/bitovi/syn/dist/syn.js) to your page.

If you are using a dependency loader, be sure to shim Syn as follows:

```
shim : {
	syn: {
		exports: "Syn"
	}
}
```

Running Syn Tests

Load syn/qunit.html in any browser to run all the tests.