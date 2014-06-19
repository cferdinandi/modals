/**
 *
 * Modals v5.1.0
 * Simple modal dialogue pop-up windows, by Chris Ferdinandi.
 * http://gomakethings.com
 *
 * Free to use under the MIT License.
 * http://gomakethings.com/mit/
 *
 */

(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define(factory);
	} else if ( typeof exports === 'object' ) {
		module.exports = factory;
	} else {
		root.modals = factory(root); // @todo Update to plugin name
	}
})(this, function (root) {

	'use strict';

	//
	// Variables
	//

	var exports = {}; // Object for public APIs
	var supports = !!document.querySelector &&
	               (!!root.addEventListener ||
	               (typeof window !== 'undefined' && !!window.addEventListener)); // Feature test

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
	 * Merge defaults with user options
	 * @private
	 * @param {Object} defaults Default settings
	 * @param {Object} options User options
	 * @returns {Object} Merged values of defaults and options
	 */
	var extend = function ( defaults, options ) {
		for ( var key in options ) {
			if (Object.prototype.hasOwnProperty.call(options, key)) {
				defaults[key] = options[key];
			}
		}
		return defaults;
	};

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
	exports.openModal = function (toggle, modalID, options, event) {

		// Define the modal
		var settings = extend( defaults, options || {} ); // Merge user options with defaults
		var modal = document.querySelector(modalID);

		// Define the modal background
		var modalBg = document.createElement('div');
		modalBg.setAttribute('data-modal-bg', null);
		modalBg.classList.add( settings.modalBGClass );

		// Prevent `closeModals()` and the default link behavior
		if ( event ) {
			event.stopPropagation();
			if ( toggle && toggle.tagName.toLowerCase() === 'a' ) {
				event.preventDefault();
			}
		}

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
	var closeModals = function (options, event) {

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
	 * Close modals when the esc key is pressed
	 * @private
	 * @param  {Object} options [description]
	 * @param  {Event} event   [description]
	 */
	var handleEscKey = function (settings, event) {
		if (event.keyCode === 27) {
			closeModals(settings, event);
		}
	};

	/**
	 * Don't close modals when clicking inside one
	 * @private
	 * @param  {Event} event
	 */
	var handleModalClick = function ( event ) {
		event.stopPropagation();
	};

	/**
	 * Initialize Modals
	 * @public
	 * @param {Object} options User settings
	 */
	exports.init = function ( options ) {

		// feature test
		if ( !supports ) return;

		// Selectors and variables
		var settings = extend( defaults, options || {} ); // Merge user options with defaults
		var modalToggles = document.querySelectorAll('[data-modal]');
		var modalWindows = document.querySelectorAll('[data-modal-window]');
		var modalCloseButtons = document.querySelectorAll('[data-modal-close]');

		// When modal toggle is clicked, open modal
		forEach(modalToggles, function (toggle) {
			toggle.addEventListener('click', exports.openModal.bind(null, toggle, toggle.getAttribute('data-modal'), settings), false);
		});

		// When modal close is clicked, close modal
		forEach(modalCloseButtons, function (btn) {
			btn.addEventListener('click', closeModals.bind(null, settings), false);
		});

		// When page outside of modal is clicked, close modal
		document.addEventListener('click', closeModals.bind(null, settings), false); // When body is clicked
		document.addEventListener('touchstart', closeModals.bind(null, settings), false); // When body is tapped
		document.addEventListener('keydown', handleEscKey.bind(null, settings), false); // When esc key is pressed

		// When modal itself is clicked, don't close it
		forEach(modalWindows, function (modal) {
			modal.addEventListener('click', handleModalClick, false);
			modal.addEventListener('touchstart', handleModalClick, false);
		});

	};


	//
	// Public APIs
	//

	return exports;

});