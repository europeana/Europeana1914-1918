/**
 *	@author dan entous contact@gmtplusone.com
 *	@version 2012-02-28 13:57 gmt +1
 */
(function() {
	
	'use strict';
	
	var $location_placename = jQuery('input[id$="_metadata_attributes_field_location_placename"]'),
		$google_places = jQuery('#google-places'),
		$google_places_button = jQuery('#google-places-button'),
		$location_map = jQuery('input[id$="_metadata_attributes_field_location_map"]'),
		$location_map_placeholder = jQuery('#location-map-placholder'),
		$location_zoom = jQuery('input[id$="_metadata_attributes_field_location_zoom"]'),
		$location_zoom_placeholder = jQuery('#location-zoom-placholder');
	
	
	function placenameChangeHandler( evt ) {
		
		RunCoCo.GMap.updateInfoWindow( $location_placename.val() );
		
	}
	
	
	function updateLatLng( latlng ) {
		
		if ( 'object' !== typeof latlng ) {
			return;
		}
		
		$location_map.val( latlng.lat() + ',' + latlng.lng() );
		$location_map_placeholder.html( latlng.lat() + ',' + latlng.lng() );
		
	}
	
	
	function mapSetup() {
	
		if ( 'undefined' !== typeof RunCoCo.GMap.map ) {
			return;
		}
		
		RunCoCo.GMap.addMapToPage('gmap-locate');
		RunCoCo.GMap.addGeocoder();
		RunCoCo.GMap.addInfoWindow();
		RunCoCo.GMap.location_placename = $location_placename.val();
		RunCoCo.GMap.addMarker();
		
		RunCoCo.GMap.getSavedZoom( $location_zoom );
		
		RunCoCo.GMap.addMarkerClickListener();
		RunCoCo.GMap.addMarkerDragEndListener();
		RunCoCo.GMap.addZoomLevelListener( $location_zoom );
		RunCoCo.GMap.addZoomLevelListener( $location_zoom_placeholder );
		
		RunCoCo.GMap.addMapAutoComplete( document.getElementById('google-places') );
		
		RunCoCo.GMap.updateLatLng = updateLatLng;
		
		if ( $location_map.val().length > 0 ) {
			
			RunCoCo.GMap.placeMarker( { address: $location_map.val() } );
			
		}
		
	}
	
	
	function goButtonHandler( evt ) {
		
		evt.preventDefault();
		RunCoCo.GMap.placeMarker( { address : $google_places.val() } );
		
	}
	
	
	function preventEnterOnLocation( evt ) {
		
		if ( evt.which === 13 ) {
			
			evt.preventDefault();
			
		}
		
	}
	
	
	function init() {
		
		if ( 'undefined' === typeof window.google
			|| 'undefined' === typeof google.maps ) {
			return;
		}
		
		$google_places.bind( 'keypress', preventEnterOnLocation );
		$google_places_button.bind( 'click', goButtonHandler );
		$location_placename.bind( 'change', placenameChangeHandler );
		
		if ( jQuery('fieldset[id$="_location"]').hasClass('collapsed') ) {
			
			jQuery('fieldset[id$="_location"] legend').bind( 'click', mapSetup );
			
		} else {
			
			mapSetup();
			
		}
    
	}
  
	init();
	
}());
