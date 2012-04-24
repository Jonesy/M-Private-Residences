(function($) {

  $.fn.navigation = function(options) {
    var defaults = {};

    var plugin = {
      settings: {},
      target: null,
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

      checkMenu: function() {
        console.log(this.isMouseOutOfBounds);
        if (this.isMouseOutOfBounds && this.isActive === false) {
          this.clearMenus();
        }
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
            $(target).fadeIn();
            subnavHeight = $(target).height();
            plugin.isActive = true;
            $(document).on('mousemove', trackMouse);
            $(target)
              .on('mouseenter', function() {
                plugin.isActive = true;
              })
              .on('mouseleave', function() {
                plugin.isActive = false;
                plugin.checkMenu();
              });
          }
        })
        .on('mouseleave', function() {
          plugin.isActive = false;
          timer = setTimeout(function() {
            plugin.checkMenu();
          }, 500);
        });
      });

      $this.on('mouseleave', plugin.checkMenu);


    //   $this.mouseover(function() {
    //     $this.addClass('selected');
    //     if (plugin.isActive) {
    //       plugin.clearMenus();
    //     }

    //     // timer = setTimeout(function() {plugin.checkMenu();}, 1000);

    //     plugin.isActive = true;

    //     $subnav.not(':animated').fadeIn().on('mouseout', function() {
    //       plugin.isActive = true;
    //     });
    //     $(document).on('mousemove', trackMouse);
    //   });

    //   $this.mouseout(function() {
    //     if (plugin.isMouseOutOfBounds) {
    //       plugin.clearMenus();
    //       // clearTimeout(timer);
    //       $(document).off('mousemove', trackMouse);
    //     }
    //   });

      function trackMouse(event) {
        var y = event.pageY;
        if (y > subnavOffsetTop + subnavHeight) {
          console.log('way low');
          plugin.isMouseOutOfBounds = true;
        } else if (y > (subnavOffsetTop + subnavHeight) || y < subnavOffsetTop) {
          console.log('way high');
          plugin.isMouseOutOfBounds = true;
        } else {
          console.log('good');
          plugin.isMouseOutOfBounds = false;
        }
      }
    });
  }

})(jQuery);