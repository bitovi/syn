# Syn

[![Join the chat at https://gitter.im/bitovi/syn](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/bitovi/syn?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/bitovi/syn/blob/master/LICENSE.md)
[![npm version](https://badge.fury.io/js/syn.svg)](https://www.npmjs.com/package/syn)
[![Travis build status](https://travis-ci.org/bitovi/syn.svg?branch=master)](https://travis-ci.org/bitovi/syn)
[![Greenkeeper badge](https://badges.greenkeeper.io/bitovi/syn.svg)](https://greenkeeper.io/)

For questions or discussion, check out our [forums](https://forums.donejs.com/c/testing).

> If you are looking for the Synergy project, you can find it [here](https://www.npmjs.com/~postquagga). Thanks
> [postquagga](https://www.npmjs.com/~postquagga) for letting us use the name!

`syn` lets you simulate user behavior like typing, clicking, moving, and
dragging exactly how a real user would perform those actions. It can be easily dropped into
existing

```js
it("does something when you click and type and drag", async function(){

    await syn.click( '#hello' );
    await syn.type(  '#hello', 'Hello World' );
    await syn.drag(  '#hello', '#trash' )

    // check the results
});
```

## Install

Install Syn via the command line with npm:

```shell
npm install syn
```

Inside the download and npm package there are the following folders:

 - `dist/global/syn.js` - A standalone file that can be used with a `<script>` tag.

## Setup

The following walk you through how to load Syn into various environments.

### Webpack / StealJS

Assuming you installed with `npm`, simply `require("syn")` like the following:

```js
const syn = require("syn");
syn.click('#hello');
```

### Script Tag / Standalone

If you don't use a module loader, you can simply add the following to your page:

    <script src='PATH/TO/dist/syn.js'></script>

_PATH/TO_ should be the path to the installed syn folder.

## Use

`syn` has 6 core user behavior actions that
simulate most of how a user interacts with a page.

`syn` also has the ability to configure event behavior. This can be useful if you need to simulate something that
syn does not currently support.

### Core user behavior actions

The core user behavior actions all:

- take an element (either has a CSS selector )
- take optional options that can configure the behavior of the
- return a promise

These methods are all intended to work within an
[async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) and use `await` as follows:

```js
it("your test function", async function(){

    await syn.click(      '#hello' );
    await syn.rightClick( '#hello' );
    await syn.dblClick(   '#hello' );
    await syn.type(       '#hello', 'Hello World' );
    await syn.key(        '#hello', '!' );
    await syn.drag(       '#hello', '#trash' );
    await syn.move(       '#trash', '#hello' );
    // check the results
});
```

#### syn.click( element [, options] )

Click an element.  This will properly dispatch all the mouse, pointer and focus events
and default behavior that a user would create when "clicking" on an element.

Examples:

```js
// clicks the element with 'big-button' as its ID
await syn.click( "#big-button" )

// does the same thing as the previous example, but passes an
// element directly.
await syn.click( document.querySelector('#big-button') )
```

Parameters:

- __element__ `HTMLElement|CSSSelector` An element to click or a CSS selector used to find the element to click.
- __options__ `Object` Options used to extend the event objects that are dispatched.

Returns:

- `Promise<Boolean>` A promise that resolves to `false` if `event.preventDefault()` was called, returns `true` if otherwise.

#### syn.rightClick( element [, options] )

#### syn.dblclick( element [, options] )

#### syn.type( element, text  )

#### syn.key( element, key  )

#### syn.drag( element, optionsOrTarget )

#### syn.move( element, optionsOrTarget )

Moves a pointer from one position to another.
Note that this will will dispatch all the move, enter, and leave events
one might expect from a mouse moving over the page.

Examples:

```js
// Move from the center of the '#from' element to the center of the '#to' element
await syn.move("#from", "#to");

// Move from the center of the '#from' element to the center of the '#to' element
// in one second
await syn.move( document,{
  from: "#from",
  to: "#to",
  duration: 1000
});

// Move from the top-left corner of the page to 100px down and 100px to the right
await syn.move( document, {
  from: "0x0",
  to: "100x100"
});

// Same as above, but a longer syntax
await syn.move( document, {
  from: {pageX: 0, pageY: 0},
  to: {pageX: 100, pageY: 100}
});

// Move from the top-left corner of the screen to 100px down and 100px to the right
await syn.move( document, {
  from: {clientX: 0, clientY: 0},
  to: {clientX: 100, clientY: 100}
});

// Move from the center of '#from' right 20 pixels and up 30 pixels
await syn.move("#from", "+20 +30");
```

Parameters:

- __element__ `HTMLElement|CSSSelector` If `optionsOrTarget.from` is not specified, the move will
  use the center of this element as the starting point.  An element reference
  _MUST_ be provided so syn knows how to dispatch the events correctly.
  The `document` can be provided in this case.
- __optionsOrTarget__ `HTMLElement|String|Object` If an HTMLElement or a String is
  provided, the move will use the center of the specified element as the endpoint of
  the move. Otherwise, an object with the following values can be provided:

  ```js
  {
    // Specifies where the move should start at
    // Element - start at the geometric center
    // CSSSelector - find this element in the page, start at the geometric center
    // PagePosition - where in the page move will start. Ex: "300x300"
    // ClientPosition - where in the window move will start. Ex: "300X300"
    // RelativePosition - where to start relative to the element. Ex: "+300 -20"
    from: Element|CSSSelector|PagePosition|ClientPosition|RelativePosition,

    // Specifies where the move should start at
    // Element - start at the geometric center
    // CSSSelector - find this element in the page, start at the geometric center
    // PagePosition - where in the page move will start. Ex: `"300x300"`
    // ClientPosition - where in the window move will start. Ex: `"300X300"`
    // RelativePosition - where to start relative to the element. Ex: `"+300 -20"`
    to: Element|CSSSelector|PagePosition|ClientPosition|RelativePosition,

    // Number of ms the move should occur within. Ex: `100`. Defaults to 500.
    duration: Integer
  }
  ```

Returns:

- `Promise<>` Returns a promise that resolves when the move has completed.


### Configuration

> This section will be


## Contributing

Check out the [contribution guide](CONTRIBUTING.md).
