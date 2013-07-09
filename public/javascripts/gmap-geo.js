var map = null;
var geocoder = null;
var marker = null;

$(function() {
  if ( 'undefined' !== typeof GBrowserIsCompatible && GBrowserIsCompatible() ) {
    $('input.geo').each(function(index) {
      rccShowGmapHere.call(this);
    });
    
    var gmapAddressButton = $('<input type="button" value="' + I18n.t('javascripts.gmap.search.button') + '" />').click(rccShowAddress);
    $('input[id$="_metadata_attributes_field_location_placename"]').after(gmapAddressButton);
  }
});

function rccStringToLatLng(string) {
  var latLng = string.match(/^\s?(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)\s?$/); // Check valid LAT,LNG format
  if (latLng) {
    return new GLatLng(latLng[1], latLng[3]); 
  } else {
    return null;
  }
}

function rccShowGmapHere() {
  if (map) {
    alert(I18n.t('javascripts.gmap.errors.present'));
    return false;
  }
  
  var hiddenInput = $('<input type="hidden"/>');
  hiddenInput.attr('id', $(this).attr('id'));
  hiddenInput.attr('name', $(this).attr('name'));
  hiddenInput.attr('value', $(this).attr('value'));
  hiddenInput.change(function() {
    var latlng = rccStringToLatLng($(this).attr('value'));
    marker.setLatLng(latlng);
    rccSetGeoInputLatLng(latlng);
    map.setCenter(latlng);
  });
  
  var gmapContainer = $('<div id="gmap-container"></div>');
  var gmapCanvas = $('<div id="gmap-canvas"></div>');
  var gmapCanvasHint = $('<p class="inline-hints">' + I18n.t('javascripts.gmap.canvas.hint', {field: $(this).parents('li').children('label').first().text()}) + '</p>');

  gmapContainer.append(gmapCanvas).append(gmapCanvasHint);
  $(this).after(gmapContainer);
  
  var point = rccStringToLatLng($(this).attr('value'));
  if (!point) {
    var point = new GLatLng(50.083333, 14.416667); // Centre over Prague
  }

  var gmapUI = new GMapUIOptions();
  gmapUI.keyboard = false;
  gmapUI.maptypes = { normal: true };
  gmapUI.controls = { largemapcontrol3d: true };
  gmapUI.zoom = { doubleclick: false, scrollwheel: true };
  
  map = new GMap2(document.getElementById('gmap-canvas'), { size: new GSize(470, 470) } );
  map.setUI(gmapUI);
  map.setCenter(point, 5);
  marker = new GMarker(point, { draggable: true });
  map.addOverlay(marker);
  GEvent.addListener(map, "dblclick", function(overlay, latlng) {
    marker.setLatLng(latlng);
    rccSetGeoInputLatLng(latlng);
  });
  GEvent.addListener(marker, "dragend", function(latlng) {
    rccSetGeoInputLatLng(latlng);
    rccLookupPlaceName(latlng);
  });
  geocoder = new GClientGeocoder();
  
  $(this).replaceWith(hiddenInput);
  
  return false;
}

function rccSetGeoInputLatLng(latlng) {
  $('#gmap-container').siblings('input[type="hidden"]').first().attr('value', latlng.lat() + ',' + latlng.lng());
}

function rccLookupPlaceName(latlng) {
  if (geocoder) {
    geocoder.getLocations(latlng, function(response) {
      if (response && response.Status.code == 200) {
        place = response.Placemark[0];
        var placeNameField = $('input[id$="_metadata_attributes_field_location_placename"]');
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
        placeNameField.attr('value', placeName);
      }
    });
  }
}

function rccShowAddress() {
  if (geocoder) {
    var address = $(this).siblings('input[type="text"]').attr('value');
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
          rccSetGeoInputLatLng(point);
        }
      }
    );
  }
  return false;
}

