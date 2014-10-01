/*global europeana, I18n, jQuery, L, RunCoCo */
/*jslint browser: true, nomen: true, white: true */
(function( $ ) {

	'use strict';

	var
	leaflet = {

		map: {},
		$map_container: $('#map-container'),
		routing_ctrl: undefined,

		addLeafletMap: function() {
			var
			map_config = {};

			map_config.markers = this.getMarkers();
			map_config.map_options = this.getMapOptions();

			this.map = europeana.leaflet.init( map_config );
		},

		addMapContainerListener: function addMapContainerListener() {
			this.$map_container.on(
				'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',
				this.mapComtainerTransitionHandler
			);
		},

		/**
		 * @param {object} map_config
		 * @returns {object}
		 */
		getMapOptions: function() {
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

			map_options.dragging = false;

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

		init: function init() {
			if ( RunCoCo.leaflet === undefined ) {
				return;
			}

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
				leaflet.invalidateSize();
				leaflet.$map_container.off(
					'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd'
				);
			}
		}
	},

	directions = {

		check_geolocation: {
			active: false,
			count: 0,
			limit: 100 // assuming getCurrentPosition timeout is 3 milliseconds
		},
		geolocation_available: false,
		$get_directions: $( '#get-directions' ),

		addGetDirectionsListener: function() {
			if ( !RunCoCo.get_directions ) {
				return;
			}

			this.$get_directions.on( 'click', { self: this }, this.handleGetDirectionsClick );
		},

		/**
		 * @see http://dev.w3.org/geo/api/spec-source.html#get-current-position
		 * @see http://dev.w3.org/geo/api/spec-source.html#position-options
		 */
		getGeolocation: function() {
			var
			self = this;

			this.check_geolocation.count += 1;

			// the success and failure callbacks return window as the this object
			// so set it to this object instead
			navigator.geolocation.getCurrentPosition(
				function() { self.handleGeolocationSuccess.apply( self, arguments ); },
				function() { self.handleGeolocationError.apply( self, arguments ); },
				{
					enableHighAccuracy: true,
					maximumAge: 0
				}
			);
		},

		/**
		 * @param {object} evt
		 * jQuery Event object
		 */
		handleGetDirectionsClick: function( evt ) {
			var
			self = evt.data.self;

			if ( self.geolocation_available ) {
				evt.preventDefault();

				// prevent multiple clicks on get directions
				if ( !self.check_geolocation.active ) {
					self.check_geolocation.active = true;
					self.getGeolocation();
				}
			}
		},

		/**
		 * handle the following scenarios:
		 *
		 * - user permission denied to access geolocation
		 *   will redirect to google maps without a start destination
		 *
		 * - geolocation unavailable
		 *   will attempt this.check_geolocation.limit times to obtain the geolocation
		 *
		 * @see http://dev.w3.org/geo/api/spec-source.html#position-error
		 *
		 * @param {object} position_error
		 * @param {int} position_error.PERMISSION_DENIED = 1
		 * @param {int} position_error.POSITION_UNAVAILABLE = 2
		 */
		handleGeolocationError: function( position_error ) {
			var
			redirect = false;

			if ( position_error.PERMISSION_DENIED === 1 ) {
				redirect = true;
			} else if (
				position_error.POSITION_UNAVAILABLE === 2 &&
				this.check_geolocation.count >= this.check_geolocation.limit
			) {
				redirect = true;
			}

			if ( redirect ) {
				window.location.href = this.$get_directions.attr( 'href' );
			} else {
				this.getGeolocation();
			}
		},

		/**
		 * add current geolocation coordinates as a start destination
		 * to the get directions link
		 *
		 * @see http://dev.w3.org/geo/api/spec-source.html#coordinates
		 *
		 * @param {object} position
		 * @param {float} position.coords.latitude
		 * @param {float} position.coords.longitude
		 */
		handleGeolocationSuccess: function( position ) {
			var
			lat = parseFloat( position.coords.latitude ),
			lng = parseFloat( position.coords.longitude ),
			href = this.$get_directions.attr( 'href' ) + '&saddr=' + lat + ',' + lng;

			window.location.href = href;
		},

		init: function() {
			this.setGeolocationAvailable();
			this.addGetDirectionsListener();
		},

		setGeolocationAvailable: function() {
			if (
				navigator !== undefined &&
				navigator.geolocation !== undefined &&
				$.isFunction( navigator.geolocation.getCurrentPosition )
			) {
				this.geolocation_available = true;
			}
		}
	};

	europeana.chosen.init();
	leaflet.init();
	directions.init();

}( jQuery ));
