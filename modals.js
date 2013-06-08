/* =============================================================

    Modals v1.1
    Simple jQuery modal dialogue pop-up windows by Chris Ferdinandi.
    http://gomakethings.com

    Free to use under the MIT License.
    http://gomakethings.com/mit/
    
 * ============================================================= */

(function($) {
    $(function () {
        // Modal toggle button
        $('.modal-toggle').click(function(e) {
            e.preventDefault(); // Prevent default link behavior.
            var modalID = $(this).attr('data-target'); // Get the target modal ID.
            
            $('body').append('<div class="modal-bg"></div>'); // Add modal background.
            $(modalID).addClass('active').css('top', $(window).scrollTop() + 50 + "px"); // Add or remove the .active class from the modal.
        });

        // Modal close button
        $('.modal-close').click(function(e) {
            e.preventDefault(); // Prevent default link behavior.
            $('.modal').removeClass('active'); // Hide modal.
            $('.modal-bg').remove(); // Remove modal background.
        });

        // When click outside of modal
        $('body').on('click touchstart','.modal-bg',function() {
            $('.modal').removeClass('active'); // Hide modal.
            $('.modal-bg').remove(); // Remove modal background.
        });

        // When escape key pressed
        $(document).on('keydown',function(e) {
            if ( e.keyCode === 27 ) { // If escape key pressed
                $('.modal').removeClass('active'); // Hide modal.
                $('.modal-bg').remove(); // Remove modal background.
            }
        });
    });
})(jQuery);
