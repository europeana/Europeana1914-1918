jQuery(function() {

  'use strict';
  var map,
      geocoder,
      marker,
      service,
      autocomplete,
      infowindow,
      $placename = jQuery('input[id$="_metadata_attributes_field_location_placename"]'),
      $zoom_level_saved = jQuery('input[id$="_metadata_attributes_field_location_zoom"]'),
      zoom_inital = 3,
      zoom_in_to = 11;
  
  
  function updateLatLng( latlng ) {
    
    jQuery('input[id$="_metadata_attributes_field_location_map"]').val( latlng );
    
  }
  
  
  function updateMarker( place ) {
    
    var address,
        info_content = '',
        // map.fitBounds defaults to zoom level 17, so we need to save the user's zoom level
        save_zoom_level = zoom_in_to;
    
    place = place ? place : autocomplete.getPlace();
    
    if ( 'undefined' === typeof place
          || 'undefined' === typeof place.geometry ) {
      return;
    }
    
    if ( place.geometry.viewport ) {
      map.fitBounds( place.geometry.viewport );
    } else {      
      map.setCenter( place.geometry.location );
    }
    
    infowindow.close();
    
    zoom_in_to = save_zoom_level;
    map.setZoom( zoom_in_to );
    
    marker.setPosition( place.geometry.location );
    updateLatLng( place.geometry.location );
    
    
    if ( place.address_components ) {
      
      address = [
        (place.address_components[0] &&
        place.address_components[0].short_name || ''),
        (place.address_components[1] &&
        place.address_components[1].short_name || ''),
        (place.address_components[2] &&
        place.address_components[2].short_name || '')
      ].join(' ');
      
    }
    
    if ( 'undefined' !== typeof place.name ) {
      
      info_content += '<b>' + place.name + '</b><br/>';
      
    }
    
    if ( 'undefined' !== typeof address  ) {
      
      info_content += address;
      $placename.val( address );
      
    }
    
    if ( 'undefined' !== typeof info_content ) {
    
      infowindow.setContent( '<div>' + info_content + '</div>' );
      infowindow.open( map, marker );
      
    }
  
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
  
  
  function addZoomLevelListener() {
    
    google.maps.event.addListener(map, 'zoom_changed', function() {
      
      // $zoom_level_saved.val( map.getZoom() );
      zoom_in_to = map.getZoom();
      $zoom_level_saved.val( zoom_in_to );
      
    });
    
  }
  
  function addMarkerDragendListener() {
    
    google.maps.event.addListener(marker, 'dragend', function( evt ) {
      
      placeMarker( evt.latLng.Qa + ', ' + evt.latLng.Ra );
      
    });
    
  }
  
  
  function addMarkerClickListener() {
    
    google.maps.event.addListener(marker, 'click', function() {
      
      if ( infowindow ) {
        
        infowindow.open( map, marker );
        
      }
      
    });
    
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
  
  
  /**
   *
   */
  function placeMarker( address ) {
    
    if ( 'undefined' === typeof address
          || 0 === address.length ) {
      return;
    }
    
    geocoder.geocode(
      
      { 'address': address },
      
      function( results, status ) {
      
        if ( status == google.maps.GeocoderStatus.OK ) {          
          updateMarker( results[0] );          
        } else {          
          alert( I18n.t('javascripts.gmap.errors.unknown') + '\n[' + status + ']' );
        }
        
      }
      
    );
    
  }
  
  
  function getSavedZoom() {
      
      if ( parseInt( $zoom_level_saved.val(), 10 ) > 0 ) {
        zoom_in_to = parseInt( $zoom_level_saved.val(), 10 );
      }
      
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
            zoom: parseInt( zoom_inital, 10 ),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
    
    $after_element.after( gmap_canvas );
    
    map =         new google.maps.Map( document.getElementById('gmap-canvas'), map_options );
    geocoder =    new google.maps.Geocoder();
    infowindow =  new google.maps.InfoWindow();
    marker =      createMarker();
    
    addZoomLevelListener();
    addMarkerClickListener();
    addMarkerDragendListener();
    
  }
  
  
  function mapSetup( evt ) {
    
    if ( 'undefined' !== typeof map ) {
      return;
    }
    
    getSavedZoom();
    addMapToPage( jQuery('li[id$="_metadata_attributes_field_location_placename_input"]') );
    addMapAutoComplete();
    placeMarker( $placename.val() );
    
  }
  
  
  function addGoButton( $after_field ) {
    
    var goButton =
        jQuery(
          '<input ' +
            'type="button" ' +
            'value="' + I18n.t('javascripts.gmap.search.button') + '" ' +
            ' />'
          )
          .click(function( evt ) {
            evt.preventDefault();
            placeMarker( $placename.val() );
          });
    
    $after_field.after( goButton );
    
  }
  
  
  function preventEnterOnLocation(evt) {
    
    if ( evt.which === 13 ) {
      evt.preventDefault();
    }
    
  }
  
  
  function initialize() {
    
    if ( 'undefined' === typeof window.google
          || 'undefined' === typeof google.maps ) {      
      return;      
    }
    
    $placename.bind( 'keypress', preventEnterOnLocation );
    $placename.css('font-size','14px');
    addGoButton( $placename );
    
    jQuery('fieldset[id$="_location"] legend').bind( 'click', mapSetup );
    
  }
  
  initialize();
  
});
