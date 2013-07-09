$(function() {
  if (GBrowserIsCompatible()) {
    $('span.geo').each(function(i) {
      var mapCanvas = $('<div class="gmap-canvas" style="width:470px;height:470px;display:none;"></div>');
      $(this).after(mapCanvas);
      var gmapLink = $('<a href="#">' + I18n.t('javascripts.gmap.static.show') + '</a>');
      gmapLink.bind('click', showGmap);
      $(this).after($('<span class="show-gmap"> </span>').append(gmapLink));
    });
  }
});

function showGmap() {
  $(this).parent().hide();
  
  var mapCanvas = $(this).parent().siblings('.gmap-canvas');
  mapCanvas.show();
  
  var map = new GMap2(mapCanvas.get(0));
  var latlng = GLatLng.fromUrlValue($(this).parent().siblings('.geo').text());
  map.setCenter(latlng, 13);
  map.addControl(new GSmallMapControl());
  map.addOverlay(new GMarker(latlng));
  
  if ($(this).parent().siblings('.hide-gmap').size() > 0) {
    $(this).parent().siblings('.hide-gmap').show();
  } else {
    var hideLink = $('<a href="#">' + I18n.t('javascripts.gmap.static.hide') + '</a>');
    hideLink.bind('click', hideGmap);
    $(this).parent().after($('<span class="hide-gmap"> </span>').append(hideLink));
  }
  
  return false;
}

function hideGmap() {
  $(this).parent().hide();
  $(this).parent().siblings('.gmap-canvas').hide();
  $(this).parent().siblings('.show-gmap').show();
  return false;
}
