/**
 *	@author dan entous contact@gmtplusone.com
 *	@version 2012-02-28 13:57 gmt +1
 */
(function() {

	'use strict';
	
	window.RunCoCo.GMap = {
		
		map : undefined,
		geocoder : undefined,
		marker : undefined,
		service : undefined,
		autocomplete : undefined,
		infowindow : undefined,
		location_placename : undefined,
		zoom_inital : 3,
		zoom_in_to : 11,
		updateLatLng : function(){},
		updatePlaceName : function(){},
		
		
		/**
		 *	@param {String} address
		 *	can be a street address | latlng | city | country
		 *
		 *	@see http://code.google.com/apis/maps/documentation/javascript/geocoding.html#GeocodingRequests
		 */
		placeMarker : function( options ) {
	   
			if ( 'object' !== typeof options ) { return; }			
			if ( options.address && options.address.length < 1 ) { return; }
			if ( options.latLng && options.latLng.length < 1 ) { return; }
			
			
			RunCoCo.GMap.geocoder.geocode(
			 
				options,
			   
				function( results, status ) {
			   
					if ( status === google.maps.GeocoderStatus.OK ) {
					   
						RunCoCo.GMap.updateMarker( results[0] );
					   
					} else {
					   
						if ( window.console ) {
							
							console.log( I18n.t('javascripts.gmap.errors.unknown') );
							console.log( status );
							console.log( options );
							
						}
					   
					}
				 
				}
			 
		   );
		   
		},
	   
		
		/**
		 *	retrieves a saved zoom value from a given jQuery object
		 */
		getSavedZoom : function( $zoom ) {
			
			if ( parseInt( $zoom.val(), 10 ) > 0 ) {
				
				RunCoCo.GMap.zoom_in_to = parseInt( $zoom.val(), 10 );
				
			}
      
		},
		
		
		addMarkerClickListener : function() {
	  
			google.maps.event.addListener( RunCoCo.GMap.marker, 'click', function() {
		  
				if ( RunCoCo.GMap.infowindow ) {
					
				  RunCoCo.GMap.infowindow.open( RunCoCo.GMap.map, RunCoCo.GMap.marker );
			  
				}
		  
			});
			
		},
		
		
		/**
		 *	@see http://code.google.com/apis/maps/documentation/javascript/geocoding.html#GeocodingRequests
		 */
		addMarkerDragEndListener : function() {
			
			google.maps.event.addListener( RunCoCo.GMap.marker, 'dragend', function( evt ) {
				
				RunCoCo.GMap.placeMarker( { latLng : evt.latLng } );
				
			});
		
		},
		
		
		addZoomLevelListener : function( $location_zoom ) {
		
			google.maps.event.addListener( RunCoCo.GMap.map, 'zoom_changed', function() {
				
				RunCoCo.GMap.zoom_in_to = RunCoCo.GMap.map.getZoom();
				
				if ( $location_zoom.is('input') ) {
					
					$location_zoom.val( RunCoCo.GMap.zoom_in_to );
				
				} else {
					
					$location_zoom.html( RunCoCo.GMap.zoom_in_to );
					
				}
				
			});
			
		},
		
		
		updateInfoWindow : function( content ) {
			
			if ( !content || content.length < 1 ) { return; }
			
			RunCoCo.GMap.infowindow.setContent( '<div>' + content + '</div>' );
			RunCoCo.GMap.infowindow.open( RunCoCo.GMap.map, RunCoCo.GMap.marker );
			
		},
		
		
		updateMarker : function( place ) {
			
			var address,
				info_content = '',
				// map.fitBounds defaults to zoom level 17, so we need to save the user's zoom level
				save_zoom_level = RunCoCo.GMap.zoom_in_to;
			
			place = place || RunCoCo.GMap.autocomplete.getPlace();
			
			if ( 'undefined' === typeof place
				|| 'undefined' === typeof place.geometry ) {
				return;
			}
			
			if ( place.geometry.viewport ) {
				
				RunCoCo.GMap.map.fitBounds( place.geometry.viewport );
				
			} else {      
				
				RunCoCo.GMap.map.setCenter( place.geometry.location );
				
			}
			
			RunCoCo.GMap.infowindow.close();
			
			RunCoCo.GMap.zoom_in_to = save_zoom_level;
			RunCoCo.GMap.map.setZoom( RunCoCo.GMap.zoom_in_to );
			
			RunCoCo.GMap.marker.setPosition( place.geometry.location );
			RunCoCo.GMap.updateLatLng( place.geometry.location );			
			RunCoCo.GMap.updateInfoWindow( RunCoCo.GMap.location_placename );
			
		},
		
		
		addMapAutoComplete : function( input ) {
			
			if ( !input ) {
				return;   
			}
		
			RunCoCo.GMap.autocomplete = new google.maps.places.Autocomplete( input );
			RunCoCo.GMap.autocomplete.bindTo( 'bounds', RunCoCo.GMap.map );
			google.maps.event.addListener( RunCoCo.GMap.autocomplete, 'place_changed', RunCoCo.GMap.updateMarker );
		
		},
		
		
		addInfoWindow : function() {
			
			RunCoCo.GMap.infowindow = new google.maps.InfoWindow();
			
		},
		
		
		addGeocoder : function() {
			
			RunCoCo.GMap.geocoder = new google.maps.Geocoder();
			
		},
		
		
		addMarker : function( options ) {
			
			var marker_options = {
					animation : google.maps.Animation.DROP,
					clickable : true,
					draggable : true,
					map : RunCoCo.GMap.map,
					raiseOnDrag : true,
					visible : true
				};
			
			if ( options ) {
				
				marker_options = jQuery.extend( {}, marker_options, options );
				
			}
			
			RunCoCo.GMap.marker = new google.maps.Marker( marker_options );
			
		},
		
		
		/**
		 *  @param {String} id
		 *  represents the id of dom element that will receive the google map
		 *
		 *  @param {Object} options
		 *  an object representing two sub-objects : map_options & marker_options
		 *  @see http://code.google.com/apis/maps/documentation/javascript/reference.html#MapOptions
		 *	@see http://code.google.com/apis/maps/documentation/javascript/reference.html#MarkerOptions
		 */
		addMapToPage : function( id, options ) {
    
			var map_options = {
					center: new google.maps.LatLng(50.083333, 14.416667), // prague
					zoom: RunCoCo.GMap.zoom_inital,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};
			
			
			if ( options ) {
				
				map_options = jQuery.extend( {}, map_options, options );
				
			}
			
			RunCoCo.GMap.map = new google.maps.Map( document.getElementById(id), map_options );
			
		}
		
	};
  
}());
