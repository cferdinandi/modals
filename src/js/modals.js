(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.modals = factory(root);
	}
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {

	'use strict';

	//
	// Variables
	//

	var publicApi = {}; // Object for public APIs
	var supports = !!document.querySelector && !!root.addEventListener; // Feature test
	var state = 'closed';
	var settings;

	// Default settings
	var defaults = {
		modalActiveClass: 'active',
		modalBGClass: 'modal-bg',
		backspaceClose: true,
		callbackOpen: function () {},
		callbackClose: function () {}
	};


	//
	// Methods
	//

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
	publicApi.openModal = function (toggle, modalID, options) {

		// Define the modal
		var settings = buoy.extend( settings || defaults, options || {} );  // Merge user options with defaults
		var modal = document.querySelector(modalID);

		// Define the modal background
		var modalBg = document.createElement('div');
		modalBg.setAttribute('data-modal-bg', null);
		modalBg.classList.add( settings.modalBGClass );

		// Activate the modal
		modal.classList.add( settings.modalActiveClass );
		document.body.appendChild(modalBg);
		state = 'open';

		settings.callbackOpen( toggle, modalID ); // Run callbacks after opening a modal

	};

	/**
	 * Close all modal windows
	 * @public
	 * @param  {Object} options
	 * @param  {Event} event
	 */
	publicApi.closeModals = function (toggle, options) {

		// Selectors and variables
		var settings = buoy.extend( defaults, options || {} ); // Merge user options with defaults
		var openModals = document.querySelectorAll('[data-modal-window].' + settings.modalActiveClass);
		var modalsBg = document.querySelectorAll('[data-modal-bg]'); // Get modal background element

		if ( openModals.length > 0 || modalsBg.length > 0 ) {

			// Close all modals
			buoy.forEach(openModals, function (modal) {
				if ( modal.classList.contains( settings.modalActiveClass ) ) {
					stopVideos(modal); // If active, stop video from playing
					modal.classList.remove( settings.modalActiveClass );
				}
			});

			// Remove all modal backgrounds
			buoy.forEach(modalsBg, function (bg) {
				document.body.removeChild(bg);
			});

			// Set state to closed
			state = 'closed';

			settings.callbackClose(); // Run callbacks after closing a modal

		}

	};

	/**
	 * Handle toggle click events
	 * @private
	 */
	var eventHandler = function (event) {
		var toggle = event.target;
		var open = buoy.getClosest(toggle, '[data-modal]');
		var close = buoy.getClosest(toggle, '[data-modal-close]');
		var modal = buoy.getClosest(toggle, '[data-modal-window]');
		var key = event.keyCode;

		if ( key && state === 'open' ) {
			if ( key === 27 || ( settings.backspaceClose && ( key === 8 || key === 46 ) ) ) {
				publicApi.closeModals(null, settings);
			}
		} else if ( toggle ) {
			if ( modal && !close ) {
				return;
			} else if ( open ) {
				event.preventDefault();
				publicApi.openModal( open, open.getAttribute('data-modal'), settings );
			} else if ( state === 'open' ) {
				event.preventDefault();
				publicApi.closeModals(toggle, settings);
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
		settings = buoy.extend( defaults, options || {} );

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