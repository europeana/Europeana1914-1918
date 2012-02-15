jQuery(function() {

  'use strict';
  var map,
      geocoder,
      marker,
      service,
      autocomplete;
  
  
  function stringToLatLng(string) {
    
    var latLng = string.match(/^\s?(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)\s?$/); // Check valid LAT,LNG format
    
    if (latLng) {
      
      return new GLatLng(latLng[1], latLng[3]);
      
    } else {
      
      return null;
      
    }
    
  }
  
  
  function addGetAddressButton( $after_field ) {
    
    var getAddressButton =
      jQuery(
        '<input ' +
          'type="button" ' +
          'value="' + I18n.t('javascripts.gmap.search.button') + '" ' +
          ' />'
        )
        .click( rccShowAddress );
    
    $after_field.after( getAddressButton );
    
  }
  
  /**
   *  @param {jQuery Object} $after_element
   *  represents the dom element that will receive the google map after it
   */
  function addMapToPage( $after_element ) {
    
    var prague = new google.maps.LatLng(50.083333, 14.416667),
        old_center = new google.maps.LatLng(-34.397, 150.644),
        gmap_canvas = jQuery('<li id="gmap-container"><div id="gmap-canvas"></div></li>'),
        map_options = {
            center: prague,
            zoom: 3,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
    
    $after_element.after( gmap_canvas );
    map = new google.maps.Map( document.getElementById('gmap-canvas'), map_options );
    
  }
  
  
  function addMapAutoComplete() {
    
    var input =
      document.getElementById('contribution_metadata_attributes_field_location_placename')
      || document.getElementById('attachment_metadata_attributes_field_location_placename');
    
    if ( 'undefined' === typeof input ) {
      return;
    }
    
    //service = new google.maps.places.PlacesService( map );
    autocomplete = new google.maps.places.Autocomplete( input );
    autocomplete.bindTo('bounds', map);
    
    
    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
		
		// Which animation to play when marker is added to a map.
		// BOUNCE | DROP
		animation : google.maps.Animation.DROP,
		
		// If true, the marker receives mouse and touch events. Default value is true.
		// boolean
		clickable : true,
		
		// Mouse cursor to show on hover
		// string
		cursor : 'wait',
		
		// If true, the marker can be dragged. Default value is false.
		// boolean
		draggable : true,
		
		// If true, the marker shadow will not be displayed.
		// boolean
		flat : false,
		
		// Icon for the foreground
		// string|MarkerImage
		icon : undefined,
		
		// Map on which to display Marker.
		// Map|StreeViewPanorama
		map : map,
		
		// Optimization renders many markers as a single static element. Optimized rendering is enabled by default. Disable optimized rendering for animated GIFs or PNGs, or when each marker must be rendered as a separate DOM element (advanced usage only).
		// boolean
		optimized : true,
		
		// Marker position. Required.
		// LatLng
		//position : place.geometry.location,
		
		// If false, disables raising and lowering the marker on drag. This option is true by default.
		// boolean
		raiseOnDrag : true,
		
		// Shadow image
		// string|MarkerImage
		shadow : undefined,
		
		// Image map region definition udes for drag/click
		// MarkerShape
		shape : undefined,
		
		// Rollover text
		// string
		//title : place.name,
		
		// If true, the marker is visible
		// boolean
		visible : true,
		
		// All markers are displayed on the map in order of their zIndex, with higher values displaying in front of markers with lower values. By default, markers are displayed according to their vertical position on screen, with lower markers appearing in front of markers further up the screen.
		// number
		zIndex : undefined
		
	});
    
    
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      
      infowindow.close();
      var place = autocomplete.getPlace();
      
      if ( 'undefined' === typeof place.geometry ) {
        return;
      }
      
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);  // Why 17? Because it looks good.
      }
      
      marker.setPosition(place.geometry.location);

      var address = '';
      if (place.address_components) {
        address = [(place.address_components[0] &&
                    place.address_components[0].short_name || ''),
                   (place.address_components[1] &&
                    place.address_components[1].short_name || ''),
                   (place.address_components[2] &&
                    place.address_components[2].short_name || '')
                  ].join(' ');
      }

      infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
      infowindow.open(map, marker);
    
    });
    
  }
  
  function getLatLngFromMap() {
    
    var latlng = rccStringToLatLng($(this).attr('value'));
      marker.setLatLng(latlng);
      rccSetGeoInputLatLng(latlng);
      map.setCenter(latlng);
    
  }
  
  
  function rccShowGmapHere() {
    
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
  
  function preventEnterOnLocation(evt) {
    
    if ( evt.which === 13 ) {
      evt.preventDefault();
    }
    
  }
  
  
  function mapSetup( evt ) {
    
    var $placename = jQuery('input[id$="_metadata_attributes_field_location_placename"]');
    
    if ( 'undefined' !== typeof map ) {
      return;
    }
    
    $placename.bind('keypress', preventEnterOnLocation);
    addGetAddressButton( $placename );
    addMapToPage( jQuery('li[id$="_metadata_attributes_field_location_placename_input"]') );
    addMapAutoComplete();
    
    //jQuery('input[id$="_metadata_attributes_field_location_map"]').change( getLatLngFromMap );
    
  }
  
  function initialize() {
    
    if ( 'undefined' === typeof window.google
          || 'undefined' === typeof google.maps ) {
      
      return;
      
    }
    
    jQuery('#attachment_location legend').bind( 'click', mapSetup );
    
  }
  
  initialize();
  
});
