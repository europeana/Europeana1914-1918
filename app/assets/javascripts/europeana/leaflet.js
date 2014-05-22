(function() {

	'use strict';

	if ( !window.europeana ) {
		window.europeana = {};
	}


	europeana.leaflet = {

		$europeanaCtrls: $('<div>').attr('id', 'europeana-ctrls'),
		googleLayer: {},
		map: {},
		mapLatitude: 0,
		mapLongitude: 0,
		mapQuestAtribution:
			'Tiles © ' +
			'<a href="http://www.mapquest.com/" target="_blank">MapQuest</a> ' +
			'<img src="http://developer.mapquest.com/content/osm/mq_logo.png" />',
		mapQuestLayer: {},
		mapZoom: 8,
		miniMap: {},
		miniMapLayer: {},


		addEuropeanaCtrls: function() {
			this.$europeanaCtrls.prependTo('#map-container');
			this.$europeanaCtrls.append(
				new europeana.leaflet.EuropeanaLayerControl(
					this.map,
        	[
        		{
        			"title":	I18n.t('javascripts.leaflet.label.map_view'),
        			"layer":	this.mapQuestLayer
        		},
						{
							"title":	I18n.t('javascripts.leaflet.label.satellite_view'),
							"layer":	this.googleLayer
						}
					]
        ).getCmp()
			);
		},

		addGoogleLayer: function() {
			this.googleLayer = new L.Google();
			this.map.addLayer( this.googleLayer );
		},

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
			).addTo( this.map );
		},

		addMarker: function() {
			L.Icon.Default.imagePath = '/assets/leaflet/images/';
			L.marker( [this.mapLatitude, this.mapLongitude] ).addTo( this.map );
		},

		addMiniMap: function() {
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

			this.miniMap = new L.Control.MiniMap(
				this.miniMapLayer,
				{
					toggleDisplay: true
				}
			).addTo( this.map );
		},

		addZoomControl: function() {
			L.control.zoom().addTo( this.map );
		},

		init: function(){
			if ( !this.latLangIsValid() ) {
				return;
			}

			this.setMapZoom();
			this.setMap();
			this.addMarker();
			this.addZoomControl();
			this.addMapQuestLayer();
			this.addGoogleLayer();
			this.addMiniMap();
			this.addEuropeanaCtrls();
		},

		/**
		 * @returns {bool}
		 */
		latLangIsValid: function() {
			if (
				!$.isArray( RunCoCo.latLong )
				|| RunCoCo.latLong.length !== 2
			) {
				return false;
			}

			// this test could happen on the back end too
			var regex = /^\s*-?\d+\.\d+\,\s?-?\d+\.\d+\s*$/;

			if ( !RunCoCo.latLong.join(',').match( regex ) ) {
				return false;
			}

			this.setLatLong();

			return true;
		},

		setLatLong: function() {
			this.mapLatitude = parseFloat( RunCoCo.latLong[0] );
			this.mapLongitude = parseFloat( RunCoCo.latLong[1] );
		},

		setMap: function() {
			this.map = L.map(
				'map',
				{
					center: new L.LatLng( this.mapLatitude, this.mapLongitude ),
					zoomControl: false,
					zoom: this.mapZoom
				}
			);
		},

		setMapZoom: function() {
			if (
				window.mapZoom !== undefined
				&& window.mapZoom.length !== undefined )
			{
				parseInt( window.mapZoom, 10 );
			}
		},

		EuropeanaLayerControl: function( map, ops ) {
			var
			html	= '',
			layers	= [],
			self = this;

			self.ops = ops;
			self.map = map;
			self.grp = null;

			self._setLayer = function(index){
				var layer = self.ops[index].layer;
				self.grp.clearLayers();
				self.grp.addLayer(layer);

				$(self.cmp.find("span")).removeClass('active');
				$(self.cmp.find("span").get(index)).addClass('active');
			};

			$.each( self.ops, function( i, ob ) {
				html += '<a href="#' + ob.title + '"><span class="' + i + '">' + ob.title + '</span></a>';
				layers[layers.length] = ob.layer;
			});

			self.cmp = $('<div>').attr('id', 'layer-ctrl').html( html );

			self.cmp.find("span").each(function(){
				$(this).click( function() {
					self._setLayer( parseInt( jQuery(this).attr('class'), 10 ) );
				});
			});

			self.grp = L.layerGroup(layers);
			self.grp.addTo(self.map);
			self._setLayer(0);

			return {
				getCmp : function() {
					return self.cmp;
				}
			};
		}

	};

}());
