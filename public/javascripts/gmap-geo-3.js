var map = null;
var geocoder = null;
var marker = null;

$(function() {
  if (GBrowserIsCompatible()) {
    $('input.geo').each(function(index) {
      showGmapHere.call(this);
    });
    
    $('#contribution_metadata_attributes_field_location_placename')
      .data('timeout', null)
      .keyup(function(){
          clearTimeout($(this).data('timeout'));
          $(this).data('timeout', setTimeout(showAddress, 2000, this));
      });
  }
});

function showGmapHere() {
  if (map) {
    alert(I18n.t('javascripts.gmap.errors.present'));
    return false;
  }
  
  var hiddenInput = $('<input type="hidden"/>');
  hiddenInput.attr('id', $(this).attr('id'));
  hiddenInput.attr('name', $(this).attr('name'));
  hiddenInput.attr('value', $(this).attr('value'));
  
  var gmapContainer = $('<div id="gmap-container"></div>');
  var gmapCanvas = $('<div id="gmap-canvas"></div>');
  var gmapCanvasHint = $('<p class="inline-hints">' + I18n.t('javascripts.gmap.canvas.hint', {field: $(this).parents('li').children('label').first().text()}) + '</p>');

  gmapContainer.append(gmapCanvas).append(gmapCanvasHint);
  $(this).after(gmapContainer);
  
  var geoVal = $(this).attr('value');
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
    lookupPlaceName(latlng);
  });
  geocoder = new GClientGeocoder();
  
  $(this).replaceWith(hiddenInput);
  
  return false;
}

function setGeoInputLatLng(latlng) {
  $('#gmap-container').siblings('input[type="hidden"]').first().attr('value', latlng.lat() + ',' + latlng.lng());
}

function lookupPlaceName(latlng) {
  if (geocoder) {
    geocoder.getLocations(latlng, function(response) {
      if (response && response.Status.code == 200) {
        place = response.Placemark[0];
        var placeNameField = $('#contribution_metadata_attributes_field_location_placename');
        var placeName = placeNameField.attr('value');

        if (typeof place.AddressDetails.Country.AdministrativeArea === "undefined") {
          placeName = place.address;
        } else if (typeof place.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea === "undefined") {
          placeName = place.AddressDetails.Country.AdministrativeArea.AdministrativeAreaName;
        } else if (typeof place.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality === "undefined") {
          placeName = place.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.SubAdministrativeAreaName;
        } else {
          placeName = place.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.LocalityName;
        }
        $('#contribution_metadata_attributes_field_location_placename').attr('value', placeName);
      }
    });
  }
}

function showAddress(input) {
  if (geocoder) {
    var address = $(input).attr('value');
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
          map.setCenter(point, 5);
          marker.setLatLng(point);
          setGeoInputLatLng(point, false);
        }
      }
    );
  }
  return false;
}
