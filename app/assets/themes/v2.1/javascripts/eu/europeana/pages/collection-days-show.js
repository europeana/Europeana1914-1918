/*global europeana, I18n, jQuery, L, RunCoCo */
/*jslint browser: true, nomen: true, white: true */
(function( $ ) {

	'use strict';

	var
	mobile_context = false,

	leaflet = {

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
			map_config = {};

			map_config.markers = this.getMarkers();
			map_config.map_options = this.getMapOptions( map_config );

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
		 * @param {object} map_config
		 * @returns {object}
		 */
		getMapOptions: function( map_config ) {
			var
			map_options = {};

			if ( RunCoCo.leaflet.map_options !== undefined ) {
				map_options = RunCoCo.leaflet.map_options;
			}

			if ( !RunCoCo.collection_day_has_stories ) {
				map_options.zoomControl = false;
			} else {
				map_options.zoomControl = new L.Control.Zoom({
					position: 'bottomleft'
				});
			}

			return map_options;
		},

		/**
		 * @returns {array}
		 */
		getMarkers: function() {
			var
			result = [];

			if (
				RunCoCo.leaflet.markers !== undefined &&
				$.isArray( RunCoCo.leaflet.markers )
			) {
				result = RunCoCo.leaflet.markers;
			}

			return result;
		},

		/**
		 * @param {object} evt
		 * jQuery Event Object
		 */
		handleGetDirectionsClick: function handleGetDirectionsClick( evt ) {
			evt.preventDefault();

			if ( leaflet.$map_container.hasClass('expand') ) {
				leaflet.$map_container.removeClass('expand');
				leaflet.$get_directions.text( I18n.t( 'javascripts.collection-days.get-directions' ) );
				$('#collection-day-metadata').css('float', 'right');

				if ( leaflet.routing_ctrl !== undefined ) {
					leaflet.$routing_ctrl.fadeOut();
				}
			} else {
				leaflet.$map_container.addClass('expand');
				leaflet.$get_directions.text( I18n.t( 'javascripts.collection-days.close-directions' ) );
				$('#collection-day-metadata').css('float', 'none');

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

	// http://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-handheld-device-in-jquery#answer-3540295
	if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent ) ) {
		mobile_context = true;
	}

	europeana.chosen.init();
	leaflet.init();

}( jQuery ));
