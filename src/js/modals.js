(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define('modals', factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.modals = factory(root);
	}
})(this, function (root) {

	'use strict';

	//
	// Variables
	//

	var exports = {}; // Object for public APIs
	var supports = !!document.querySelector && !!root.addEventListener; // Feature test
	var eventListeners = {  //Listener arrays
		toggles: [],
		modals: [],
		buttons: []
	};
	var settings, toggles, modals, buttons;

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
		var settings = extend( settings || defaults, options || {} );  // Merge user options with defaults
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
	exports.closeModals = function (options, event) {

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
			exports.closeModals(settings, event);
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
	 * Destroy the current initialization.
	 * @public
	 */
	exports.destroy = function () {
		if ( !settings ) return;
		if ( toggles ) {
			forEach( toggles, function ( toggle, index ) {
				toggle.removeEventListener( 'click', eventListeners.toggles[index], false );
			});
			forEach( modals, function ( modal, index ) {
				modal.removeEventListener( 'click', eventListeners.modals[index], false );
				modal.removeEventListener( 'touchstart', eventListeners.modals[index], false );
			});
			forEach( buttons, function ( btn, index ) {
				btn.removeEventListener( 'click', eventListeners.buttons[index], false );
			});
			document.removeEventListener('click', exports.closeModals, false);
			document.removeEventListener('touchstart', exports.closeModals, false);
			document.removeEventListener('keydown', handleEscKey, false);
			eventListeners.toggles = [];
			eventListeners.modals = [];
			eventListeners.buttons = [];
		}
		settings = null;
		toggles = null;
		modals = null;
		buttons = null;
	};

	/**
	 * Initialize Modals
	 * @public
	 * @param {Object} options User settings
	 */
	exports.init = function ( options ) {

		// feature test
		if ( !supports ) return;

		// Destroy any existing initializations
		exports.destroy();

		// Selectors and variables
		settings = extend( defaults, options || {} ); // Merge user options with defaults
		toggles = document.querySelectorAll('[data-modal]');
		modals = document.querySelectorAll('[data-modal-window]');
		buttons = document.querySelectorAll('[data-modal-close]');

		// When modal toggle is clicked, open modal
		forEach(toggles, function (toggle, index) {
			eventListeners.toggles[index] = exports.openModal.bind(null, toggle, toggle.getAttribute('data-modal'), settings);
			toggle.addEventListener('click', eventListeners.toggles[index], false);
		});

		// When modal close is clicked, close modal
		forEach(buttons, function (btn, index) {
			eventListeners.buttons[index] = exports.closeModals.bind(null, settings);
			btn.addEventListener('click', eventListeners.buttons[index], false);
		});

		// When page outside of modal is clicked, close modal
		document.addEventListener('click', exports.closeModals.bind(null, settings), false); // When body is clicked
		document.addEventListener('touchstart', exports.closeModals.bind(null, settings), false); // When body is tapped
		document.addEventListener('keydown', handleEscKey.bind(null, settings), false); // When esc key is pressed

		// When modal itself is clicked, don't close it
		forEach(modals, function (modal, index) {
			eventListeners.modals[index] = handleModalClick;
			modal.addEventListener('click', eventListeners.modals[index], false);
			modal.addEventListener('touchstart', eventListeners.modals[index], false);
		});

	};


	//
	// Public APIs
	//

	return exports;

});