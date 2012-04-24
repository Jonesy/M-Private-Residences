(function($) {

  $.fn.accordion = function(options) {
    var defaults = {};

    var plugin = {
      settings: {},
      buttonOnImg: '<img src="/images/svg/button-hide.svg" alt="">',
      buttonOffImg: '<img src="/images/svg/button-expand.svg" alt="">',
      init: function() {
        this.settings = $.extend({}, defaults, options);
      },
      createButton: function() {
        var $button = $('<button>').addClass('toggle');
        
        if (Modernizr.svg) {
          $button.html(this.buttonOffImg);
        }
        return $button;
      } 
    };

    plugin.init();

    return this.each(function() {

      var $this = $(this),
          $titles = $this.find('dt'),
          $defs = $this.find('dd'),
          $toggleButton = plugin.createButton();

      $toggleButton.on('click', function() {
        var $title = $(this).parent();
        if ($title.hasClass('selected')) {
          $(this).parent().trigger('unselect');
          $(this).html(plugin.buttonOffImg);
        } else {
          $(this).parent().trigger('select');
          $(this).html(plugin.buttonOnImg);
        }
      });

      $titles
        .on('select', function() {
          $(this).siblings().trigger('unselect');
          $(this).addClass('selected')
            .next().slideDown();
        })
        .on('unselect', function() {
          var $this = $(this)
          $this.find('button').html(plugin.buttonOffImg);
          $this.next().slideUp(function() {
            $this.removeClass('selected')
          });
        });

      $this.addClass('is-active');
      $this.find('dt').prepend($toggleButton)
      $this.find('dd').hide();


    });
  }

})(jQuery);