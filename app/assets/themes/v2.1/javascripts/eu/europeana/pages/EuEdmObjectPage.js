/*global anno, europeana, I18n, jQuery, L, RunCoCo */
/*jslint browser: true, white: true */
(function( $ ) {

	'use strict';

	var
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


	/**
	 * this iterates over the items in the featured carousel and tests the
	 * <a> data-record attribute if it exists in order to make sure pdf links
	 * take the user to the pdf viewer page
	 */
	mimetype = {
		carousel_reveal_count: 0,
		carousel_reveal_max_count: 100,
		carousel_reveal_wait: 100,
		$items: $('#institution-featured a'),
		itemsHandled: 0,
		itemsTotal: 0,

		ajax: {
			/**
			 * retrieve the HTTP headers of a given URL
			 * when proveded by the $elm’s data-record attribute
			 *
			 * @param {object} $elm
			 */
			get: function( $elm ) {
				if ( $elm.attr('data-record') === undefined ) {
					mimetype.incrementItemsHandled();
					return;
				}

				$.ajax({
					complete: mimetype.incrementItemsHandled,
					error: function() {
						$elm.find( 'img' ).attr( 'src', $elm.attr( 'data-edmpreview' ) );
						$elm.parent().removeClass( 'item-placeholder' );
						mimetype.removeLightbox( $elm );
					},
					success: function( data ) {
						if (
							data['content-type'] &&
							data['content-type'][0]
						) {
							if ( data['content-type'][0].indexOf( 'text/html' ) !== -1 ) {
								mimetype.removeLightbox( $elm );
							} else if (
								data['content-type'][0] === 'application/pdf' ||
								data['content-type'][0] === 'pdf'
							) {
								mimetype.replaceWithPdfLink( $elm );
							}
						}
					},
					timeout: 5000,
					type: 'GET',
					url: $elm.attr('data-record') + '/headers.json'
				});
			}
		},

		incrementItemsHandled: function() {
			mimetype.itemsHandled += 1;

			if ( mimetype.itemsHandled === mimetype.itemsTotal ) {
				europeana.lightbox.init({
					add_embedly: RunCoCo.lightbox.add_embedly,
					add_lightbox: add_lightbox,
					add_metadata: RunCoCo.lightbox.add_metadata,
					add_sharethis: RunCoCo.lightbox.add_sharethis,
					carousel: europeana.carousel,
					$elm: $('#institution-featured'),
					edm_page: true
				});
				mimetype.revealCarousel();
			} else if ( mimetype.itemsHandled === 1 ) {
				mimetype.ajax.get( mimetype.$items.eq( mimetype.itemsHandled ) );
			} else {
				mimetype.ajax.get( mimetype.$items.eq( mimetype.itemsHandled ) );
			}
		},

		init: function() {
			mimetype.itemsTotal = mimetype.$items.length;

			if ( mimetype.itemsTotal < 1 ) {
				mimetype.revealCarousel();
				return;
			}

			mimetype.ajax.get( mimetype.$items.eq( mimetype.itemsHandled ) );
		},

		removeLightbox: function( $elm ) {
			var img = $elm.find('img').clone(),
			$parent = $elm.parent();
			$elm.remove();
			$parent.append( img );
		},

		replaceWithPdfLink: function( $elm ) {
			$elm
				.removeAttr( 'rel' )
				.attr( 'href', $elm.attr( 'data-record' ) + '?edmpdf=true' )
				.attr( 'target', '_blank' );
		},

		revealCarousel: function() {
			if ( carousel.$featured_carousel !== null ) {
				carousel.$featured_carousel.hideOverlay();
			} else {
				mimetype.carousel_reveal_count += 1;

				if ( mimetype.carousel_reveal_count >= mimetype.carousel_reveal_max_count ) {
					return;
				}

				setTimeout(
					function() {
						mimetype.revealCarousel();
					},
					mimetype.carousel_reveal_wait
				);
			}
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
						nav_next: {
							'type' : 'image',
							'class' : 'medium',
							'alt' : 'next',
							'src' : '/assets/jquery/plugins/rcarousel/images/carousel-arrow-right.png',
							'style' : 'display: none;',
							'data-dir' : 'next'
						},
						nav_prev: {
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
			} else {
				setTimeout(
					photoGallery.init,
					100
				);
			}
		}
	},


	truncate = {
		init : function() {
			if ( jQuery('#avatar').length < 1 ) {
				return;
			}

			jQuery('#story-metadata').truncate({
				limit : { pixels : 400 },
				toggle_html : {
					more : I18n.t('javascripts.truncate.show-more'),
					less : I18n.t('javascripts.truncate.show-less')
				}
			});
		}
	};


	if (
		( $(window).width() <= 768 || $(window).height() <= 500 ) &&
		!( /iPad/.test( navigator.platform ) ) &&
		navigator.userAgent.indexOf( "AppleWebKit" ) > -1
	) {
		add_lightbox = false;
	}

	truncate.init();
	RunCoCo.translation_services.init( jQuery('.translate-area') );
	europeana.embedly.init();
	europeana.carousel.init( $('#institution-featured') );
	mimetype.init(); // lightbox is now initialized within this object
	photoGallery.init();
	leaflet.init();
	more_like_this.init( 'more-like-this' );

}( jQuery ));
