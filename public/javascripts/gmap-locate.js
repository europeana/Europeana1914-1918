/**
 *	@author dan entous contact@gmtplusone.com
 *	@version 2012-02-20 19.00 gmt +1
 */
(function() {
	
	'use strict';
	
	var $placename = jQuery('input[id$="_metadata_attributes_field_location_placename"]'),
		$location_zoom = jQuery('input[id$="_metadata_attributes_field_location_zoom"]');
	
	
	function updatePlaceName( address ) {
		
		$placename.val( address );
		
	}
	
	
	function updateLatLng( latlng ) {
		
		if ( 'undefined' === typeof latlng ) {
			return;
		}
		
		jQuery('input[id$="_metadata_attributes_field_location_map"]').val( latlng.Qa + ', ' + latlng.Ra );
		
	}
	
	
	function mapSetup() {
	
		if ( 'undefined' !== typeof RunCoCo.GMap.map ) {
			return;
		}
		
		RunCoCo.GMap.addMapToPage('gmap-locate');
		RunCoCo.GMap.addGeocoder();
		RunCoCo.GMap.addInfoWindow();
		RunCoCo.GMap.addMarker();
		
		RunCoCo.GMap.getSavedZoom( $location_zoom );
		
		RunCoCo.GMap.addMarkerClickListener();
		RunCoCo.GMap.addMarkerDragEndListener();
		RunCoCo.GMap.addZoomLevelListener( $location_zoom );
		
		RunCoCo.GMap.addMapAutoComplete(
			document.getElementById('contribution_metadata_attributes_field_location_placename')
			|| document.getElementById('attachment_metadata_attributes_field_location_placename')
		);
		
		RunCoCo.GMap.updateLatLng = updateLatLng;
		RunCoCo.GMap.updatePlaceName = updatePlaceName;
		RunCoCo.GMap.placeMarker( $placename.val() );
		
	}

	
	function createMapContainer() {
		
		jQuery('li[id$="_metadata_attributes_field_location_placename_input"]')
			.after( '<li id="gmap-container"><div id="gmap-locate"></div></li>' );
		
	}
	
	
	function addGoButton( $after_field ) {
		
		var goButton = jQuery(
				'<input ' +
					'type="button" ' +
					'value="' + I18n.t('javascripts.gmap.search.button') + '" ' +
				' />'
			).click(function( evt ) {
				evt.preventDefault();
				RunCoCo.GMap.placeMarker( $placename.val() );
			});
		
		$after_field.after( goButton );
	  
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
		
		$placename.bind( 'keypress', preventEnterOnLocation );
		addGoButton( $placename );
		createMapContainer();
		
		if ( RunCoCo.cataloguer ) {
			
			mapSetup();
			
		} else {
		
			jQuery('fieldset[id$="_location"] legend').bind( 'click', mapSetup );
			
		}
    
	}
  
	init();
	
}());