$(function() {
  $('span.geo').each(function(i) {
    var gmapLink = $('<a href="http://maps.google.com/maps/api/staticmap?center='+$(this).text()+'&size=470x470&zoom=13&sensor=false">' + I18n.t('javascripts.gmap.static.show') + '</a>');
    gmapLink.bind('click', showStaticGmap);
    $(this).after($('<span class="show-gmap"> </span>').append(gmapLink));
  });
});

function showStaticGmap() {
  $(this).parent().hide();
  
  if ($(this).parent().siblings('.gmap-static').size() > 0) {
    $(this).parent().siblings('.gmap-static').show();
  } else {
    var gmapImg = $('<img />').attr('src', $(this).attr('href')).attr('alt', '');
    $(this).parent().after($('<div></div>').addClass('gmap-static').append(gmapImg));
  }

  if ($(this).parent().siblings('.hide-gmap').size() > 0) {
    $(this).parent().siblings('.hide-gmap').show();
  } else {
    var hideLink = $('<a href="#">' + I18n.t('javascripts.gmap.static.hide') + '</a>');
    hideLink.bind('click', hideStaticGmap);
    $(this).parent().after($('<span class="hide-gmap"> </span>').append(hideLink));
  }
  
  return false;
}

function hideStaticGmap() {
  $(this).parent().hide();
  $(this).parent().siblings('.gmap-static').hide();
  $(this).parent().siblings('.show-gmap').show();
  return false;
}
