# Modals [![Build Status](https://travis-ci.org/cferdinandi/modals.svg)](https://travis-ci.org/cferdinandi/modals)
Simple modal dialogue windows.

[Download Modals](https://github.com/cferdinandi/modals/archive/master.zip) / [View the demo](http://cferdinandi.github.io/modals/)

**In This Documentation**

1. [Getting Started](#getting-started)
2. [Installing with Package Manager](#installing-with-package-managers)
3. [Options & Settings](#options-and-settings)
4. [Browser Compatibility](#browser-compatibility)
5. [How to Contribute](#how-to-contribute)
6. [License](#license)
7. [Changelog](#changelog)
8. [Older Docs](#older-docs)



## Getting Started

Compiled and production-ready code can be found in the `dist` directory. The `src` directory contains development code. Unit tests are located in the `test` directory.

### 1. Include Modals on your site.

```html
<link rel="stylesheet" href="dist/css/modals.css">
<script src="dist/js/classList.js"></script>
<script src="dist/js/bind-polyfill.js"></script>
<script src="dist/js/modals.js"></script>
```

Modals is [built with Sass](http://sass-lang.com/) for easy customization. If you don't use Sass, that's ok. The `css` folder contains compiled vanilla CSS.

The `_config.scss` and `_mixins.scss` files are the same ones used in [Kraken](http://cferdinandi.github.io/kraken/), so you can drop the `_modals.css` file right into Kraken without making any updates. Or, adjust the variables to suit your own project.

Modals also requires [classList.js](https://github.com/eligrey/classList.js) and `bind-polyfill.js`, polyfills that extend ECMAScript 5 API support to more browsers.

### 2. Add the markup to your HTML.

```html
<a data-modal="#modal" href="#">Modal Toggle</a>

<div class="modal" data-modal-window id="modal">
	<a class="close" data-modal-close>x</a>
	<h3>Modal</h3>
	<p>Modal content</p>
	<button data-modal-close>Close</button>
</div>
```

Be sure to assign each modal a unique ID. Add the `.modal-medium` or `.modal-small` class to change the modal size.

```html
<div class="modal modal-small" data-modal-window id="modal">
	...
</div>
```

Adding a `[data-modal-close]` data attribute to any button or link turns it into a modal dismiss link. The `.modal-close` class adds special styling to close links (if you wanted to use an X for close, for example). Clicking anywhere outside the modal or pressing the escape key will close the modal, too.

### 3. Assign a backup URL.

Always specify a functioning link as a backup for modals.

Modals uses modern JavaScript API's that aren't supported by older browsers, including IE 8 and lower. On modern browsers, Modals will prevent the backup URL from redirecting people away from the current page.

```html
<a data-modal="#modal" href="http://backup-url.com">Modal Toggle</a>
```

*If you need to support older browsers, you can still [download the jQuery version of modals on GitHub](https://github.com/cferdinandi/modals/tree/archive-v1).*

### 4. Initialize Modals.

```html
<script>
	modals.init();
</script>
```

In the footer of your page, after the content, initialize Modals. And that's it, you're done. Nice work!



## Installing with Package Managers

You can install Modals with your favorite package manager.

* **`NPM:** npm install cferdinandi/modals`
* **Bower:** `bower install https://github.com/cferdinandi/modals.git`
* **Component:** `component install install cferdinandi/modals`



## Options and Settings

Modals includes smart defaults and works right out of the box. But if you want to customize things, it also has a robust API that provides multiple ways for you to adjust the default options and settings.

### Global Settings

You can pass options and callbacks into Modals through the `init()` function:

```javascript
modals.init({
	modalActiveClass: 'active', // Class applied to active modal windows
	modalBGClass: 'modal-bg', // Class applied to the modal background overlay
	offset: 50, // How far from the top of the viewport to offset modal windows in pixels
	callbackBeforeOpen: function ( toggle, modalID ) {}, // Functions to run before opening a modal
	callbackAfterOpen: function ( toggle, modalID ) {}, // Functions to run after opening a modal
	callbackBeforeClose: function () {}, // Functions to run before closing a modal
	callbackAfterClose: function () {} // Functions to run after closing a modal
});
```

### Use Modals events in your own scripts

You can also call Modals events in your own scripts.

#### openModal()
Open a specific modal window.

```javascript
modals.openModal(
	toggle, // Node that launches the modal. ex. document.querySelector('#toggle')
	modalID, // The ID of the modal to launch. ex '#modal'
	options, // Classes and callbacks. Same options as those passed into the init() function.
	event // Optional, if a DOM event was triggered.
);
```

**Example**

```javascript
modals.openModal( null, '#modal' );
```

#### closeModals()
Close all modal windows.

```javascript
modals.closeModals(
	options, // Classes and callbacks. Same options as those passed into the init() function.
	event // Optional, if a DOM event was triggered.
);
```

**Example**

```javascript
modals.closeModals();
```



## Brower Compatibility

Modals works in all modern browsers, and IE 9 and above.

Modals is built with modern JavaScript APIs, and uses progressive enhancement. If the JavaScript file fails to load, or if your site is viewed on older and less capable browsers, all content will be displayed by default.



## How to Contribute

In lieu of a formal style guide, take care to maintain the existing coding style. Don't forget to update the version number, the changelog (in the `readme.md` file), and when applicable, the documentation.



## License

Modals is licensed under the [MIT License](http://gomakethings.com/mit/).



## Changelog

Modals uses [semantic versioning](http://semver.org/).

* v5.4.0 - August 23, 2014
	* Switched to Ruby Sass.
	* Fixed unit test paths.
	* Switched to event bubbling.
* v5.3.2 - August 15, 2014
	* Added fix for UMD structure.
* v5.3.1 - August 8, 2014
	* Added polyfill for `Functions.prototype.bind`.
	* Removed Sass paths from `gulpfile.js`.
* v5.3.0 - June 30, 2014
	* Updated unit tests.
	* Added `destroy()` method.
* v5.2.1 - June 28, 2014
	* Fixed `extend()` method.
* v5.2.0 - June 21, 2014
	* Converted to gulp.js workflow.
	* Added unit testing.
	* Updated naming conventions.
	* Added minified versions of files.
* v5.1.1 - June 19, 2014
	* Fixed factory/root/UMD definition.
* v5.1.0 - June 8, 2014
	* Added AMD support.
	* Moved public APIs to exports variable.
	* Improved feature test.
	* Replaced `Array.prototype.forEach` hack with proper `forEach` function.
	* Added a more well supported `trim` function.
	* General code optimizations for better minification and performance.
	* Updated to JSDoc documentation.
	* Updated to three number versioning system.
	* Added package manager installation info.
* v5.0 - April 4, 2014
	* Converted from Buoy class helpers to `classList` with polyfill.
* v4.2 - March 19, 2014
	* Passed arguments into callback open functions.
* v4.1 - February 27, 2014
	* Converted `_defaults` to a literal object
* v4.0 - February 24, 2014
	* Better public/private method namespacing.
	* Require `init()` call to run.
	* New API exposes additional methods for use in your own scripts.
	* Better documentation.
* v3.4 - February 16, 2014
	* [Added method to stop YouTube, Vimeo, and HTML5 videos from playing when modal is closed.](https://github.com/cferdinandi/modals/issues/5)
* v3.3 - February 10, 2014
	* [Fix `event.preventDefault()` bug that was blocking radio button and checkbox behavior.](https://github.com/cferdinandi/modals/issues/6)
* v3.2 - Feburary 5, 2014
	* [Fixed `setAttribute` bug in FireFox.](https://github.com/cferdinandi/kraken/issues/34)
* v3.1 - February 4, 2014
	* Reverted to `Array.prototype.foreach` loops.
* v3.0 - January 28, 2014
	* Switched to a data attribute for the toggle selector (separates scripts from styles).
	* Added namespacing to IIFE.
	* Updated looping method.
* v2.4 - December 3, 2013
	* Added Sass support.
* v2.3 - August 27, 2013
	* Added missing semicolon to variables.
	* Activated strict mode.
* v2.2 - August 26,2013
	* Converted to an IIFE pattern.
	* Added Buoy vanilla JS micro-library.
* v2.1 - August 18, 2013
	* Added touchevent to close modals.
* v2.0 - August 12, 2013
	* Converted to vanilla JavaScript.
	* Removed jQuery dependency.
* v1.1 - June 7, 2013
	* Switched to MIT license.
* v1.1 - March 27, 2013
	* Touchscreen bug fix.
* v1.0 - March 25, 2013
	* Initial release.



## Older Docs

* [Version 4](https://github.com/cferdinandi/modals/tree/archive-v4)
* [Version 3](http://cferdinandi.github.io/modals/archive/v3/)
* [Version 1](https://github.com/cferdinandi/modals/tree/archive-v1)