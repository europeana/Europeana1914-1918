var map = null;
var geocoder = null;
var marker = null;

$(function() {
  if (GBrowserIsCompatible()) {
    $('.geo').each(function(index) {
      var gmapLink = $('<a href="#" class="gmap-show">' + I18n.t('javascripts.gmap.canvas.show') + '</a>');
      gmapLink.bind('click', showGmapHere);
      $(this).parent('li').append($('<p class="inline-hints"></p>').append(gmapLink));
    });
  }
});

function showGmapHere() {
  if (map) {
    alert(I18n.t('javascripts.gmap.errors.present'));
    return false;
  }
  
  var gmapContainer = $('<ol id="gmap-container"></ol>').hide();
  var gmapCanvas = $('<div id="gmap-canvas"></div>');
  var gmapCanvasLabel = $('<label for="gmap-canvas">' + I18n.t('javascripts.gmap.canvas.label') + '</label>');
  var gmapCanvasHint = $('<p class="inline-hints">' + I18n.t('javascripts.gmap.canvas.hint', {field: $(this).parent().siblings('label').first().text()}) + '</p>');
  var gmapAddressLabel = $('<label for="gmap-address">' + I18n.t('javascripts.gmap.search.label') + '</label>');
  var gmapAddressInput = $('<input type="text" name="gmap-address" id="gmap-address" value="" size="40"/>');
  var gmapAddressButton = $('<button>' + I18n.t('javascripts.gmap.search.button') + '</button>').bind('click', showAddress);
  var gmapAddressHint = $('<p class="inline-hints">' + I18n.t('javascripts.gmap.search.hint') + '</p>');
  
  gmapContainer.append($('<li></li>').append(gmapCanvasLabel).append(gmapCanvas).append(gmapCanvasHint));
  gmapContainer.append($('<li></li>').append(gmapAddressLabel).append(gmapAddressInput).append(gmapAddressButton).append(gmapAddressHint));
  
  $(this).parent().after(gmapContainer);
  
  var gmapCloseLink = $('<a href="#" class="gmap-close">' + I18n.t('javascripts.gmap.canvas.hide') + '</a>');
  gmapCloseLink.bind('click', function() { closeGmap(); return false; });
  $(this).after(gmapCloseLink);
  
  $(this).hide();
  
  $(this).parent().siblings('input.geo').attr('disabled', 'disabled');

  $(this).parents('form').bind('submit.gmap', function() {
    closeGmap(false);
    $(this).unbind('submit.gmap');
  });
  
  var geoVal = $(this).parent().siblings('input.geo').first().attr('value');
  var latLng = geoVal.match(/^\s?(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)\s?$/); // Check valid LAT,LNG format
  if (latLng) {
    var point = new GLatLng(latLng[1], latLng[3]); // Centre over current value
  } else {
    var point = new GLatLng(50.083333, 14.416667); // Centre over Prague
  }
  
  var gmapUI = new GMapUIOptions();
  gmapUI.keyboard = false;
  gmapUI.maptypes = { normal: true };
  gmapUI.controls = { largemapcontrol3d: true };
  gmapUI.zoom = { doubleclick: false };
  
  map = new GMap2(document.getElementById('gmap-canvas'), { size: new GSize(470, 470) } );
  map.setUI(gmapUI);
  map.setCenter(point, 5);
  marker = new GMarker(point, { draggable: true });
  map.addOverlay(marker);
  GEvent.addListener(map, "dblclick", function(overlay, latlng) {
    marker.setLatLng(latlng);
    setGeoInputLatLng(latlng);
  });
  GEvent.addListener(marker, "dragend", function(latlng) {
    setGeoInputLatLng(latlng);
  });
  geocoder = new GClientGeocoder();
  
  gmapContainer.slideDown();
  
  return false;
}

function setGeoInputLatLng(latlng) {
  $('#gmap-container').siblings('input.geo').first().attr('value', latlng.lat() + ',' + latlng.lng());
}

function closeGmap(slide) {
  if (slide == null) slide = true;
  
  $('a.gmap-close').parent().siblings('input.geo').removeAttr('disabled');
  
  if (slide) {
    $('#gmap-container').slideUp('', function() { $(this).remove(); });
  } else {
    $('#gmap-container').remove();
  }
  GUnload();
  map = null;
  geocoder = null;
  marker = null;
  
  $('a.gmap-close').siblings('a.gmap-show').show();
  $('a.gmap-close').remove();
  
  return false;
}

function showAddress() {
  if (geocoder) {
    var address = $(this).siblings('input[type=text]').first().attr('value');
    if (address.match(/^\s?$/)) {
      alert(I18n.t('javascripts.gmap.errors.empty'));
      return false;
    }
    geocoder.getLatLng(
      address,
      function(point) {
        if (!point) {
          alert(I18n.t('javascripts.gmap.errors.unknown'));
        } else {
          map.setCenter(point, 13);
          marker.setLatLng(point);
          setGeoInputLatLng(point);
        }
      }
    );
  }
  return false;
}
