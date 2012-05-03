(function($) {

  $.fn.selectBox = function(options) {
    var defaults = {
      multiple: false
    };

    var plugin = {
      settings: {},

      init: function() {
        this.settings = $.extend({}, defaults, options);
      }
    };

    plugin.init();


    return this.each(function() {

      var $selectBox = $(this),
          $button = $selectBox.find('h3 > a'),
          $list = $selectBox.find('ul, dl'),
          $selections = $list.find('a');

      // Simple state definitions.
      var states = {
        hasSelection: false,
        isSelectionsVisible: false
      };

      // Hide on start
      $list.hide();

      // .selectbox
      $selectBox.on('mouseleave', function() {
        $list.trigger('hide');
      });

      // Select control button. Controls the $list state.
      $button
        .on('click', function(event) {
          event.preventDefault();
        })
        .on('mouseenter', function() {
          $(this).addClass('selected');
          $selectBox.addClass('selected');
          $list.trigger('show');
        })
        .on('mouseleave', function() {
          if (!states.hasSelection && !states.isSelectionsVisible) {
            $(this).removeClass('selected');
          }
        });

      // The selection list container. Subscribes to the $button for states.
      $list
        .on('show', function() {
          $(this).slideDown();
          states.isSelectionsVisible = true;
        })
        .on('hide', function() {
          if (plugin.settings.multiple) {
            if ($selectBox.find('input:checked').length) {
              return false;
            }
          }

          if (!states.hasSelection) {
            $(this).slideUp();
            states.isSelectionsVisible = false;
            $selectBox.removeClass('selected');
            $button.removeClass('selected');
          }
        });

      // Individual selections
      if (!plugin.settings.multiple) {
        $selections.on('click', function(event) {
          event.preventDefault();

          var $this = $(this);

          if ($this.hasClass('selected')) {
            $this.removeClass('selected');
            states.hasSelection = false;
          } else {
            $list.find('a').removeClass('selected');
            $this.addClass('selected');
            states.hasSelection = true;
          }
        });
      }

    });
  }

})(jQuery);