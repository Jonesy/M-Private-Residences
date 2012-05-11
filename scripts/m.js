(function($) {

  $('#nav').navigation();
  $('dl.accordion').accordion();
  $('input:checkbox').checkbox();
  $('#locations-select .selectbox').selectBox();
  $('#select-activities .selectbox').selectBox({
    multiple: true
  }).find('dl').accordion();

  $('.fancybox').fancybox();

  var $residencesGrid = $('#our-residences'),
      $residencesFilter = $('#residences-filter');
  $residencesGrid.isotope({
    itemSelector : '.residence'
  });

  $residencesFilter.find('a').on('click', function(event) {
    event.preventDefault();

    var selector = $(this).data('filter');

    $(this).parent().siblings().removeClass('selected')
    $(this).parent().addClass('selected');

    $residencesGrid.trigger('changeFilters');
  });

  $residencesGrid.on('changeFilters', function() {
    var filters = $residencesFilter.find('.btn-group').map(function() {
      return $(this).find('li.selected a').data('filter');
    }).get().join('');

    $(this).isotope({filter: filters});
  });

  // Grayscale images
  // var $grayImgs = $('.grayscale > img');

  // $('.grayscale')
  //   .on('mouseover', function() {
  //     grayscale.reset($(this));
  //   })
  //   .on('mouseleave', function() {
  //     if (!$(this).hasClass('selected')) {
  //       grayscale($(this));
  //     }
  //   });
  // if ($grayImgs.length) {
  //   grayscale($grayImgs);
  // }
  
})(jQuery);