jQuery(function() {

  'use strict';
  var map,
      geocoder,
      marker,
      service,
      autocomplete,
      infowindow,
      $placename = jQuery('input[id$="_metadata_attributes_field_location_placename"]');
  
  
  function addGetAddressButton( $after_field ) {
    
    var getAddressButton =
        jQuery(
          '<input ' +
            'type="button" ' +
            'value="' + I18n.t('javascripts.gmap.search.button') + '" ' +
            ' />'
          )
          .click( showAddress );
    
    $after_field.after( getAddressButton );
    
  }
  
  function createMarker() {
    
    return new google.maps.Marker({
		
		// Which animation to play when marker is added to a map.
		// BOUNCE | DROP
		animation : google.maps.Animation.DROP,
		
		// If true, the marker receives mouse and touch events. Default value is true.
		// boolean
		clickable : true,
		
		// Mouse cursor to show on hover
		// string
		cursor : undefined,
		
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
		position : undefined,
		
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
		title : undefined,
		
		// If true, the marker is visible
		// boolean
		visible : true,
		
		// All markers are displayed on the map in order of their zIndex, with higher values displaying in front of markers with lower values. By default, markers are displayed according to their vertical position on screen, with lower markers appearing in front of markers further up the screen.
		// number
		zIndex : undefined
		
	});
    
  }
  
  
  function updateLatLng( latlng ) {
    
    jQuery('input[id$="_metadata_attributes_field_location_map"]').val( latlng );
    
  }
  
  
  function updateMarker( place ) {
    
    var address,
        place_name,
        info_content = '';
    
    place = place ? place : autocomplete.getPlace();
    
    if ( 'undefined' === typeof place
          || 'undefined' === typeof place.geometry ) {
      return;
    }
    
    infowindow.close();
    
    if ( place.geometry.viewport ) {
      
      map.fitBounds( place.geometry.viewport );
      
    } else {
      
      map.setCenter( place.geometry.location );
      map.setZoom( 17 );  // Why 17? Because it looks good.
      
    }
    
    marker.setPosition( place.geometry.location );
    
    
    if ( place.name ) {
      place_name = place.name;
    }
    
    if ( place.address_components ) {
      
      address = [
        (place.address_components[0] &&
        place.address_components[0].short_name || ''),
        (place.address_components[1] &&
        place.address_components[1].short_name || ''),
        (place.address_components[2] &&
        place.address_components[2].short_name || '')
      ].join(' ');
      
      if ( 'undefined' === typeof place_name ) {
        
        place_name = place.address_components[0].long_name;
        
      }
      
    }
    
    if ( 'undefined' !== typeof place_name ) {
      
      info_content += '<b>' + place_name + '</b><br/>';
      
    }
    
    if ( 'undefined' !== typeof address  ) {
      
      info_content += address;
      
    }
    
    if ( 'undefined' !== typeof info_content ) {
    
      infowindow.setContent( '<div>' + info_content + '</div>' );
      infowindow.open( map, marker );
      
    }
    
    updateLatLng( place.geometry.location );
  
  }
  
  
  function addMapAutoComplete() {
    
    var input =
      document.getElementById('contribution_metadata_attributes_field_location_placename')
      || document.getElementById('attachment_metadata_attributes_field_location_placename');
    
    
    if ( 'undefined' === typeof input ) {      
      return;      
    }
    
    autocomplete = new google.maps.places.Autocomplete( input );
    autocomplete.bindTo('bounds', map);
    google.maps.event.addListener( autocomplete, 'place_changed', updateMarker );
    
  }
  
  
  /**
   *  @param {jQuery Object} $after_element
   *  represents the dom element that will receive the google map after it
   */
  function addMapToPage( $after_element ) {
    
    var prague = new google.maps.LatLng(50.083333, 14.416667),
        gmap_canvas = jQuery('<li id="gmap-container"><div id="gmap-canvas"></div></li>'),
        map_options = {
            center: prague,
            zoom: 3,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
    
    $after_element.after( gmap_canvas );
    
    map =         new google.maps.Map( document.getElementById('gmap-canvas'), map_options );
    geocoder =    new google.maps.Geocoder();
    infowindow =  new google.maps.InfoWindow();
    marker =      createMarker();
    
    
    google.maps.event.addListener(marker, 'click', function() {
      if ( infowindow ) {
        infowindow.open( map, marker );
      }
    });
    
    google.maps.event.addListener(marker, 'dragend', function( evt ) {
      
      getAddressFromLatLng( evt.latLng );
      
    });
    
  }
  
  
  function showAddress( evt ) {
    
    var address = $placename.val();
    evt.preventDefault();
    
    
    geocoder.geocode(
      
      { 'address': address },
      
      function( results, status ) {
      
        if ( status == google.maps.GeocoderStatus.OK ) {
          
          updateMarker( results[0] );
          
        } else {
          
          alert("Geocode was not successful for the following reason: " + status);
          
        }
        
      }
      
    );
  
  }
  
  
  function getAddressFromLatLng( latlng ) {
  
    latlng = latlng.Qa + ', ' + latlng.Ra;
    
    geocoder.geocode(
      
      { 'address': latlng },
      
      function( results, status ) {
      
        if ( status == google.maps.GeocoderStatus.OK ) {
          
          updateMarker( results[0] );
          
        } else {
          
          alert("Geocode was not successful for the following reason: " + status);
          
        }
        
      }
      
    );
    
  }
  
  
  function preventEnterOnLocation(evt) {
    
    if ( evt.which === 13 ) {
      evt.preventDefault();
    }
    
  }
  
  
  function mapSetup( evt ) {
    
    if ( 'undefined' !== typeof map ) {
      return;
    }
    
    $placename.bind( 'keypress', preventEnterOnLocation );
    $placename.css('font-size','14px');
    addGetAddressButton( $placename );
    addMapToPage( jQuery('li[id$="_metadata_attributes_field_location_placename_input"]') );
    addMapAutoComplete();
    
  }
  
  function initialize() {
    
    if ( 'undefined' === typeof window.google
          || 'undefined' === typeof google.maps ) {
      
      return;
      
    }
    
    jQuery('fieldset[id$="_location"] legend').bind( 'click', mapSetup );
    
  }
  
  initialize();
  
});
