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
			add_marker_click_handler: false,
			add_marker_popup_handler: true,
			add_markers_as_cluster: false,
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
				maxZoom: 15,
				scrollWheelZoom: false,
				touchZoom: false,
				zoom: 8,
				zoomControl: true
			}
		},
		googleLayer: {},
		icon_blue: {},
		icon_green: {},
		icon_purple: {},
		icon_red: {},
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
		 *
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
		 * @returns {europeana.leaflet}
		 */
		addGoogleLayer: function() {
			this.googleLayer = new L.Google();
			this.map.addLayer( this.googleLayer );
			return this;
		},

		/**
		 * @param {bool} add_layer_toggle_ctrl
		 * @returns {europeana.leaflet}
		 */
		addLayerToggleCtrl: function( add_layer_toggle_ctrl ) {
			if ( !add_layer_toggle_ctrl ) {
				return this;
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
		 * @param {bool}   legend.display
		 * @param {string} legend.position
		 *
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
		 * @param {object} marker
		 * @param {function} fn
		 * @param {array} args
		 */
		addMarkerClickHandler: function( marker, fn, args ) {
			var
			self = this;

			marker.on( 'click', function( evt ) {
				args.push( evt );
				fn.apply( self, args );
			});
		},

		/**
		 * @param {object} marker
		 * @param {object} popup
		 * @param {string} popup.content
		 */
		addMarkerPopupHandler: function( marker, popup ) {
			if ( popup === undefined ) {
				return;
			}

			if ( popup.content !== undefined && popup.content.length > 1 ) {
				marker.bindPopup( popup.content );
			}
		},

		/**
		 * @param {object}  options
		 * @param {bool}    options.add_as_cluster
		 * @param {array}   options.markers
		 *
		 * @param {array}            options.markers[n].latlng
		 * @param {object|undefined} options.markers[n].popup
		 * @param {string|undefined} options.markers[n].popup.content
		 * @param {bool|undefined}   options.markers[n].popup.open
		 * @param {string}           options.markers[n].popup.type
		 *
		 * @returns {europeana.leaflet}
		 */
		addMarkers: function( options ) {
			if ( !$.isArray( options.markers ) || options.markers.length < 1 ) {
				return this;
			}

			var
			marker,
			marker_cluster = {},
			markers_past = [],
			markers_upcoming = [],
			self = this;

			if ( options.add_markers_as_cluster ) {
				marker_cluster = new L.MarkerClusterGroup();
			}

			$.each( options.markers, function() {
				if ( !self.latLngIsValid( this.latlng ) ) {
					return;
				}

				marker = L.marker(
					this.latlng,
					self.getMarkerIcon( this.type, options.add_markers_as_cluster )
				);

				if ( options.add_marker_popup_handler ) {
					self.addMarkerPopupHandler( marker, this.popup );
				}

				if ( $.isFunction( options.add_marker_click_handler ) ) {
					self.addMarkerClickHandler(
						marker,
						options.add_marker_click_handler,
						[this.url]
					);
				}

				if ( options.markers.length === 1 ) {
					marker.addTo( europeana.leaflet.map );

					if ( this.popup !== undefined && this.popup.open ) {
						marker.openPopup();
					}
				} else if ( options.add_markers_as_cluster ) {
					marker_cluster.addLayer( marker );
				} else if ( this.past ) {
					markers_past.push( marker );
				} else {
					markers_upcoming.push( marker );
				}
			});

			if ( options.add_markers_as_cluster ) {
				this.map.addLayer( marker_cluster );
			} else {
				if ( markers_past.length > 0 ) {
					this.past_collection_day_layer = L.layerGroup( markers_past );
					this.map.addLayer( this.past_collection_day_layer );
				}

				if ( markers_upcoming.length > 0 ) {
					this.upcoming_collection_day_layer = L.layerGroup( markers_upcoming );
					this.map.addLayer( this.upcoming_collection_day_layer );
				}
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
				maxZoom: map_options.maxZoom,
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

			return true;
		},

		/**
		 * @param {bool} add_markers_as_cluster
		 * @param {string} icon_type
		 * @returns {object}
		 */
		getMarkerIcon: function( icon_type, add_markers_as_cluster ) {
			var
			marker_icon = {};

			switch ( icon_type ) {
				case 'blue':
					marker_icon.icon = this.icon_blue;
					break;

				case 'green':
					marker_icon.icon = this.icon_green;
					break;

				case 'purple':
					marker_icon.icon = this.icon_purple;
					marker_icon.className = 'previous';

					if ( !add_markers_as_cluster ) {
						marker_icon.opacity = 0;
					}

					break;

				case 'red':
					marker_icon.icon = this.icon_red;
					marker_icon.className = 'previous';

					if ( !add_markers_as_cluster ) {
						marker_icon.opacity = 0;
					}

					break;

				default:
					marker_icon = {};
					break;
			}

			return marker_icon;
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
				.setImageIcons()
				.addMarkers( user_options )
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
		},

		/**
		 * @returns {europeana.leaflet}
		 */
		setImageIcons: function() {
			L.Icon.Default.imagePath = '/assets/leaflet/images/';
			this.icon_blue = L.icon({ iconUrl: '/assets/leaflet/images/marker-icon.png' });
			this.icon_green = L.icon({ iconUrl: '/assets/leaflet/images/marker-icon-green.png' });
			this.icon_purple = L.icon({ iconUrl: '/assets/leaflet/images/marker-icon-purple.png' });
			this.icon_red = L.icon({ iconUrl: '/assets/leaflet/images/marker-icon-red.png' });
			return this;
		}
	};

}( jQuery ));
