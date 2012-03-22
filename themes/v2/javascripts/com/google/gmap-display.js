/**
 *	@author dan entous contact@gmtplusone.com
 *	@version 2012-03-22 10:24 gmt +1
 */
(function() {
	
	'use strict';
	if ( !window.RunCoCo ) { throw new Error('RunCoCo namespace does not exist'); }
	if ( !RunCoCo.GMap ) { throw new Error('RunCoCo.GMap namespace does not exist'); }
	
	
	RunCoCo.GMap.Display = {
		
		$location_map : jQuery('#location-map'),
		$location_placename : jQuery('#location-placename'),
		$location_zoom : jQuery('#location-zoom'),
	
	
		mapSetup : function( map_container ) {
			
			if ( 'undefined' !== typeof RunCoCo.GMap.map ) {
				return;
			}
			
			RunCoCo.GMap.addMapToPage( map_container );
			RunCoCo.GMap.addGeocoder();
			RunCoCo.GMap.addInfoWindow();
			RunCoCo.GMap.addMarker({ draggable: false });
			
			RunCoCo.GMap.getSavedZoom( this.$location_zoom );
			
			RunCoCo.GMap.addMarkerClickListener();
			RunCoCo.GMap.location_placename = this.$location_placename.val();
			RunCoCo.GMap.placeMarker( { address : this.$location_map.val() } );
			
			if ( this.$location_map.val().length > 0 ) {
				
				RunCoCo.GMap.placeMarker( { address: this.$location_map.val() } );
				
			}
			
		},
		
		
		init : function( map_container ) {
			
			if ( 'undefined' === typeof window.google
				|| 'undefined' === typeof google.maps ) {
				throw new Error('Google Maps has not been loaded');
			}
			
			if ( this.$location_map.length < 1 ) { console.log('returning'); return; }
			this.mapSetup( map_container );
			
		}
		
	};
	
}());