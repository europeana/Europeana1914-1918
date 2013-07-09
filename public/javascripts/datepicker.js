$(document).ready(function(){
  $.datepicker.setDefaults({ dateFormat: 'yy-mm-dd', showOn: 'button', buttonText: I18n.t('javascripts.datepicker.button_text'), buttonImage: RunCoCo.relativeUrlRoot + '/images/style/icons/calendar.png', buttonImageOnly: true, defaultDate: '1918-11-11' });
  $(".datepicker").datepicker();
});

