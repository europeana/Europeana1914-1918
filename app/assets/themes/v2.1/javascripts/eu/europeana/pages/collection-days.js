/*global europeana, I18n, jQuery, L, RunCoCo */
/*jslint browser: true, nomen: true, white: true */
(function( $ ) {

	'use strict';

	var
	mobile_context = false,

	leaflet = {
		add_markers_as_cluster: true,
		banner_content: '',
		legend_content: '',
		$toggle_previous: {},


		addLeafletMap: function() {
			var
			map_config = {};

			map_config.markers = this.getMarkers();
			map_config.map_options = this.getMapOptions( map_config );
			map_config.add_markers_as_cluster = this.add_markers_as_cluster;

			if ( !mobile_context ) {
				map_config.banner = {
					display: true,
					content: this.banner_content
				};

				map_config.legend = {
					display: true,
					content: this.legend_content
				};
			}

			europeana.leaflet.init( map_config );
		},

		addPreviousToggleListener: function() {
			this.$toggle_previous = $('#toggle-previous');
			this.$toggle_previous.on('click', this.handlePreviousToggle );
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

			if (
				mobile_context &&
				map_config.markers !== undefined &&
				map_config.markers.length > 0
			) {
				map_options.center = map_config.markers[0].latlng;
			}

			map_options.zoomControl = new L.Control.Zoom({
				position: 'bottomleft'
			});

			return map_options;
		},

		/**
		 * @returns {array}
		 */
		getMarkers: function() {
			var
			result = [],
			markers_past = [],
			markers_upcoming = [];

			if (
				RunCoCo.leaflet.markers_upcoming !== undefined &&
				$.isArray( RunCoCo.leaflet.markers_upcoming )
			) {
				markers_upcoming = RunCoCo.leaflet.markers_upcoming;
			}

			if (
				RunCoCo.leaflet.markers_past !== undefined &&
				$.isArray( RunCoCo.leaflet.markers_past )
			) {
				markers_past = RunCoCo.leaflet.markers_past;
			}

			if ( mobile_context ) {
				result = markers_upcoming;
			} else {
				result = $.merge( markers_upcoming, markers_past );
			}

			return result;
		},

		handlePreviousToggle: function() {
			if ( europeana.leaflet.past_collection_day_layer._layers === undefined ) {
				return;
			}

			if ( $(this).attr('checked') ) {
				$.cookie('show-previous', true, { path: '/' });
			} else {
				$.cookie('show-previous', false, { path: '/' });
			}

			$.each( europeana.leaflet.past_collection_day_layer._layers, function() {
				$(this._icon).fadeToggle();
			});
		},

		hideLeafletMap: function() {
			$('#map-container').hide();
		},

		init: function() {
			if ( RunCoCo.leaflet === undefined ) {
				this.hideLeafletMap();
				return;
			}

			if ( mobile_context ) {
				//this.hideLeafletMap();
				//
				//if ( RunCoCo.leaflet.upcoming && RunCoCo.leaflet.upcoming.length > 0 ) {
				//	this.redirectToCollectionDay( RunCoCo.leaflet.upcoming[0].code );
				//} else {
				//	$('#collection-day-selector-label').text(
				//		I18n.t( 'javascripts.collection-days.no-upcoming' )
				//	);
				//}
				//
				//return;
				this.addLeafletMap();
			} else {
				this.setLegendContent();
				this.setBannerContent();
				this.addLeafletMap();

				if ( !this.add_markers_as_cluster ) {
					this.removePreviousMarkersOpacity();
					this.addPreviousToggleListener();
					this.setPreviousCheckboxState();
				}
			}
		},

		/**
		 * @param {string} collection_day_code
		 */
		redirectToCollectionDay: function( collection_day_code ) {
			$('#content, #footer').hide();

			window.location.href =
				window.location.protocol + "//" +
				window.location.host + "/" +
				'collection-days/' +
				collection_day_code;
		},

		removePreviousMarkersOpacity: function() {
			if ( europeana.leaflet.past_collection_day_layer._layers === undefined ) {
				return;
			}

			$.each( europeana.leaflet.past_collection_day_layer._layers, function() {
				if ( $.cookie('show-previous') === 'true' ) {
					$(this._icon).css({'opacity':''});
				} else {
					$(this._icon).css({'display':'none','opacity':''});
				}
			});
		},

		setBannerContent: function() {
			if (
				!$.isArray( RunCoCo.leaflet.upcoming ) ||
				RunCoCo.leaflet.upcoming.length < 1
			) {
				return;
			}

			var
			upcoming_day = RunCoCo.leaflet.upcoming[0],
			upcoming_values = {
				"name": upcoming_day.name || '',
				"city": upcoming_day.city || '',
				"country": upcoming_day.country || '',
				"start-date": upcoming_day.date || ''
			};

			this.banner_content =
				I18n.t(
					'javascripts.collection-days.next-collection-day',
					upcoming_values
				) +
				' ' +
				'<a href="collection-days/' + RunCoCo.leaflet.upcoming[0].code + '">' +
					I18n.t( 'javascripts.collection-days.find-more' ) +
				'</a>';
		},

		setLegendContent: function() {
			this.legend_content =
				'<h2>' + I18n.t( 'javascripts.collection-days.legend' ) + '</h2>' +
				'<div class="marker-icon marker-icon-blue">' + I18n.t( 'javascripts.collection-days.upcoming' ) + '</div>' +
				'<div class="marker-icon marker-icon-red">' + I18n.t( 'javascripts.collection-days.past-entered' ) + '</div>' +
				'<div class="marker-icon marker-icon-purple">' + I18n.t( 'javascripts.collection-days.past-not-entered' ) + '</div>';

			if ( !this.add_markers_as_cluster ) {
				this.legend_content += '<label><input type="checkbox" id="toggle-previous" /> ' + I18n.t( 'javascripts.collection-days.show-past' ) + '</label>';
			}

			this.legend_content += '<a href="#what-is-it">' + I18n.t( 'javascripts.collection-days.what-is-it' ) + '</a>';
		},

		setPreviousCheckboxState: function() {
			if ( $.cookie('show-previous') === 'true' ) {
				this.$toggle_previous.attr('checked', 'checked');
			}
		}
	};

	if ( ( $(window).width() <= 768 || $(window).height() <= 500 ) ) {
		mobile_context = true;
	}

	europeana.chosen.init();
	leaflet.init();

}( jQuery ));
