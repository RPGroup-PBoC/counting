/* global _ */
/**
 * This file defines the javascript functionality provided by the v7.0 theme. This includes all the chrome that is
 * shared by both caltech_sites and www, such as the header, main menu, mobile menu, and footer.
 *
 * Theme 7 is compatible with at least Bootstrap 4.1.0 and 4.3.1
 */

(function ($, window, document) {
  var close_timer = null;
  var open_timer = null;

  function configure_main_menu() {
    function open_menu(level_1_menu_item) {
      level_1_menu_item.find('.header__main-menu__level-1__item__wrapper').children('.header__main-menu__level-2').addClass('show');
    }

    function close_menu() {
      $('.header__main-menu__level-2').removeClass('show');
    }

    // Open the menu under a level-1 menu item shortly after the user starts hovering it. Note that the level-1
    // items wrap the level-2 submenus, meaning that hovering over the level-2 menu IS hovering over the level-1 item.
    $('.header__main-menu__level-1__item').on('mouseenter', function() {
      // Cancel any existing open_timer before starting a new one.
      clearTimeout(open_timer);
      open_timer = _.delay(open_menu, 250, $(this));
    });

    // Close a level-1 menu item's menu shortly after the user stops hovering it.
    $('.header__main-menu__level-1__item').on('mouseleave', function() {
      // Cancel both timers, then start the close_timer again.
      clearTimeout(close_timer);
      clearTimeout(open_timer);
      close_timer = _.delay(close_menu, 250);
    });

    // Set up the +/- elements on the submenus.
    $('.dropdown-submenu .dropdown-toggle-split').on('click', function() {
      var opener = $(this);
      var submenu = $(this).siblings('.dropdown-menu');

      // Each time the user clicks an opener, toggle the +/- icon and the visibility of the submenu.
      opener.find('.header__main-menu__plus-minus-icon').toggleClass('d-none');
      submenu.toggleClass('show');

      // When the parent menu is finished hiding itself after being dismissed, also hide the submenus inside it
      // and set the openers back to +.
      // TODO 2024-08-19 rrollins: I don't think this works. The event is never triggered.
      $(this).parents('.dropdown.show').on('hidden.bs.dropdown', function() {
        $('.dropdown-submenu .dropdown-menu').removeClass('show');
        opener.find('.header__main-menu__plus-minus-icon.minus').addClass('d-none');
        opener.find('.header__main-menu__plus-minus-icon.plus').removeClass('d-none');

        // Reset any sr-only labels that were set to close back to open
        sr_label = opener.find('.sr-only');
        if (sr_label.text().startsWith('Close')) {
          sr_label.text(sr_label.text().replace('Close', 'Open'));
        }
      });

      // VoiceOver seems to read button content but not the aria change when
      // going from open to close for a submenu.
      // By toggling the sr-only label with the class, it gives some context
      // to what's happening
      sr_label = opener.find('.sr-only');
      if (submenu.hasClass('show')) {
        sr_label.text(sr_label.text().replace('Open', 'Close'));
      } else {
        sr_label.text(sr_label.text().replace('Close', 'Open'));
      }

      // Set the aria to expanded
      opener.attr('aria-expanded', function(_, attr) { return !(attr == 'true') });

      // Move the focus to the submenu with tabindex="-1"
      if (submenu.hasClass('show')) {
        submenu.focus();
      }

      // Prevent the click from triggering its default action, which would cause the parent dropdown to close.
      return false;
    });
  }

  function configure_search() {

    function toggle_show_class(button_node) {
      var magnifying_glass_pos = $(button_node).offset().left;
      // 280px is the width of the search form. This ensures that it won't ever open in a way that lets part of it
      // get cut off by the left edge of the viewport.
      if (magnifying_glass_pos > 280) {
        $('.header__search__form').toggleClass('show').removeClass('show-right');
      }
      else {
        $('.header__search__form').toggleClass('show-right').removeClass('show');
      }

      // When the search form is displayed, focus the query field.
      if ($('.header__search__form').filter('.show, .show-right').length) {
        $('.header__search__form__query').focus();
      }
      else {
        $('.header__search__button').focus();
      }
    }

    // Toggle search form with button
    $('.header__search__button').on('click', function() {
      toggle_show_class(this);
    });

    // Close form if Esc is pressed
    $('.header__search__form').on('keydown', function(event) {
      if (event.key === 'Escape') {
        form_button = this.parentNode.getElementsByClassName(
          'header__search__button'
        )
        if (form_button.length) {
          toggle_show_class(form_button[0]);
        }
      }
    });

    // Check whenever header is focused out whether search form should hide
    $('.header').on('focusout', function(event) {
      target = event.relatedTarget;
      relatedTarget = event.relatedTarget;

      // Check target classes for search form child classes
      // Browser may return null for target and relatedTarget, do not close form
      // until targets are available
      if (!(
        (target == null && relatedTarget == null) ||
        $(relatedTarget).hasClass('header__search__button') ||
        $(relatedTarget).hasClass('header__search__form__label') ||
        $(relatedTarget).hasClass('header__search__form__query') ||
        $(relatedTarget).hasClass('header__search__form__submit')
      )) {
        $(this).find(
          '.header__search__form'
        ).removeClass('show').removeClass('show-right');
      }
    });
  }

  function configure_sidebar_menu_block() {
    // On mobile, the sidebar menu can be opened and closed as a whole by a bootstrap dropdown behavior. This code
    // ensures that when the mobile sidebar menu is re-opened after being closed, the current page is once again the
    // only thing shown, regardless of which submenus were previously shown/hidden.
    $('.sidebar-menu-block__close').on('click', function() {
      $(this).closest('.sidebar-menu-block__opener').dropdown('toggle');
      // Remove the active class from all descendants of this particular
      // Sidebar Menu Block, then add it back to the current page's elements.
      dropdown = $(this).next();
      dropdown.find('.show').removeClass('show');
      dropdown.find('.js-sidebar-menu-current').addClass('show');
    });
  }

  function configure_sidebar_menu_block_level(level) {

    $('.sidebar-menu-block__level-' + level + '__opener, .sidebar-menu-block__level-' + level + '__menu-only').on('click', function() {
      var item = $(this).parent();
      var opener = $(this);
      var submenu = $(this).parent().next('.dropdown-menu');

      // Each time the user clicks an opener, toggle the 'show' class on the related item and submenu.
      item.toggleClass('show');
      submenu.toggleClass('show');

      // Similar to configure_sidebar_menu_block
      // Ensures the submenus leading to current page shown if hidden, but if
      // submenus are not related to current page, they reset when hidden.
      if (!item.hasClass('show')) {
        parent = opener.closest('.menu-item').find('.show').removeClass('show');
      } else {
        parent = opener.closest('.menu-item').find('.js-sidebar-menu-current').addClass('show');
      }

      // Focus to the newly opened submenu
      if (submenu.hasClass('show')) {
        submenu.focus();
      }

      // Prevent the click event from closing the sidebar menu by default.
      return false;
    });
  }

  function configure_slide_menu() {
    // Activate one of the slides when the user clicks the corresponding slide-opener.
    $('.slide-menu__level-1__slide-opener, .slide-menu__level-1__menu-only.dropdown-toggle').on('click', function() {
      var slide_id = $(this).data('slide-id');
      $(slide_id).addClass('js-active');
      $('.slide-menu__slide-wrapper').addClass('js-slid');
      // Use setTimeout to get delay the focus
      // if focused too early it breaks the transition
      setTimeout(function() {
        $(slide_id).focus();
      }, 200);
      // Must return false here to avoid bubbling the click event, which would trigger Bootstrap to close the dropdown.
      return false;
    });

    $('span.slide-menu__level-1__menu-only').on('click', function() {
      // Prevent the non-dropdown buttons from closing the menu.
      return false;
    });

    // Slide the slide-wrapper back into its initial position when the user click the back-button or the black-stripe.
    $('.slide-menu__level-2__back-button, .slide-menu__level-2__black-stripe').on('click', function() {
      slide_id = $(this).closest('.slide-menu__level-2').attr('id')
      $('.slide-menu__slide-wrapper').removeClass('js-slid');
      // remove js-active class
      $('.slide-menu .js-active').removeClass('js-active');
      // return focus back to the opener
      $('.slide-menu__level-1__slide-opener[data-slide-id="#'+slide_id+'"]').focus();
      // Must return false here to avoid bubbling the click event, which would trigger Bootstrap to close the dropdown.
      return false;
    });

    // Also prevent clicks on menu-only page spans from closing the Bootstrap dropdown.
    $('.slide-menu .js-menu-only').on('click', function() {
      return false;
    });

    // Reset the slide behavior classes when the slide menu gets closed (usually by the user clicking outside of it).
    $('.slide-menu').on('hidden.bs.dropdown', function() {
      $('.slide-menu .js-active').removeClass('js-active');
      $('.slide-menu__slide-wrapper').removeClass('js-slid');
    });

    // Set up the slides to vanish AFTER the slide-back-to-level-1 animation transition is finished.
    $('.slide-menu__slide-wrapper').on('transitionend', function() {
      if (!$(this).hasClass('js-slid')) {
        $('.slide-menu .js-active').removeClass('js-active');
      }
    });

    // Create a focus trap inside .slide-menu__level-2
    // https://stackoverflow.com/a/54405310
    $('.slide-menu__level-2').on('keydown', function (event) {
      if (event.key == 'Tab') {
        let target = $(event.target);
        let focusableElements = 'a:visible, button:visible';
        let first = $(this).find(focusableElements).first();
        let last = $(this).find(focusableElements).last();

        // Jump to last if focus shift+tab out of first
        // Jump to first if focus tab out of last
        if (event.shiftKey) {
          if (target.is(first)) {
            last.focus();
            event.preventDefault();
          }
        }
        else if(target.is(last)) {
          first.focus();
          event.preventDefault();
        }
      }
      else if (event.key == 'Escape') {
        // simulate a back button click to go back to the first level
        $(this).find('.slide-menu__level-2__back-button').click();
        return false;
      }
    });
  }

  $(document).ready(function() {
    configure_main_menu();
    configure_search();
    configure_slide_menu();
    configure_sidebar_menu_block();
    configure_sidebar_menu_block_level(2);
    configure_sidebar_menu_block_level(3);
  });
}(jQuery, this, this.document));
