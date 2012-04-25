(function($) {

  $.fn.navigation = function(options) {
    var defaults = {};

    var plugin = {
      settings: {},
      target: null,
      mouseIsInNav: false,
      selectedNavMenu: null,
      mouseIsInSubNav: false,
      isMouseOutOfBounds: true,
      isActive: false,

      init: function() {
        this.settings = $.extend({}, defaults, options);
      },

      clearMenus: function() {
        $('.selected').removeClass('selected');
        $('.subnav-container').fadeOut();
        this.isActive = false;
        timer = null;
        $(document).off('mousemove');
      },

      checkMenuState: function() {
        setTimeout(function() {
          console.log(plugin.isActive);
          if (!plugin.isActive) {
            console.log('shut er down')
            plugin.clearMenus();
          }
        }, 100);
      },
      leaveMenuItem: function() {
        setTimeout(function() {
          if (!plugin.selectedNavMenu) {
            plugin.isActive = false;
            plugin.checkMenuState();
          }
        }, 1000);
      }
    };

    plugin.init();

    var timer;

    return this.each(function() {

      var $this = $(this),
          $buttons = $this.find('a'),
          $subnavButtons = $buttons.filter('.subnav'),
          $containers = $('.subnav-container'),
          subnavOffsetTop = $this.height(),
          subnavHeight,
          subnavBottom = subnavOffsetTop + subnavHeight;

      $buttons.each(function() {
        var $b = $(this);

        $b.on('mouseenter', function() {
          var target = $b.data('target');

          plugin.clearMenus();
          $b.addClass('selected');

          if (target) {
            console.log(plugin.selectedNavMenu);
            $(target).fadeIn();

            subnavHeight = $(target).height();
            plugin.selectedNavMenu = target;
            plugin.isActive = true;

            $(target)
              .on('mouseenter', function() {
                plugin.selectedNavMenu = $(this).prop('id');
                plugin.isActive = true;
                plugin.isActive = true;
              })
              .on('mouseleave', function() {
                plugin.selectedNavMenu = null;
                plugin.leaveMenuItem();
                plugin.isActive = false;
              });
          }
        })
        // .on('mouseleave', function() {
        //   plugin.isActive = false;
        //   timer = setTimeout(function() {
        //     plugin.checkMenuState();
        //   }, 500);
        // });
      });

      $this.on('mouseleave', function() {
        plugin.isActive = false;
        plugin.selectedNavMenu = null;
        plugin.checkMenuState();
      });

      $containers.on('mouseenter', function() {
        plugin.selectedNavMenu = $(this).prop('id');
        plugin.isActive = true;
      })
      .on('mouseleave', function() {
        plugin.selectedNavMenu = null;
        plugin.leaveMenuItem();
      });

      // function trackMouse(event) {
      //   var y = event.pageY;
      //   if (y > subnavOffsetTop + subnavHeight) {
      //     console.log('way low');
      //     plugin.isMouseOutOfBounds = true;
      //   } else if (y > (subnavOffsetTop + subnavHeight) || y < subnavOffsetTop) {
      //     console.log('way high');
      //     plugin.isMouseOutOfBounds = true;
      //   } else {
      //     console.log('good');
      //     plugin.isMouseOutOfBounds = false;
      //   }
      // }
    });
  }

})(jQuery);