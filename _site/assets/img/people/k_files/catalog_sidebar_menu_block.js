(function ($, window, document) {
  // function configure_catalog_sidebar_menu_block_level(level) {
  //   $('.catalog-sidebar-menu-block__level-' + level + '__opener').on('click', function() {
  //     var item = $(this).parent();
  //     var submenu = $(this).parent().next('.catalog-sidebar-menu-block__level-' + (level+1));

  //     // Each time the user clicks an opener, toggle the 'active' class on the related item and submenu.
  //     item.toggleClass('active');
  //     submenu.toggleClass('active');

  //     // TODO: THIS DOESN'T WORK. The 'hidden.bs.dropdown' event doesn't seem to be firing.
  //     // On mobile, the sidebar menu can be opened and closed as a whole by a bootstrap dropdown behavior. This code
  //     // ensures that when the mobile sidebar menu is re-opened after being closed, the current page is once again the
  //     // only thing shown, regardless of which submenus were previously shown/hidden.
  //     $(this).parents('.dropdown.show').on('hidden.bs.dropdown', function() {
  //       // Remove the active class from all descendants of this particular Sidebar Menu Block, then add it back to the
  //       // current page's elements.
  //       $('.active', this).removeClass('active');
  //       $('.js-sidebar-menu-current', this).addClass('active');
  //     });

  //     // Prevent the click event from taking its default action, which on mobile would cause the sidebar menu to close.
  //     return false;
  //   });

  //   // Make clicks on this Level's menu-only elements trigger their associated opener.
  //   // $('.js-sidebar-menu-only').on('click', function() {
  //   //   $(this).siblings('.catalog-sidebar-menu-block__level-' + level + '__opener').trigger('click');
  //   //   // Must return false to prevent the click from closing the sidebar menu dropdown on mobile.
  //   //   return false;
  //   // });
  // }

  // $(document).ready(function() {
  //   configure_catalog_sidebar_menu_block_level(2)
  //   configure_catalog_sidebar_menu_block_level(3)
  // });
}(jQuery, this, this.document));
