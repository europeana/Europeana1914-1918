/*global europeana, I18n, jQuery, L, RunCoCo */
/*jslint browser: true, nomen: true, white: true */
(function( $ ) {

	'use strict';

	var leaflet = {

		get_directions: false,
		$get_directions: {},
		map: {},
		$map_container: $('#map-container'),
		routing_ctrl: undefined,


		addGetDirections: function() {
			if ( !this.get_directions ) {
				return;
			}

			this.$map_container.append(
				$('<a>')
					.attr( 'href', '' )
					.attr( 'id', 'get-directions' )
					.text( I18n.t( 'javascripts.collection-days.get-directions' ) ) );

			this.$get_directions = $('#get-directions');
			this.addGetDirectionsListener();
		},

		addGetDirectionsListener: function() {
			this.$get_directions.on('click', this.handleGetDirectionsClick);
		},

		addLeafletMap: function() {
			var
				map_config = {},
				map_options,
				markers;

			if (
				RunCoCo.leaflet.markers !== undefined &&
				$.isArray( RunCoCo.leaflet.markers )
			) {
				markers = RunCoCo.leaflet.markers;
			}

			if ( RunCoCo.leaflet.map_options !== undefined ) {
				map_options = RunCoCo.leaflet.map_options;
			}

			map_config.map_options = map_options;
			map_config.markers = markers;

			if ( this.add_directions ) {
				map_config.add_routing = true;
			}

			this.map = europeana.leaflet.init( map_config );
		},

		addMapContainerListener: function addMapContainerListener() {
			this.$map_container.on(
				'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',
				this.mapComtainerTransitionHandler
			);
		},

		addRouting: function addRouting() {
			this.routing_ctrl = L.Routing.control({
				waypoints: [
					'',
					L.latLng(
						RunCoCo.leaflet.markers[0].latlng[0],
						RunCoCo.leaflet.markers[0].latlng[1]
					)
				],
				geocoder: L.Control.Geocoder.nominatim(),
				lineOptions: {
					styles: [
						// Shadow
						{color: 'black', opacity: 0.8, weight: 11},
						// Outline
						{color: 'green', opacity: 0.8, weight: 8},
						// Center
						{color: 'orange', opacity: 1, weight: 4}
					]
				}
			});

			this.routing_ctrl.addTo( this.map );
			this.$routing_ctrl = $( this.routing_ctrl._container );
		},

		addRoutingAndResize: function addRoutingAndResize() {
			leaflet.invalidateSize();
			leaflet.addRouting();
		},

		/**
		 *
		 * @param {Event} evt
		 * jQuery Event
		 */
		handleGetDirectionsClick: function handleGetDirectionsClick( evt ) {
			evt.preventDefault();

			if ( leaflet.$map_container.hasClass('expand') ) {
				leaflet.$map_container.removeClass('expand');
				leaflet.$get_directions.text( I18n.t( 'javascripts.collection-days.get-directions' ) );

				if ( leaflet.routing_ctrl !== undefined ) {
					leaflet.$routing_ctrl.fadeOut();
				}
			} else {
				leaflet.$map_container.addClass('expand');
				leaflet.$get_directions.text( I18n.t( 'javascripts.collection-days.close-directions' ) );

				if ( leaflet.routing_ctrl !== undefined ) {
					leaflet.$routing_ctrl.fadeIn();
				} else if ( !$.support.transition ) {
					setTimeout(
						leaflet.addRoutingAndResize,
						500
					);
				}
			}
		},

		init: function init() {
			if ( RunCoCo.leaflet === undefined ) {
				return;
			}

			this.setGetDirections();
			this.addLeafletMap();
			this.addMapContainerListener();
		},

		invalidateSize: function invalidateSize() {
			this.map.invalidateSize({
				animate: true,
				pan: false
			});
		},

		mapComtainerTransitionHandler: function mapComtainerTransitionHandler( evt ) {
			if ( evt.target === evt.currentTarget ) {
				leaflet.addRoutingAndResize();
				leaflet.$map_container.off(
					'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd'
				);
			}
		},

		setGetDirections: function() {
			if ( $(window).width() > 768 && RunCoCo.leaflet.get_directions ) {
				this.get_directions = true;
				this.addGetDirections();
			}
		}
	};

	leaflet.init();

}( jQuery ));
