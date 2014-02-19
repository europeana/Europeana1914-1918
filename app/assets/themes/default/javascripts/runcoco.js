$(function() {
  $('.jquery-help').each(function(i) {
    var dialog = $(this);
    var dialogLink = $('<a href=" " title="'+ $(this).attr('title')+'"><img src="'+ RunCoCo.relativeUrlRoot +'/assets/style/icons/help.png" alt="'+ $(this).attr('title')+'" /></a>');
    dialogLink.bind('click', function() {
      var x = $(this).offset().left + $(this).outerWidth() + 10;
      var y = $(this).offset().top;
      $(dialog).dialog('option', 'position', [x,y]);
      $(dialog).dialog('open');
      return false;
    });
    $(this).before(dialogLink);
    $(this).dialog({
      autoOpen: false,
      minHeight: 50,
      title: $(this).attr('title')
    });
  });
});
