/*global I18n, anno, console, jQuery, mejs, RunCoCo */
/*jslint browser: true, regexp: true, white: true */
(function( I18n, $, RunCoCo ) {

	'use strict';

	var map = {

		$map : $('#location-map'),
		$collection_day_map : $('<div>', { id : 'collection-day-map' }),
		$google_map : $('<div>', { id : "google-map" }),

		addMapContainer : function() {
			this.$map
				.after(
					$( this.$google_map )
						.append( this.$collection_day_map )
				);
			$('#google-map').addClass( 'col-cell' );
		},

		locationMap : function() {
			if ( this.$map.length === 1 ) {
				this.addMapContainer();
				RunCoCo.GMap.Display.init('collection-day-map');
			}
		},

		init : function() {
			this.locationMap();
		}
	};

	map.init();

}( I18n, jQuery, RunCoCo ));
