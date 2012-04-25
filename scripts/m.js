(function($) {

  $('#nav').navigation();
  $('dl.accordion').accordion();
  $('input:checkbox').checkbox();
  $('#locations-select .selectbox').selectBox();
  $('#select-activities .selectbox').selectBox({
    multiple: true
  }).find('dl').accordion();
})(jQuery);