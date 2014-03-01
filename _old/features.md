@page funcunit.features Features
@parent guides 4

@body
## Why FuncUnit

TESTING IS PAINFUL.  Everyone hates testing, and most front end developers simply don't test.  There 
are a few reasons for this:

1. **Barriers to entry** - Difficult setup, installation, high cost, or difficult APIs.  QTP costs $5K per license.
2. **Completely foreign APIs** - Testing frameworks often use other languages (Ruby, C#, Java) and new APIs.
3. **Debugging across platforms** - You can't use firebug to debug a test that's driven by PHP.
4. **Low fidelity event simulation** - Tests are often brittle or low fidelity because frameworks aren't designed to test heavy JavaScript apps, so 
browser event simualation accuracy isn't a top priority.
5. **QA and developers can't communicate** - If only QA has the ability to run tests, sending bug reports is messy and time consuming.

FuncUnit aims to fix these problems:

1. FuncUnit is free and has no setup or installation (just requires Java and a browser). 
2. FuncUnit devs know jQuery, and FuncUnit leverages that knowldge with a jQuery-like API.
3. You can run tests in browser and set Firebug breakpoints.
4. Syn.js is a low level event simuation library that goes to extra trouble to make sure each browser simulates events exactly as intended.
5. Since tests are just JS and HTML, they can be checked into a project and any dev can run them easily.  QA just needs to send a URL to a broken 
test case.

There are many testing frameworks out there, but nothing comes close to being a complete solution for front end testing like FuncUnit does.

## Changes from 3.2

FuncUnit has undergone some big changes from JavaScriptMVC 3.2.

### Core project refactor

Since the development of [Testee.js](http://github.com/bitovi/testee.js), we've refactored the "runner" bits out of FuncUnit. You can now consider FuncUnit the sugar on top of your existing QUnit or Jasmine setup.

### Jasmine support

FuncUnit is now completely compatible with Jasmine runners. No need to migrate to QUnit if you're already setup!

### Updated to latest QUnit

The latest version of QUnit has a few nice features and an updated UI.