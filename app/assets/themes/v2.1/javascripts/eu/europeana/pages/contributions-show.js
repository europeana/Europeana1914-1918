/*global anno, I18n, europeana, jQuery, mejs, RunCoCo */
/*jslint browser: true, white: true */
(function( $ ) {

	'use strict';

	var
	pdf_viewer = true,
	add_lightbox = true,
	carousel = europeana.carousel,


	leaflet = {
		addLeafletMap: function() {
			var
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

			europeana.leaflet.init({
				add_layer_toggle_ctrl: true,
				add_minimap: true,
				map_options: map_options,
				markers: markers
			});
		},

		init: function() {
			if ( RunCoCo.leaflet === undefined ) {
				return;
			}

			this.addLeafletMap();
		}
	},


	more_like_this = {
		$carousel: {},
		node_id: '',

		init: function( node_id ) {
			var self = this;

			this.node_id = node_id;

			$('#' + this.node_id).imagesLoaded( function() {
				self.$carousel =
					$('#' + self.node_id).rCarousel({
						item_width_is_container_width : false,
						listen_to_arrow_keys: false,
						nav_next : {
							'type' : 'image',
							'class' : 'medium',
							'alt' : 'next',
							'src' : '/assets/jquery/plugins/rcarousel/images/carousel-arrow-right.png',
							'style' : 'display: none;',
							'data-dir' : 'next'
						},
						nav_prev : {
							'type' : 'image',
							'class' : 'medium',
							'alt' : 'previous',
							'src' : '/assets/jquery/plugins/rcarousel/images/carousel-arrow-left.png',
							'style' : 'display: none;',
							'data-dir' : 'prev'
						}
					}).data('rCarousel');
			});
		}
	},


	pdf = {
		handleClick : function() {
			var
			$elm = $(this),
			destination_url =
				'/contributions/' +
				$elm.data('contribution-id') +
				'/attachments/' +
				$elm.data('attachment-id') +
				'?layout=0';

			$elm.attr( 'href', destination_url );
		},

		init : function () {
			if ( !pdf_viewer ) {
				return;
			}

			$('#contributions-featured').on( 'click', '.pdf', pdf.handleClick );
		}
	},


	// http://localhost:3000/en/contributions/1#prettyPhoto[gallery]/3/
	photoGallery = {
		items_per_page: 1,

		checkHash: function() {
			var
			hash = window.location.hash.substring(1),
			requested_index = 0,
			requested_item = 1,
			total_items = parseInt( $('#pagination-total').text(), 10 );

			if ( hash.indexOf('/') < 0 ) {
				return;
			}

			hash = hash.split('/');

			if ( hash.length !== 3 ) {
				return;
			}

			requested_index = parseInt( hash[1], 10 );
			requested_item = requested_index + 1;
			//requested_page = Math.ceil( requested_item / this.items_per_page );

			if (
				requested_item < 1 ||
				requested_item > total_items
			) {
				return;
			}

			carousel.photogallery_hash_check = true;
			carousel.replaceItemPlaceholderCheck( requested_index );
		},

		init: function() {
			if ( carousel.$featured_carousel !== null ) {
				photoGallery.checkHash();
				carousel.$featured_carousel.hideOverlay();
			} else {
				setTimeout(
					photoGallery.init,
					100
				);
			}
		}
	};

	if (
		( $(window).width() <= 768 || $(window).height() <= 500 ) &&
		!( /iPad/.test( navigator.platform ) ) &&
		navigator.userAgent.indexOf( "AppleWebKit" ) > -1
	) {
		pdf_viewer = add_lightbox = false;
	}

	RunCoCo.translation_services.init( $('.translate-area') );
	europeana.embedly.init();
	europeana.carousel.init( $('#contributions-featured'), function() {
		europeana.lightbox.init({
			$elm: $('#contributions-featured'),
			add_embedly: RunCoCo.lightbox.add_embedly,
			add_lightbox: add_lightbox,
			add_metadata: RunCoCo.lightbox.add_metadata,
			add_sharethis: RunCoCo.lightbox.add_sharethis,
			carousel: europeana.carousel,
			contribution_page: true
		});
	});
	more_like_this.init('more-like-this');
	pdf.init();
	photoGallery.init();
	leaflet.init();

}( jQuery ));
