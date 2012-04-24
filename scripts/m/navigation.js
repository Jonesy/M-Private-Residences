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
        $('.subnav.selected').removeClass('selected');
        $('.subnav-container').fadeOut();
        this.isActive = false;
      }
    };

    plugin.init();

    return this.each(function() {

      var $this = $(this),
          targetNav = $this.data('target'),
          $subnav = $(targetNav),
          subnavOffsetTop = $this.parentsUntil('.container').height(),
          subnavHeight = $subnav.height(),
          subnavBottom = subnavOffsetTop + subnavHeight;

      $this.mouseover(function() {
        $this.addClass('selected');
        if (plugin.isActive) {
          plugin.clearMenus();
        }

        plugin.isActive = true;

        $subnav.not(':animated').fadeIn();
        $(document).on('mousemove', trackMouse);
      });

      $this.mouseout(function() {
        if (plugin.isMouseOutOfBounds) {
          plugin.clearMenus();
          $(document).off('mousemove', trackMouse);
        }
      });

      function trackMouse(event) {
        var y = event.pageY;
        if (y > subnavBottom) {
          $this.trigger('mouseout');
          plugin.isMouseOutOfBounds = true;
        } else if (y > subnavBottom || y < subnavOffsetTop - 10) {
          plugin.isMouseOutOfBounds = true;
        } else {
          plugin.isMouseOutOfBounds = false;
        }
      }
    });
  }

})(jQuery);