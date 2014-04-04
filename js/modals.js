/* =============================================================

	Modals v5.0
	Simple modal dialogue pop-up windows by Chris Ferdinandi.
	http://gomakethings.com

	Free to use under the MIT License.
	http://gomakethings.com/mit/

 * ============================================================= */

window.modals = (function (window, document, undefined) {

	'use strict';

	// Default settings
	// Private {object} variable
	var _defaults = {
		modalActiveClass: 'active',
		modalBGClass: 'modal-bg',
		offset: 50,
		callbackBeforeOpen: function () {},
		callbackAfterOpen: function () {},
		callbackBeforeClose: function () {},
		callbackAfterClose: function () {}
	};

	// Merge default settings with user options
	// Private method
	// Returns an {object}
	var _mergeObjects = function ( original, updates ) {
		for (var key in updates) {
			original[key] = updates[key];
		}
		return original;
	};

	// Stop YouTube, Vimeo, and HTML5 videos from playing when hiding a modal
	// Private method
	// Runs functions
	var _stopVideo = function (modal) {
		var iframe = modal.querySelector( 'iframe');
		var video = modal.querySelector( 'video' );
		if ( iframe !== null ) {
			var iframeSrc = iframe.src;
			iframe.src = iframeSrc;
		}
		if ( video !== null ) {
			video.pause();
		}
	};

	// Open the target modal window
	// Public method
	// Runs functions
	var openModal = function (toggle, modalID, options, event) {

		// Define the modal
		options = _mergeObjects( _defaults, options || {} ); // Merge user options with defaults
		var modal = document.querySelector(modalID);

		// Define the modal background
		var modalBg = document.createElement('div');
		modalBg.setAttribute('data-modal-bg', null);
		modalBg.classList.add( options.modalBGClass );

		// Prevent `closeModals()` and the default link behavior
		if ( event ) {
			event.stopPropagation();
			if ( toggle && toggle.tagName === 'A' ) {
				event.preventDefault();
			}
		}

		options.callbackBeforeOpen( toggle, modalID ); // Run callbacks before opening a modal

		// Activate the modal
		modal.classList.add( options.modalActiveClass );
		modal.style.top = window.pageYOffset + parseInt(options.offset, 10) + 'px';
		document.body.appendChild(modalBg);

		options.callbackAfterOpen( toggle, modalID ); // Run callbacks after opening a modal

	};

	// Close all modal windows
	// Public method
	// Runs functions
	var closeModals = function (options, event) {

		// Selectors and variables
		options = _mergeObjects( _defaults, options || {} ); // Merge user options with defaults
		var openModals = document.querySelectorAll('[data-modal-window].' + options.modalActiveClass);
		var modalsBg = document.querySelectorAll('[data-modal-bg]'); // Get modal background element

		if ( openModals.length > 0 || modalsBg.length > 0 ) {

			options.callbackBeforeClose(); // Run callbacks before closing a modal

			// Close all modals
			Array.prototype.forEach.call(openModals, function (modal, index) {
				if ( modal.classList.contains( options.modalActiveClass ) ) {
					_stopVideo(modal); // If active, stop video from playing
					modal.classList.remove( options.modalActiveClass );
				}
			});

			// Remove all modal backgrounds
			Array.prototype.forEach.call(modalsBg, function (bg, index) {
				document.body.removeChild(bg);
			});

			options.callbackAfterClose(); // Run callbacks after closing a modal

		}

	};

	// Close modals when the esc key is pressed
	// Private method
	// Runs functions
	var _handleEscKey = function (options, event) {
		if (event.keyCode == 27) {
			closeModals(options, event);
		}
	};

	// Don't close modals when clicking inside one
	// Private method
	// Runs functions
	var _handleModalClick = function (event) {
		event.stopPropagation();
	};

	// Initialize Modals
	// Public method
	// Runs functions
	var init = function ( options ) {

		// Feature test before initializing
		if ( 'querySelector' in document && 'addEventListener' in window && Array.prototype.forEach ) {

			// Selectors and variables
			options = _mergeObjects( _defaults, options || {} ); // Merge user options with defaults
			var modalToggles = document.querySelectorAll('[data-modal]');
			var modalWindows = document.querySelectorAll('[data-modal-window]');
			var modalCloseButtons = document.querySelectorAll('[data-modal-close]');

			// When modal toggle is clicked, open modal
			Array.prototype.forEach.call(modalToggles, function (toggle, index) {
				toggle.addEventListener('click', openModal.bind(null, toggle, toggle.getAttribute('data-modal'), options), false);
			});

			// When modal close is clicked, close modal
			Array.prototype.forEach.call(modalCloseButtons, function (btn, index) {
				btn.addEventListener('click', closeModals.bind(null, options), false);
			});

			// When page outside of modal is clicked, close modal
			document.addEventListener('click', closeModals.bind(null, options), false); // When body is clicked
			document.addEventListener('touchstart', closeModals.bind(null, options), false); // When body is tapped
			document.addEventListener('keydown', _handleEscKey.bind(null, options), false); // When esc key is pressed

			// When modal itself is clicked, don't close it
			Array.prototype.forEach.call(modalWindows, function (modal, index) {
				modal.addEventListener('click', _handleModalClick, false);
				modal.addEventListener('touchstart', _handleModalClick, false);
			});

		}

	};

	// Return public methods
	return {
		init: init,
		openModal: openModal,
		closeModals: closeModals
	};

})(window, document);