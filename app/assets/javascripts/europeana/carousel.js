/*global europeana, I18n, jQuery */
/*jslint browser: true, white: true */
(function( $ ) {

	'use strict';

	if ( !window.europeana ) {
		window.europeana = {};
	}

	europeana.carousel = {

		$featured_carousel : null,
		nav_initial_delay: 3000,
		node_id: '',
		$pagination_counts : $('#pagination-counts'),
		pagination_total : $('#pagination-total').text(),
		photogallery_hash_check: false,

		/**
		 * make sure each new rel=prettyPhoto item gets
		 * added to the opened lightbox
		 *
		 * @param {object}
		 * a jQuery object representing the new content
		 *
		 * @returns {bool}
		 */
		addImagesToOpenedLightbox : function( $new_content ) {
			// if lightbox is not open return
			if ( $('.pp_pic_holder').length < 1 ) {
				return false;
			}

			$new_content.find("#" + this.node_id + " a[rel^='prettyPhoto']").each(function() {
				var $elm = $(this);
				window.pp_images.push( $elm.attr('href') );
				window.pp_descriptions.push( $elm.attr('data-description') );
			});

			return true;
		},

		addNavArrowHandling: function() {
			if ( !europeana.carousel.$featured_carousel
				|| !europeana.carousel.$featured_carousel.$items
				|| europeana.carousel.$featured_carousel.$items.length < 2
			) {
				return;
			}

			setTimeout(
				function() {
					europeana.carousel.$featured_carousel.$next.addClass('initial');
					europeana.carousel.$featured_carousel.$prev.addClass('initial');
				},
				europeana.carousel.nav_initial_delay
			);

			europeana.carousel.$featured_carousel.$items.each( function() {
				var $elm = $(this);

				// decided to use $elm.data instead of $(element).data('events')
				// see http://blog.jquery.com/2012/08/09/jquery-1-8-released/ What's been removed
				if ( !$elm.data( 'carousel-events-added' ) ) {
					$elm
						.on( 'mouseenter', europeana.carousel.navArrowReveal )
						.on( 'mouseleave', europeana.carousel.navArrowHide )
						.on( 'touchstart', europeana.carousel.navArrowReveal )
						.on( 'touchend', europeana.carousel.navArrowHide );

					$elm.data( 'carousel-events-added', true );
				}
			});
		},

		/**
		 * @param {int} index
		 */
		goToIndex: function( index ) {
			index = parseInt( index, 10 );

			if ( ( index + 1 ) > this.$featured_carousel.items_length ) {
				index = this.$featured_carousel.items_length - 1;
			} else if ( index < 0 ) {
				index = 0;
			}
		},

		/**
		 * @param {string} node_id
		 */
		init: function( node_id ) {
			var self = this;

			this.node_id = node_id;

			$('#' + this.node_id).imagesLoaded( function() {
				self.$featured_carousel =
					$('#' + self.node_id).rCarousel({
						hide_overlay: false,
						item_width_is_container_width : true,
						items_collection_total : parseInt( self.pagination_total, 10 ),
						callbacks : {
							after_nav: function() {
								europeana.carousel.updatePaginationCount();
							},
							before_nav: function( dir ) {
								europeana.carousel.replaceItemPlaceholderCheck( dir );
							},
							init_complete: function() {
								europeana.carousel.addNavArrowHandling();
							}
						}
					}).data('rCarousel');

				europeana.carousel.updatePaginationCount();
			});
		},

		navArrowHide: function() {
			europeana.carousel.$featured_carousel.$next.removeClass('focus');
			europeana.carousel.$featured_carousel.$prev.removeClass('focus');
		},

		navArrowReveal: function() {
			europeana.carousel.$featured_carousel.$next.addClass('focus');
			europeana.carousel.$featured_carousel.$prev.addClass('focus');
		},

		/**
		 * @param {int} new_carousel_index
		 *
		 * @param {object} $elm_plcaeholder
		 * jQuery object representing a placeholder item
		 */
		replaceItemPlaceholder: function( new_carousel_index, $elm_placeholder ) {
			var $a = $elm_placeholder.find('a').eq(0),
			$img = $elm_placeholder.find('img').eq(0);

			$img
				.attr( 'src', '/assets/v2.1/images/icons/loading-animation.gif' )
				.attr( 'src', $a.attr( 'data-attachment-preview-url' ) )
				.attr( 'alt', $a.attr( 'data-attachment-title' ) );

			$elm_placeholder.removeClass( 'item-placeholder' );

			if ( this.photogallery_hash_check ) {
				this.$featured_carousel.goToIndex( new_carousel_index );
				this.updatePaginationCount();
				this.photogallery_hash_check = false;
			}
		},

		/**
		 * decide whether or not to pull in additional carousel items
		 *
		 * @param {string|int} dir
		 * expected string next|prev
		 */
		replaceItemPlaceholderCheck: function( dir ) {
			var $elm_placeholder,
			new_carousel_index = 0,
			current_carousel_index = this.$featured_carousel.get('current_item_index');

			if ( dir === 'next' ) {
				new_carousel_index = current_carousel_index + 1;
			} else if ( dir === 'prev' ) {
				new_carousel_index = current_carousel_index - 1;
			} else {
				new_carousel_index = parseInt( dir, 10 );
			}

			$elm_placeholder = this.$featured_carousel.$items.eq( new_carousel_index );

			if (
				new_carousel_index === -1
				|| ( new_carousel_index + 1 ) > this.$featured_carousel.items_length
				|| !$elm_placeholder.hasClass('item-placeholder')
			) {
				return;
			}

			// replace item-placeholder
			this.replaceItemPlaceholder( new_carousel_index, $elm_placeholder );
		},

		updatePaginationCount : function() {
			if ( this.pagination_total < 2 ) {
				return;
			}

			this.$pagination_counts.html(
				I18n.t('javascripts.thumbnails.item') + ' ' +
				( this.$featured_carousel.get('current_item_index') + 1 ) +	' ' +
				I18n.t('javascripts.thumbnails.of') + ' ' +
				this.pagination_total
			);
		}

	};

}( jQuery ));
