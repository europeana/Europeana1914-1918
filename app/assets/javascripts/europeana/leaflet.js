/*global europeana, I18n, jQuery, L, RunCoCo */
/*jslint browser: true, nomen: true, white: true */
(function( $ ) {

	'use strict';

	if ( !window.europeana ) {
		window.europeana = {};
	}


	europeana.leaflet = {

		default_options: {
			add_layer_toggle_ctrl: false,
			add_minimap: false,
			add_routing: false,
			banner: {
				content: '',
				display: false,
				position: 'topright'
			},
			legend: {
				content: '',
				display: false,
				position: 'topright'
			},
			markers: [],
			map_options: {
				id: 'map',
				center: [0,0],
				doubleClickZoom: false,
				scrollWheelZoom: false,
				touchZoom: false,
				zoom: 8,
				zoomControl: true
			}
		},
		googleLayer: {},
		map: {},
		mapQuestAttribution:
			'Tiles © ' +
			'<a href="http://www.mapquest.com/" target="_blank">MapQuest</a> ' +
			'<img src="http://developer.mapquest.com/content/osm/mq_logo.png" />',
		mapQuestLayer: {},
		miniMap: {},
		miniMapLayer: {},
		past_collection_day_layer: {},
		upcoming_collection_day_layer: {},


		/**
		 *
		 * @param {object} banner
		 * @param {string} banner.content
		 * @param {bool} banner.display
		 * @param {string} banner.position
		 * @returns {europeana.leaflet}
		 */
		addBanner: function( banner ) {
			if ( !banner.display || banner.content.length < 1 ) {
				return this;
			}

			var banner_ctrl = L.control({ position: banner.position });

			banner_ctrl.onAdd = function (map) {
				var div = L.DomUtil.create('div', 'banner');
				div.innerHTML = banner.content;
				return div;
			};

			banner_ctrl.addTo( this.map );
			return this;
		},

		/**
		 *
		 * @returns {europeana.leaflet}
		 */
		addGoogleLayer: function() {
			this.googleLayer = new L.Google();
			this.map.addLayer( this.googleLayer );
			return this;
		},

		/**
		 *
		 * @param {bool} add_layer_toggle_ctrl
		 * @returns {europeana.leaflet}
		 */
		addLayerToggleCtrl: function( add_layer_toggle_ctrl ) {
			if ( !add_layer_toggle_ctrl ) {
				return;
			}

			this.addGoogleLayer();

			this.map.addControl(
				new L.Control.LayerToggle({
					buttons: [
						{
							active: true,
							title: I18n.t('javascripts.leaflet.label.map_view'),
							layer: this.mapQuestLayer
						},
						{
							title: I18n.t('javascripts.leaflet.label.satellite_view'),
							layer: this.googleLayer
						}
					]
				})
			);

			return this;
		},

		/**
		 *
		 * @param {object} legend
		 * @param {string} legend.content
		 * @param {bool} legend.display
		 * @param {string} legend.position
		 * @returns {europeana.leaflet}
		 */
		addLegend: function( legend ) {
			if ( !legend.display ) {
				return this;
			}

			var legend_ctrl = L.control({ position: legend.position });

			legend_ctrl.onAdd = function (map) {
				var div = L.DomUtil.create('div', 'legend');
				div.innerHTML = legend.content;
				return div;
			};

			legend_ctrl.addTo( this.map );
			return this;
		},

		/**
		 * - creates the layer
		 * - stores the layer for use by map controls in this.mapQuestLayer
		 * - adds the layer to this.map
		 *
		 * @returns {europeana.leaflet}
		 */
		addMapQuestLayer: function() {
			this.mapQuestLayer = new L.TileLayer(
				'http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.png',
				{
					minZoom: 4,
					maxZoom: 18,
					attribution: this.mapQuestAttribution,
					subdomains: '1234',
					type: 'osm'
				}
			);

			this.mapQuestLayer.addTo( this.map );
			return this;
		},

		/**
		 * @param {array} markers
		 * @param {object} markers[n]
		 * @param {array} markers[n].latlng
		 * @param {object|undefined} markers[n].popup
		 * @param {bool|undefined} markers[n].popup.open
		 * @param {string} markers[n].popup.type
		 * @param {string|undefined} markers[n].popup.content
		 */
		addMarkers: function( markers ) {
			if ( !$.isArray( markers ) || markers.length < 1 ) {
				return this;
			}

			var
			marker,
			marker_icon = {},
			markers_past = [],
			markers_upcoming = [],
			blueIcon = L.icon({
				iconUrl: '/assets/leaflet/images/marker-icon.png'
			}),
			greenIcon = L.icon({
				iconUrl: '/assets/leaflet/images/marker-icon-green.png'
			}),
			purpleIcon = L.icon({
				iconUrl: '/assets/leaflet/images/marker-icon-purple.png'
			}),
			redIcon = L.icon({
				iconUrl: '/assets/leaflet/images/marker-icon-red.png'
			});

			L.Icon.Default.imagePath = '/assets/leaflet/images/';

			$.each( markers, function() {
				if ( !europeana.leaflet.latLngIsValid( this.latlng ) ) {
					return;
				}

				switch ( this.type ) {
					case 'blue':
						marker_icon = { icon: blueIcon };
						break;

					case 'green':
						marker_icon = { icon: greenIcon };
						break;

					case 'purple':
						marker_icon = { icon: purpleIcon, opacity: 0 };
						break;

					case 'red':
						marker_icon = { icon: redIcon, opacity: 0 };
						break;

					default:
						marker_icon = {};
						break;
				}

				marker = L.marker( this.latlng, marker_icon );

				if ( this.popup !== undefined ) {
					if ( this.popup.content !== undefined ) {
						marker.bindPopup( this.popup.content );
					}
				}

				if ( markers.length === 1 ) {
					marker.addTo( europeana.leaflet.map );

					if ( this.popup !== undefined && this.popup.open ) {
						marker.openPopup();
					}
				} else if ( this.past ) {
					markers_past.push( marker );
				} else {
					markers_upcoming.push( marker );
				}
			});

			if ( markers_past.length > 0 ) {
				this.past_collection_day_layer = L.layerGroup( markers_past );
				this.map.addLayer( this.past_collection_day_layer );
			}

			if ( markers_upcoming.length > 0 ) {
				this.upcoming_collection_day_layer = L.layerGroup( markers_upcoming );
				this.map.addLayer( this.upcoming_collection_day_layer );
			}

			return this;
		},

		/**
		 * - creates the layer
		 * - stores the layer for use by map controls in this.miniMapLayer
		 * - adds the layer to this.map
		 *
		 * @param {bool} add_minimap
		 * @returns {europeana.leaflet}
		 */
		addMiniMap: function( add_minimap ) {
			if ( !add_minimap ) {
				return this;
			}

			this.miniMapLayer = new L.TileLayer(
				'http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.png',
				{
					minZoom: 0,
					maxZoom: 13,
					attribution: this.mqTilesAttr,
					subdomains: '1234',
					type: 'osm'
				}
			);

			// note: altered the options for the minimap so that
			// scrollWheelZoom and doubleClickZoom are set independantly of zoomLevelFixed
			// so that it creates a zoomLevel on the minimap, but allows control of
			// whether or not it’s zoomable with the scroll wheel, doubleclick or touch zoom
			this.miniMap = new L.Control.MiniMap(
				this.miniMapLayer,
				{
					toggleDisplay: true
				}
			);

			this.miniMap.addTo( this.map );
			return this;
		},

		addRouting: function() {
			L.Routing.control({
				waypoints: [
					L.latLng(48.8588,2.3469),
					L.latLng(52.3546,4.9039)
				]
			}).addTo( this.map );
		},

		/**
		 * add a custom Zoom Control after the map has been created
		 *
		 * @param {L.Control.Zoom} zoomControl
		 * @returns {europeana.leaflet}
		 */
		addZoomControl: function( zoomControl ) {
			if ( zoomControl instanceof L.Control.Zoom ) {
				zoomControl.addTo( this.map );
			}

			return this;
		},

		/**
		 *
		 * @param {string} id
		 * @param {object} map_options
		 * @returns {europeana.leaflet}
		 */
		createMap: function( id, map_options ) {
			this.map = L.map( id, map_options );
			return this;
		},

		/**
		 *
		 * @param {array} center
		 * e.g., [51.5085159,-0.12548849999996037]
		 *
		 * @returns {L.LatLng}
		 */
		getMapCentre: function( center ) {
			if ( !this.latLngIsValid( center ) ) {
				center = this.default_options.map_options.center;
			}

			return new L.LatLng(
				parseFloat( center[0] ),
				parseFloat( center[1] )
			);
		},

		/**
		 *
		 * @param {string} id
		 * @returns {string}
		 */
		getMapId: function( id ) {
			return id || this.default_options.map_options.id;
		},

		/**
		 *
		 * @param {object} map_options
		 * @returns {object}
		 */
		getMapOptions: function( map_options ) {
			return {
				center: this.getMapCentre( map_options.center ),
				doubleClickZoom: map_options.doubleClickZoom,
				scrollWheelZoom: map_options.scrollWheelZoom,
				touchZoom: map_options.touchZoom,
				zoom: this.getMapZoom( map_options.zoom ),
				zoomControl: this.getMapZoomControl( map_options.zoomControl )
			};
		},

		/**
		 *
		 * @param {int} zoom
		 * @returns {int}
		 */
		getMapZoom: function( zoom ) {
			if ( zoom === undefined ) {
				zoom = this.default_options.map_options.zoom;
			}

			zoom = parseInt( zoom, 10 );

			if ( !$.isNumeric( zoom ) ) {
				zoom = this.default_options.map_options.zoom;
			}

			return zoom;
		},

		/**
		 * whether or not to display the default map Zoom Control
		 *
		 * @param {bool|L.Control.Zoom} zoomControl
		 * @returns {bool}
		 */
		getMapZoomControl: function( zoomControl ) {
			if ( zoomControl !== undefined && zoomControl.constructor === Boolean ) {
				return zoomControl;
			}

			if ( zoomControl instanceof L.Control.Zoom ) {
				return false;
			}
		},

		/**
		 * @param {object} user_options
		 */
		init: function( user_options ) {
			user_options = $.extend(
				true,
				{},
				this.default_options,
				user_options
			);

			this
				.createMap(
					this.getMapId( user_options.map_options.id ),
					this.getMapOptions( user_options.map_options )
				)
				.addMarkers( user_options.markers )
				.addMapQuestLayer()
				.addZoomControl( user_options.map_options.zoomControl )
				.addMiniMap( user_options.add_minimap )
				.addBanner( user_options.banner )
				.addLegend( user_options.legend )
				.addLayerToggleCtrl( user_options.add_layer_toggle_ctrl );

			return this.map;
		},

		/**
		 * @param {array} latlng
		 * e.g., [51.5085159,-0.12548849999996037]
		 *
		 * @returns {bool}
		 */
		latLngIsValid: function( latlng ) {
			if ( !$.isArray( latlng ) || latlng.length !== 2 ) {
				return false;
			}

			var regex = /^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$/;

			if ( !latlng.join(',').match( regex ) ) {
				return false;
			}

			return true;
		}
	};

}( jQuery ));
