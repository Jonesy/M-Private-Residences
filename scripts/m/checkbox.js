(function($) {

  $.fn.checkbox = function(options) {
    var defaults = {};

    var plugin = {
      settings: {},
      init: function() {
        this.settings = $.extend({}, defaults, options);
      }
    };

    plugin.init();


    return this.each(function() {

      var $this = $(this),
          $wrapper = $('<span>').addClass('checkbox off');

      $this.wrap($wrapper);

      $this.parent().parent().css({
        position: 'relative',
        marginLeft: '2em'
      });

      if (Modernizr.svg) {
        $this.after('<img src="/images/svg/check.svg">');
      } else {
        $this.after('<span/>')
      }

      $this.on('change', function() {
        if ($this.prop('checked')) {
          $this.parent().addClass('checked').removeClass('off');
        } else {
          $this.parent().removeClass('checked').addClass('off');
        }
      });
    });
  }

})(jQuery);