/*global anno, europeana, I18n, jQuery, L, RunCoCo */
/*jslint browser: true, white: true */
(function( $ ) {

	'use strict';

	var
	add_lightbox = true,
	carousel = europeana.carousel,


	lightbox = {
		annotorious_setup: false,
		ppOptions : {},

		handlePageChangeNext : function( keyboard ) {
			if ( !keyboard ) {
				carousel.$featured_carousel.$next.trigger('click');
			}
		},

		handlePageChangePrev : function( keyboard ) {
			if ( !keyboard ) {
				carousel.$featured_carousel.$prev.trigger('click');
			}
		},

		handlePictureChange : function() {
			anno.reset();
			anno.hideSelectionWidget();
		},

		hideLightboxContent: function() {
			var $pp_pic_holder = $('.pp_pic_holder');
			$pp_pic_holder.find('#pp_full_res object,#pp_full_res embed').css('visibility','hidden');
			$pp_pic_holder.find('.pp_fade').fadeOut('fast',function(){
				$('.pp_loaderIcon').show();
			});
		},

		init : function() {
			if ( add_lightbox ) {
				this.setupPrettyPhoto();
				this.setupAnnotorious();
			} else {
  			this.removeLightboxLinks();
			}
		},

		removeLightboxLinks : function() {
			$('#institution-featured a').each(function() {
				var $elm = jQuery(this),
						contents = $elm.contents();

				if ( !$elm.hasClass('pdf') && !$elm.hasClass('original-context') ) {
					$elm.replaceWith(contents);
				}
			});

			$('#institution-featured .view-item').each(function() {
				jQuery(this).remove();
			});
		},

		setupAnnotorious : function() {
			if ( this.annotorious_setup ) {
				return;
			}

			anno.addPlugin( 'RunCoCo_EDM', { } );
			anno.addPlugin( 'RunCoCo', { base_url : window.location.protocol + "//" + window.location.host + "/" + RunCoCo.locale + "/annotations" } );
			anno.addPlugin( 'Flag', { base_url : window.location.protocol + "//" + window.location.host + "/" + RunCoCo.locale + "/annotations" } );
			this.annotorious_setup = true;
		},

		setupPrettyPhoto : function() {
			lightbox.ppOptions.callback = function() {
				// this insures that additional content that was loaded while
				// in lightbox is lightbox enabled if the lightbox is closed
				lightbox.init();
			};

			lightbox.ppOptions.changepagenext = lightbox.handlePageChangeNext;
			lightbox.ppOptions.changepageprev = lightbox.handlePageChangePrev;
			lightbox.ppOptions.changepicturecallback = lightbox.handlePictureChange;
			lightbox.ppOptions.collection_total = carousel.pagination_total;
			lightbox.ppOptions.description_src = 'data-description';
			lightbox.ppOptions.image_markup = '<img id="fullResImage" src="{path}" class="annotatable">';
			lightbox.ppOptions.overlay_gallery = false;
			lightbox.ppOptions.show_title = false;
			lightbox.ppOptions.social_tools = false;

			$("#institution-featured a[rel^='prettyPhoto']").prettyPhoto( lightbox.ppOptions );
		}
	},


	leaflet = {
		init: function() {
			var
				map_options,
				markers;

			if (
				RunCoCo.leaflet.markers !== undefined &&
				$.isArray( RunCoCo.leaflet.markers )
				) {
				markers = RunCoCo.leaflet.markers
			}

			if ( RunCoCo.leaflet.map_options !== undefined ) {
				map_options = RunCoCo.leaflet.map_options
			}

			europeana.leaflet.init({
				add_europeana_ctrl: true,
				add_minimap: true,
				map_options: map_options,
				markers: markers
			});
		}
	},


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
				lightbox.init();
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
	europeana.carousel.init('institution-featured');
	mimetype.init(); // lightbox is now initialized within this object
	photoGallery.init();
	leaflet.init();

}( jQuery ));
