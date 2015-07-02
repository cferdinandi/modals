# Modals [![Build Status](https://travis-ci.org/cferdinandi/modals.svg)](https://travis-ci.org/cferdinandi/modals)
Simple modal dialogue windows.

[Download Modals](https://github.com/cferdinandi/modals/archive/master.zip) / [View the demo](http://cferdinandi.github.io/modals/)

**In This Documentation**

1. [Getting Started](#getting-started)
2. [Installing with Package Manager](#installing-with-package-managers)
3. [Working with the Source Files](#working-with-the-source-files)
4. [Options & Settings](#options-and-settings)
5. [Browser Compatibility](#browser-compatibility)
6. [How to Contribute](#how-to-contribute)
7. [License](#license)



## Getting Started

Compiled and production-ready code can be found in the `dist` directory. The `src` directory contains development code. Unit tests are located in the `test` directory.

### 1. Include Modals on your site.

```html
<link rel="stylesheet" href="dist/css/modals.css">
<script src="dist/js/classList.js"></script>
<script src="dist/js/modals.js"></script>
```

Modals is [built with Sass](http://sass-lang.com/) for easy customization. If you don't use Sass, that's ok. The `css` folder contains compiled vanilla CSS.

The `_config.scss` and `_mixins.scss` files are the same ones used in [Kraken](http://cferdinandi.github.io/kraken/), so you can drop the `_modals.css` file right into Kraken without making any updates. Or, adjust the variables to suit your own project.

Modals also requires [classList.js](https://github.com/eligrey/classList.js), a polyfill that extends ECMAScript 5 API support to more browsers.

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

* **NPM:** `npm install cferdinandi/modals`
* **Bower:** `bower install https://github.com/cferdinandi/modals.git`
* **Component:** `component install install cferdinandi/modals`



## Working with the Source Files

If you would prefer, you can work with the development code in the `src` directory using the included [Gulp build system](http://gulpjs.com/). This compiles, lints, and minifies code, and runs unit tests. It's the same build system that's used by [Kraken](http://cferdinandi.github.io/kraken/), so it includes some unnecessary tasks and Sass variables but can be dropped right in to the boilerplate without any configuration.

### Dependencies
Make sure these are installed first.

* [Node.js](http://nodejs.org)
* [Ruby Sass](http://sass-lang.com/install)
* [Gulp](http://gulpjs.com) `sudo npm install -g gulp`

### Quick Start

1. In bash/terminal/command line, `cd` into your project directory.
2. Run `npm install` to install required files.
3. When it's done installing, run one of the task runners to get going:
	* `gulp` manually compiles files.
	* `gulp watch` automatically compiles files and applies changes using [LiveReload](http://livereload.com/).



## Options and Settings

Modals includes smart defaults and works right out of the box. But if you want to customize things, it also has a robust API that provides multiple ways for you to adjust the default options and settings.

### Global Settings

You can pass options and callbacks into Modals through the `init()` function:

```javascript
modals.init({
	modalActiveClass: 'active', // Class applied to active modal windows
	modalBGClass: 'modal-bg', // Class applied to the modal background overlay
	backspaceClose: true, // Boolean, whether or not to enable backspace/delete button modal closing
	callbackBeforeOpen: function ( toggle, modalID ) {}, // Functions to run before opening a modal
	callbackAfterOpen: function ( toggle, modalID ) {}, // Functions to run after opening a modal
	callbackBeforeClose: function () {}, // Functions to run before closing a modal
	callbackAfterClose: function () {} // Functions to run after closing a modal
});
```

*If your modal includes any form fields, you should set `backspaceClose` to `false` or users will not be able to delete their text.*

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
	toggle, // The node that triggered the close action
	options // Classes and callbacks. Same options as those passed into the init() function.
);
```

**Example**

```javascript
modals.closeModals();
```

#### destroy()
Destroy the current `modals.init()`. This is called automatically during the init function to remove any existing initializations.

```javascript
modals.destroy();
```



## Brower Compatibility

Modals works in all modern browsers, and IE 9 and above.

Modals is built with modern JavaScript APIs, and uses progressive enhancement. If the JavaScript file fails to load, or if your site is viewed on older and less capable browsers, all content will be displayed by default.



## How to Contribute

In lieu of a formal style guide, take care to maintain the existing coding style. Please apply fixes to both the development and production code. Don't forget to update the version number, and when applicable, the documentation.



## License

The code is available under the [MIT License](LICENSE.md).