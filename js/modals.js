/* =============================================================

	Modals v4.0
	Simple modal dialogue pop-up windows by Chris Ferdinandi.
	http://gomakethings.com

	Free to use under the MIT License.
	http://gomakethings.com/mit/

 * ============================================================= */

window.modals = (function (window, document, undefined) {

	'use strict';

	// Show the target modal window
	// Private method
	var _showModal = function (event) {

		// Define the modal
		var dataID = this.getAttribute('data-target');
		var dataTarget = document.querySelector(dataID);

		// Define the modal background
		var modalBg = document.createElement('div');
		modalBg.setAttribute('data-modal-bg', null);
		buoy.addClass(modalBg, 'modal-bg');

		// Prevent `hideModals()` and the default link behavior
		event.stopPropagation();
		event.preventDefault();

		// Activate the modal
		buoy.addClass(dataTarget, 'active');
		dataTarget.style.top = window.pageYOffset + 50 + 'px';
		document.body.appendChild(modalBg);

	};

	// Stop YouTube, Vimeo, and HTML5 videos from playing when hiding a modal
	// Private method
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

	// Hide all modal windows
	// Private method
	var _hideModals = function (modalWindows, event) {

		// Get modal background element
		var modalsBg = document.querySelectorAll('[data-modal-bg]');

		// Prevent hide modal link from opening a URL
		if ( this !== undefined && this.tagName == 'A' ) {
			event.preventDefault();
		}

		// Hide all modals
		Array.prototype.forEach.call(modalWindows, function (modal, index) {
			buoy.removeClass(modal, 'active');
		});

		// Hide all modal backgrounds
		Array.prototype.forEach.call(modalsBg, function (bg, index) {
			document.body.removeChild(bg);
		});

		// Stop any modal videos from playing
		Array.prototype.forEach.call(modalWindows, function (modal, index) {
			_stopVideo(modal);
		});

	};

	// Hide modals when the esc key is pressed
	var _handleEscKey = function (modalWindows) {
		if (event.keyCode == 27) {
			_hideModals(modalWindows, event);
		}
	};

	// Don't hide modals when clicking inside one
	// Private method
	var _handleModalClick = function (event) {
		event.stopPropagation();
	};

	// Initialize Modals
	// Public method
	var init = function () {

		// Feature test before initializing
		if ( 'querySelector' in document && 'addEventListener' in window && Array.prototype.forEach ) {

			// Selectors and variables
			var modalToggles = document.querySelectorAll('[data-modal]');
			var modalWindows = document.querySelectorAll('[data-modal-window]');
			var modalCloseButtons = document.querySelectorAll('[data-modal-close]');

			// When modal toggle is clicked, show modal
			Array.prototype.forEach.call(modalToggles, function (toggle, index) {
				toggle.addEventListener('click', _showModal, false);
			});

			// When modal close is clicked, hide modals
			Array.prototype.forEach.call(modalCloseButtons, function (btn, index) {
				btn.addEventListener('click', _hideModals.bind(btn, modalWindows), false);
			});

			//  Hide all modals
			document.addEventListener('click', _hideModals.bind(this, modalWindows), false); // When body is clicked
			document.addEventListener('touchstart', _hideModals.bind(this, modalWindows), false); // When body is tapped
			document.addEventListener('keydown', _handleEscKey.bind(this, modalWindows), false); // When esc key is pressed

			// When modal itself is clicked, don't close it
			Array.prototype.forEach.call(modalWindows, function (win, index) {
				win.addEventListener('click', _handleModalClick, false);
				win.addEventListener('touchstart', _handleModalClick, false);
			});

		}

	};

	// Return public methods
	return {
		init: init
	};

})(window, document);