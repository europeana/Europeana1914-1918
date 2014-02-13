$(document).ready(function(){
  $('.inline-errors').hide();
  $('#contribution-invalid-notice').after($('<p id="contribution-error-controls"></p>'));

  var hideErrorsLink = $('<a href="' + document.location + '">' + I18n.t('javascripts.contribute.hide_errors') + '</a>');
  hideErrorsLink.bind('click', function(){
    $('.inline-errors').fadeOut();
    $('#contribution-error-controls').children().detach();
    $('#contribution-error-controls').append(showErrorsLink);
    return false;
  });

  var showErrorsLink = $('<a href="' + document.location + '">' + I18n.t('javascripts.contribute.show_errors') + '</a>');
  showErrorsLink.bind('click', function(){
    $('.inline-errors').fadeIn();
    $('#contribution-error-controls').children().detach();
    $('#contribution-error-controls').append($('<span>' + I18n.t('javascripts.contribute.errors_shown') + '</span>').append(hideErrorsLink));
    return false;
  });

  $('#contribution-error-controls').append(showErrorsLink);
});
