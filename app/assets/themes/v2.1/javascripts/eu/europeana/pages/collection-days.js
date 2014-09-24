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

			if ( mobile_context ) {
				map_config.add_marker_popup_handler = false;
				map_config.add_marker_click_handler = this.redirectToCollectionDay;
			} else {
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

		/**
		 * intercepts popup content <a> tags so that user feedback can be provided
		 * when the <a> tag is clicked
		 */
		addPopupIntercept: function() {
			$('#map-container').on(
				'click',
				'.leaflet-popup-content a',
				{ self: this },
				this.handlePopUpLinkClick
			);
		},

		/**
		 * @param {Event} evt
		 * jQuery Event
		 */
		handlePopUpLinkClick: function( evt ) {
			evt.preventDefault();
			evt.data.self.redirectToCollectionDay( $(this).attr('href') );
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

			if ( mobile_context ) {
				if (
					map_config.markers !== undefined &&
					map_config.markers.length > 0
				) {
					map_options.center = map_config.markers[0].latlng;
				}

				if ( map_config.markers.length === 1 ) {
					map_options.zoom = 11;
				}
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
				result = $.merge( $.merge( [], markers_upcoming ), markers_past );
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
				if (
					RunCoCo.leaflet.upcoming &&
					RunCoCo.leaflet.upcoming.length < 1
				) {
					$('#map-container')
						.hide()
						.after(
							$('<p>')
								.text( I18n.t( 'javascripts.collection-days.no-upcoming' ) )
						);
				} else {
					this.addLeafletMap();
				}
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

			this.addPopupIntercept();
		},

		/**
		 * clears content, adds the animated loading gif as a visual cue,
		 * and then reidrects to the url path given
		 *
		 * @param {string} url_path
		 */
		redirectToCollectionDay: function( url_path ) {
			$('#footer')
				.slideUp()
				.html('');

			$('#content')
				.slideUp( function() {
					$(this)
						.html('<div class="loading-feedback"></div>')
						.slideDown();

					// give a beat so that animation is seen
					setTimeout(
						function() {
							window.location.href =
								window.location.protocol + "//" +
								window.location.host + "/" +
								url_path;
						},
						200
					);
				});
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

	// http://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-handheld-device-in-jquery#answer-3540295
	if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent ) ) {
		mobile_context = true;
	}

	europeana.chosen.init();
	leaflet.init();

}( jQuery ));
