<!--

@constructor Syn
@group actions Actions
@group keys Keys
@group mouse Mouse
@group chained Chaining

-->

[![Build Status](https://travis-ci.org/bitovi/syn.png?branch=master)](https://travis-ci.org/bitovi/syn.png?branch=master)

__Notice 01-23-2014__

We've reset the version to 0.0.x as we're refactoring the project internally. No code or functionality is being removed, however we'll be following SEMVER going forward as opposed to the original REVOLUTION.MAJOR.MINOR versioning we've had in the past(the first version being 3.2.x didn't make sense).

There will be a few changes as we approach a true v1:

	- Mobile events
	- Syn -> syn This is convention as `Syn` is not a constructor
	- Redesign of the jQuery plugin API(eg: $.fn.triggerSyn)

The history of Syn will be maintained, however with the version change, we will be removing the old 3.x tags. Original history in its entirety can be found at: https://github.com/bitovi/legacy-syn

## What It Is

Syn is a synthetic event library that pretty much handles typing, clicking, moving, and 
dragging exactly how a real user would perform those actions.

## Relevant Links

1. [http://bitovi.com/blog/2010/07/syn-a-standalone-synthetic-event-library.html](http://bitovi.com/blog/2010/07/syn-a-standalone-synthetic-event-library.html)
2. Full Syn docs coming soon!

## Using Syn

You'd use syn to perform functional testing or simulate user actions on a JavaScript application. To add syn to your page all you need to do is add [syn.js](https://rawgithub.com/bitovi/syn/master/dist/syn.js) to your page. Syn is also available via Bower:

    bower install syn

## Running Syn Tests

Load test/index.html in any browser to run all the tests.
