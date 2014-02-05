/* =============================================================

	Modals v3.2
	Simple modal dialogue pop-up windows by Chris Ferdinandi.
	http://gomakethings.com

	Free to use under the MIT License.
	http://gomakethings.com/mit/

 * ============================================================= */

window.modals = (function (window, document, undefined) {

	'use strict';

	// Feature test
	if ( 'querySelector' in document && 'addEventListener' in window && Array.prototype.forEach ) {

		// SELECTORS

		var modalToggles = document.querySelectorAll('[data-modal]');
		var modalWindows = document.querySelectorAll('[data-modal-window]');
		var modalCloseButtons = document.querySelectorAll('[data-modal-close]');


		// METHODS

		// Show the target modal window
		var showModal = function (event) {

			// SELECTORS

			// Define the modal
			var dataID = this.getAttribute('data-target');
			var dataTarget = document.querySelector(dataID);

			// Define the modal background
			var modalBg = document.createElement('div');
			modalBg.setAttribute('data-modal-bg', null);
			buoy.addClass(modalBg, 'modal-bg');


			// EVENTS, LISTENERS, AND INITS

			event.stopPropagation(); // Prevent the "close all modals" function
			event.preventDefault(); // Prevent the default link behavior

			// Activate the modal
			buoy.addClass(dataTarget, 'active');
			dataTarget.style.top = window.pageYOffset + 50 + 'px';
			document.body.appendChild(modalBg);

		};

		// Hide all modal windows
		var hideModals = function (event) {

			// SELECTORS

			var modalsBg = document.querySelectorAll('[data-modal-bg]');


			// EVENTS, LISTENERS, AND INITS

			event.preventDefault();

			// Hide all modals
			Array.prototype.forEach.call(modalWindows, function (modal, index) {
				buoy.removeClass(modal, 'active');
			});

			// Hide all modal backgrounds
			Array.prototype.forEach.call(modalsBg, function (bg, index) {
				document.body.removeChild(bg);
			});

		};

		// Hide modals on esc key
		var handleEscKey = function (event) {
			if (event.keyCode == 27) {
				hideModals(event);
			}
		};

		// Don't handle modals when clicked inside
		var handleModalClick = function (event) {
			event.stopPropagation();
		};


		// EVENTS, LISTENERS, AND INITS

		// When modal toggle is clicked, show modal
		Array.prototype.forEach.call(modalToggles, function (toggle, index) {
			toggle.addEventListener('click', showModal, false);
		});

		// When modal close is clicked, hide modals
		Array.prototype.forEach.call(modalCloseButtons, function (btn, index) {
			btn.addEventListener('click', hideModals, false);
		});

		//  Hide all modals
		document.addEventListener('click', hideModals, false); // When body is clicked
		document.addEventListener('touchstart', hideModals, false); // When body is tapped
		document.addEventListener('keydown', handleEscKey, false); // When esc key is pressed

		// When modal itself is clicked, don't close it
		Array.prototype.forEach.call(modalWindows, function (win, index) {
			win.addEventListener('click', handleModalClick, false);
			win.addEventListener('touchstart', handleModalClick, false);
		});

	}

})(window, document);