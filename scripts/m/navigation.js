(function($) {

  $.fn.navigation = function(options) {
    var defaults = {};

    var plugin = {
      settings: {},
      selectedNavMenu: null,
      selectedSubNavMenu: null,
      hasMouseOverNav: null,
      el: null,

      init: function() {
        this.settings = $.extend({}, defaults, options);
      },

      clearMenus: function() {
        $('.subnav-container').find('.selected').removeClass('selected');
        $('.subnav-container').find('.subnav-container:visible').fadeOut();
      },

      checkMenuState: function() {
        return !plugin.selectedNavMenu && !plugin.selectedSubNavMenu;
      },

      leaveMenuItem: function() {
        setTimeout(function() {
          if (plugin.checkMenuState()) {
            plugin.clearMenus();
          }
        }, 500);
      },

      leaveNavigation: function(event) {
        if (!plugin.hasMouseOverNav) {
          plugin.selectedNavMenu = null;
          plugin.leaveMenuItem();
        }
      }
    };

    plugin.init();

    return this.each(function() {

      var $this = $(this),
          $buttons = $this.find('a'),
          $subnavButtons = $buttons.filter('.subnav'),
          $containers = $('.subnav-container');

      $buttons.each(function() {
        var $button = $(this);

        $button.on('mouseenter', function() {
          var target = $button.data('target');

          if (plugin.checkMenuState() || target !== plugin.selectedNavMenu) {
            plugin.clearMenus();
          }
          plugin.selectedNavMenu = target;

          if (target) {
            $button.addClass('selected');
            $(target).fadeIn();

            plugin.selectedNavMenu = target;

            $(target)
              .on('mouseenter', function() {
                plugin.selectedNavMenu = target;
                plugin.selectedSubNavMenu = target;
              })
              .on('mouseleave', function() {
                plugin.selectedSubNavMenu = null;
                plugin.leaveMenuItem();
              });
          }
        });
      });

      $this
      .on('mouseenter', function() {
        plugin.hasMouseOverNav = true;
      })
      .on('mouseleave', function() {
        plugin.hasMouseOverNav = false;
        plugin.leaveNavigation();
      });

      $('header,section,#main').on('mouseenter', plugin.leaveNavigation);

    });
  };

})(jQuery);