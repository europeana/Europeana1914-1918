/**
 *	@author dan entous contact@gmtplusone.com
 *	@version 2012-02-20 19.00 gmt +1
 */
(function() {
	
	'use strict';
	
	
	var $location_map = jQuery('#location-map'),
		$location_zoom = jQuery('#location-zoom');
	
	
	function mapSetup() {
	
		if ( 'undefined' !== typeof RunCoCo.GMap.map ) {
			return;
		}
		
		RunCoCo.GMap.addMapToPage('gmap-display');
		RunCoCo.GMap.addGeocoder();
		RunCoCo.GMap.addInfoWindow();
		RunCoCo.GMap.addMarker({ draggable: false });
		
		RunCoCo.GMap.getSavedZoom( $location_zoom );
		
		RunCoCo.GMap.addMarkerClickListener();
		RunCoCo.GMap.placeMarker( { address : $location_map.val() } );
		
		if ( $location_map.val().length > 0 ) {
			
			RunCoCo.GMap.placeMarker( { address: $location_map.val() } );
			
		}
		
	}
	
	
	function createMapContainer() {
		
		$location_map.parent()
			.prepend( '<div id="gmap-container"><div id="gmap-display"></div></div>' );
		
	}
	
	
	function init() {
		
		if ( 'undefined' === typeof window.google
			|| 'undefined' === typeof google.maps ) {
			return;
		}
		
		createMapContainer();
		mapSetup();
		
	}
  
	init();
	
}());