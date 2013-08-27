/* =============================================================

    Modals v2.2
    Simple modal dialogue pop-up windows by Chris Ferdinandi.
    http://gomakethings.com

    Free to use under the MIT License.
    http://gomakethings.com/mit/
    
 * ============================================================= */

(function() {

    // Feature test
    if ( 'querySelector' in document && 'addEventListener' in window && Array.prototype.forEach ) {

        // Function to show modal
        var showModal = function (toggle) {

            // Define the modal
            var dataID = toggle.getAttribute('data-target');
            var dataTarget = document.querySelector(dataID);

            // Define the modal background
            var modalBg = document.createElement('div');
            buoy.addClass(modalBg, 'modal-bg');

            // Activate the modal
            buoy.addClass(dataTarget, 'active');
            dataTarget.style.top = window.pageYOffset + 50 + 'px';
            document.body.appendChild(modalBg);

        };

        // Function to hide all modals
        var hideModals = function (modals, modalsBg) {

            // Hide all modals
            [].forEach.call(modals, function (modal) {
                buoy.removeClass(modal, 'active');
            });

            // Hide all modal backgrounds
            [].forEach.call(modalsBg, function (bg) {
                document.body.removeChild(bg);
            });

        };


        // Define modals, modal toggle, and modal close
        var modals = document.querySelectorAll('.modal');
        var modalToggle = document.querySelectorAll('.modal-toggle');
        var modalClose = document.querySelectorAll('.modal-close');


        // When body is clicked
        document.addEventListener('click', function() {
        
            // Hide all modals
            hideModals(modals, document.querySelectorAll('.modal-bg'));
            
        }, false);


        // When body is tapped
        document.addEventListener('touchstart', function() {
        
            // Hide all modals
            hideModals(modals, document.querySelectorAll('.modal-bg'));
            
        }, false);


        // For each modal toggle
        [].forEach.call(modalToggle, function (toggle) {

            // When the modal toggle is clicked
            toggle.addEventListener('click', function(e) {

                // Prevent the "close all modals" function
                e.stopPropagation();

                // Prevent the default link behavior
                e.preventDefault();

                // Show the modal
                showModal(toggle);
             
            }, false);

        });


        // For each modal close
        [].forEach.call(modalClose, function (close) {

            // When the modal toggle is clicked
            close.addEventListener('click', function(e) {

                // Prevent the default link behavior
                e.preventDefault();

                // Hide all modals
                hideModals(modals, document.querySelectorAll('.modal-bg'));

            }, false);

        });


        // For each modal window
        [].forEach.call(modals, function (modal) {

            // When the menu is clicked
            modal.addEventListener('click', function(e) {

                // Prevent the "close all dropdowns" function
                e.stopPropagation();

            }, false);

            // When the menu is tapped
            modal.addEventListener('touchstart', function(e) {

                // Prevent the "close all dropdowns" function
                e.stopPropagation();

            }, false);
            
        });


        // When key on keyboard is pressed
        window.addEventListener('keydown', function (e) {

            // If it's the esc key
            if (e.keyCode == 27) {
            
                // Hide all modals
                hideModals(modals, document.querySelectorAll('.modal-bg'));
                
            }

        }, false);

    }

})();
