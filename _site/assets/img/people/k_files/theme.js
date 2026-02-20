/* global _ */
/**
 * This file defines the javascript functionality provided by the v7.0 theme. This includes all the chrome that is
 * shared by both caltech_sites and www, such as the header, main menu, mobile menu, and footer.
 */

(function ($, window, document) {

  // See wagtail-menu for menu related javascript.

  function configure_modals() {
    // Configure all our models to reset when they close. This will cause videos within them to stop playing, and
    // cause carousels to go back to the start.
    $('.modal').on('hidden.bs.modal', function() {
      var stored = $(this).html();
      $(this).html(stored);
    });
  }

  $(document).ready(function() {
    configure_modals();
  });
}(jQuery, this, this.document));
