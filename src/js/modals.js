(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define('modals', factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.modals = factory(root);
	}
})(window || this, function (root) {

	'use strict';

	//
	// Variables
	//

	var publicApi = {}; // Object for public APIs
	var supports = !!document.querySelector && !!root.addEventListener; // Feature test
	var settings;

	// Default settings
	var defaults = {
		modalActiveClass: 'active',
		modalBGClass: 'modal-bg',
		offset: 50,
		callbackBeforeOpen: function () {},
		callbackAfterOpen: function () {},
		callbackBeforeClose: function () {},
		callbackAfterClose: function () {}
	};


	//
	// Methods
	//

	/**
	 * A simple forEach() implementation for Arrays, Objects and NodeLists
	 * @private
	 * @param {Array|Object|NodeList} collection Collection of items to iterate
	 * @param {Function} callback Callback function for each iteration
	 * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
	 */
	var forEach = function (collection, callback, scope) {
		if (Object.prototype.toString.call(collection) === '[object Object]') {
			for (var prop in collection) {
				if (Object.prototype.hasOwnProperty.call(collection, prop)) {
					callback.call(scope, collection[prop], prop, collection);
				}
			}
		} else {
			for (var i = 0, len = collection.length; i < len; i++) {
				callback.call(scope, collection[i], i, collection);
			}
		}
	};

	/**
	 * Merge defaults with user options
	 * @private
	 * @param {Object} defaults Default settings
	 * @param {Object} options User options
	 * @returns {Object} Merged values of defaults and options
	 */
	var extend = function ( defaults, options ) {
		var extended = {};
		forEach(defaults, function (value, prop) {
			extended[prop] = defaults[prop];
		});
		forEach(options, function (value, prop) {
			extended[prop] = options[prop];
		});
		return extended;
	};

	/**
	 * Get the closest element up the DOM with the matching selector
	 * @param  {Element} elem The starting element
	 * @param  {String} selector The CSS selector to check for
	 * @return {Boolean|Element} Returns false is no matching element is found
	 */
	var getClosest = function (elem, selector) {

		var firstChar = selector.charAt(0);

		// Get closest match
		for ( ; elem && elem !== document; elem = elem.parentNode ) {
			if ( firstChar === '.' ) {
				if ( elem.classList.contains( selector.substr(1) ) ) {
					return elem;
				}
			} else if ( firstChar === '#' ) {
				if ( elem.id === selector.substr(1) ) {
					return elem;
				}
			} else if ( firstChar === '[' ) {
				if ( elem.hasAttribute( selector.substr(1, selector.length - 2) ) ) {
					return elem;
				}
			}
		}

		return false;

	};

	/**
	 * Stop YouTube, Vimeo, and HTML5 videos from playing when leaving the slide
	 * @private
	 * @param  {Element} content The content container the video is in
	 * @param  {String} activeClass The class asigned to expanded content areas
	 */
	var stopVideos = function ( content, activeClass ) {
		if ( !content.classList.contains( activeClass ) ) {
			var iframe = content.querySelector( 'iframe');
			var video = content.querySelector( 'video' );
			if ( iframe ) {
				var iframeSrc = iframe.src;
				iframe.src = iframeSrc;
			}
			if ( video ) {
				video.pause();
			}
		}
	};

	/**
	 * Open the target modal window
	 * @public
	 * @param  {Element} toggle The element that toggled the open modal event
	 * @param  {String} modalID ID of the modal to open
	 * @param  {Object} options
	 * @param  {Event} event
	 */
	publicApi.openModal = function (toggle, modalID, options, event) {

		// Define the modal
		var settings = extend( settings || defaults, options || {} );  // Merge user options with defaults
		var modal = document.querySelector(modalID);

		// Define the modal background
		var modalBg = document.createElement('div');
		modalBg.setAttribute('data-modal-bg', null);
		modalBg.classList.add( settings.modalBGClass );

		settings.callbackBeforeOpen( toggle, modalID ); // Run callbacks before opening a modal

		// Activate the modal
		modal.classList.add( settings.modalActiveClass );
		modal.style.top = window.pageYOffset + parseInt(settings.offset, 10) + 'px';
		document.body.appendChild(modalBg);

		settings.callbackAfterOpen( toggle, modalID ); // Run callbacks after opening a modal

	};

	/**
	 * Close all modal windows
	 * @public
	 * @param  {Object} options
	 * @param  {Event} event
	 */
	publicApi.closeModals = function (toggle, options, event) {

		// Selectors and variables
		var settings = extend( defaults, options || {} ); // Merge user options with defaults
		var openModals = document.querySelectorAll('[data-modal-window].' + settings.modalActiveClass);
		var modalsBg = document.querySelectorAll('[data-modal-bg]'); // Get modal background element

		if ( openModals.length > 0 || modalsBg.length > 0 ) {

			settings.callbackBeforeClose(); // Run callbacks before closing a modal

			// Close all modals
			forEach(openModals, function (modal) {
				if ( modal.classList.contains( settings.modalActiveClass ) ) {
					stopVideos(modal); // If active, stop video from playing
					modal.classList.remove( settings.modalActiveClass );
				}
			});

			// Remove all modal backgrounds
			forEach(modalsBg, function (bg) {
				document.body.removeChild(bg);
			});

			settings.callbackAfterClose(); // Run callbacks after closing a modal

		}

	};

	/**
	 * Handle toggle click events
	 * @private
	 */
	var eventHandler = function (event) {
		var toggle = event.target;
		var open = getClosest(toggle, '[data-modal]');
		var close = getClosest(toggle, '[data-modal-close]');
		var modal = getClosest(toggle, '[data-modal-window]');
		var key = event.keyCode;

		if ( key && key === 27) {
			publicApi.closeModals(null, settings, event);
		} else if ( toggle ) {
			if ( modal && !close ) {
				return;
			} else if ( open ) {
				event.preventDefault();
				publicApi.openModal( open, open.getAttribute('data-modal'), settings );
			} else {
				event.preventDefault();
				publicApi.closeModals(toggle, settings, event);
			}
		}
	};

	/**
	 * Destroy the current initialization.
	 * @public
	 */
	publicApi.destroy = function () {
		if ( !settings ) return;
		document.removeEventListener('click', eventHandler, false);
		document.removeEventListener('touchstart', eventHandler, false);
		document.removeEventListener('keydown', eventHandler, false);
		settings = null;
	};

	/**
	 * Initialize Modals
	 * @public
	 * @param {Object} options User settings
	 */
	publicApi.init = function ( options ) {

		// feature test
		if ( !supports ) return;

		// Destroy any existing initializations
		publicApi.destroy();

		// Merge user options with defaults
		settings = extend( defaults, options || {} );

		// Listen for events
		document.addEventListener('click', eventHandler, false);
		document.addEventListener('touchstart', eventHandler, false);
		document.addEventListener('keydown', eventHandler, false);

	};


	//
	// Public APIs
	//

	return publicApi;

});