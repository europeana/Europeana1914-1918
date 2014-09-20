/*global europeana, I18n, jQuery */
/*jslint browser: true, white: true */
(function( $ ) {

	'use strict';

	if ( !window.europeana ) {
		window.europeana = {};
	}

	europeana.carousel = {

		$featured_carousel : null,
		node_id: '',
		$elm: null,
		$pagination_counts : $('#pagination-counts'),
		pagination_total : $('#pagination-total').text(),
		photogallery_hash_check: false,
		placeholder: {
			alt_attr: 'data-title',
			src_attr: 'data-image-preview',
			src_loading: '/assets/v2.1/images/icons/loading-animation.gif'
		},

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

			$new_content.find( this.$elm.find("a[rel^='prettyPhoto']" ) ).each(function() {
				var $elm = $(this);
				window.pp_images.push( $elm.attr('href') );
				window.pp_descriptions.push( $elm.attr('data-description') );
			});

			return true;
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
		 * @param {object} $elm
		 * jQuery object that represents the carousel container
		 */
		init: function( $elm, init_complete_callback ) {
			var self = this;
			this.$elm = $elm;

			this.$elm.imagesLoaded( function() {
				self.$featured_carousel =
					self.$elm.rCarousel({
						hide_overlay: false,
						item_width_is_container_width : true,
						items_collection_total : $.isNumeric( self.pagination_total ) ? parseInt( self.pagination_total, 10 ) : 0,
						callbacks : {
							after_nav: function() {
								europeana.carousel.updatePaginationCount();
							},
							before_nav: function( dir ) {
								europeana.carousel.replaceItemPlaceholderCheck( dir );
							},
							init_complete: function() {
								if ( $.isFunction( init_complete_callback ) ) {
									init_complete_callback();
								}
							}
						},
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

				europeana.carousel.updatePaginationCount();
			});
		},

		/**
		 * @param {int} new_carousel_index
		 *
		 * @param {object} $elm_placeholder
		 * jQuery object representing a placeholder item
		 */
		replaceItemPlaceholder: function( new_carousel_index, $elm_placeholder ) {
			var $dl = $elm_placeholder.find('dl').eq(0),
			$img = $elm_placeholder.find('img').eq(0);

			$img
				.attr( 'src', this.placeholder.src_loading )
				.attr( 'src', $dl.attr( this.placeholder.src_attr ) )
				.attr( 'alt', $dl.attr( this.placeholder.alt_attr ) );

			$elm_placeholder.removeClass( 'item-placeholder' );

			if ( this.photogallery_hash_check ) {
				this.$featured_carousel.goToIndex( new_carousel_index );
				this.updatePaginationCount();
				this.photogallery_hash_check = false;
			}

			this.$featured_carousel.calculateDimensions();
			//this.$featured_carousel.move();
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
			current_carousel_index = this.$featured_carousel.getCurrentItemIndex();

			if ( dir === 'next' ) {
				new_carousel_index = current_carousel_index + 1;
			} else if ( dir === 'prev' ) {
				new_carousel_index = current_carousel_index - 1;
			} else {
				new_carousel_index = parseInt( dir, 10 );
			}

			$elm_placeholder = this.$featured_carousel.$items.eq( new_carousel_index );

			if (
				new_carousel_index === -1 ||
				( new_carousel_index + 1 ) > this.$featured_carousel.items_length ||
				!$elm_placeholder.hasClass('item-placeholder')
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
				( this.$featured_carousel.getCurrentItemIndex() + 1 ) +	' ' +
				I18n.t('javascripts.thumbnails.of') + ' ' +
				this.pagination_total
			);
		}

	};

}( jQuery ));
