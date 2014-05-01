/*global jQuery */
/*jslint browser: true, white: true */
/**
 *	@author dan entous <contact@gmtplusone.com>
 *	@version 2014-05-01 04:08 gmt +1
 */
(function() {

	'use strict';


	if ( 'function' !== typeof Object.create ) {
		Object.create = function( obj ) {
			function F() {
				return;
			}

			F.prototype = obj;
			return new F();
		};
	}


	var RCarousel = {

		options : null,
		$carousel_container : null,
		$carousel_ul : null,
		$items : null,
		$overlay : null,
		$prev : null,
		$next : null,

		carousel_container_width : 0,

		item_width : 0,
		items_length : 0,
		items_total_width : 0,
		items_per_container : 0,

		current_item_index : 0,

		orientation : window.orientation,
		orientation_count : 0,

		nav_elements_created : false,
		nav_elements_placed : false,
		nav_click_handler_added : false,
		arrow_key_handler_added : false,

		loading_content : false,
		page_nr : 1,


		/**
		 *	helper function for external scripts
		 */
		get : function( property ) {

			return this[property];

		},


		/**
		 * @param {int} index
		 */
		goToIndex: function( index ) {
			index = parseInt( index, 10 );
			this.setCurrentItemIndex( index );
			this.transition();
			this.toggleNav();
		},


		hideOverlay : function() {
			var self = this;

			if ( this.$overlay.is(':visible') ) {
				this.$overlay.fadeOut( function() {
					self.callInitComplete();
				});
			}
		},


		transition : function( coords ) {
			var self = this,
			new_left = coords !== undefined
				? coords
				: -( this.current_item_index * this.item_width );

			if ( self.loading_content ) {
				setTimeout(
					function() {
						self.transition( coords );
					},
					100
				);

				return;
			}

			if ( new_left !== parseInt( this.$carousel_ul.css('margin-left'), 10 ) ) {
				this.$carousel_ul.animate({
					'margin-left': new_left
				});
			}
		},


		toggleNav : function() {
			var items_length = this.options.items_collection_total > 0
				? this.options.items_collection_total
				: this.items_length;

			if ( this.$prev ) {
				if ( this.current_item_index === 0 ) {
					this.$prev.fadeOut();
				} else if ( this.$prev.is(':hidden') ) {
					this.$prev.fadeIn();
				}
			}

			if ( this.$next ) {
				if ( this.current_item_index >= items_length - 1 ) {
					this.$next.fadeOut();
				} else if ( this.$next.is(':hidden') ) {
					this.$next.fadeIn();
				}
			}
		},


		/**
		 * @param {string|int} dir
		 * expected string next|prev
		 */
		setCurrentItemIndex : function( dir ) {
			var new_carousel_index = 0,
			total_carousel_items = this.options.items_collection_total > 0
				? this.options.items_collection_total :
				this.items_length;

			if ( dir === 'next' ) {
				new_carousel_index = this.current_item_index + 1;
			} else if ( dir === 'prev' ) {
				new_carousel_index = this.current_item_index - 1;
			} else {
				new_carousel_index = parseInt( dir, 10 );
			}

			if ( new_carousel_index >= total_carousel_items ) {
				this.current_item_index = total_carousel_items - 1;
			} else if ( new_carousel_index < 0 ) {
				this.current_item_index = 0;
			} else {
				this.current_item_index = new_carousel_index;
			}
		},


		handleKeyUp : function( evt ) {
			if ( !evt || !evt.keyCode ) { return; }
			var self = evt.data.self;

			switch( evt.keyCode ) {
				case 37 :
					self.$prev.trigger('click');
					break;

				case 39 :
					self.$next.trigger('click');
					break;
			}
		},


		handleNavClick : function( evt ) {
			var self = evt.data.self,
			$elm = jQuery(this),
			dir = $elm.data('dir');

			evt.preventDefault();

			if ( 'function' === typeof self.options.callbacks.before_nav ) {
				self.options.callbacks.before_nav.call( this, dir );
			}

			if ( !self.options.cancel_nav ) {
				self.setCurrentItemIndex( dir );
				self.transition();
				self.toggleNav();
			}

			if ( 'function' === typeof self.options.callbacks.after_nav ) {
				self.options.callbacks.after_nav.call( this, dir );
			}

			self.options.cancel_nav = false;
		},


		addSwipeHandler : function() {
			var self = this;

			if (
				!self.options.add_swipe_handler
				|| document.documentElement.ontouchstart === undefined
			) {
				return;
			}

			if ( !jQuery().touchwipe ) {
				return;
			}

			self.$items.each(function() {
				var $elm = jQuery(this);

				if ( !jQuery.data( this, 'touchwipe-added' ) ) {
					$elm.touchwipe({
						wipeLeft : function( evt ) { evt.preventDefault(); self.$next.trigger('click'); },
						wipeRight : function( evt ) { evt.preventDefault(); self.$prev.trigger('click'); },
						wipeUp : function() {
							return;
						},
						wipeDown : function() {
							return;
						}
					});

					jQuery.data( this, 'touchwipe-added', true );
				}
			});
		},


		addKeyboardHandler : function() {
			if ( !this.options.listen_to_arrow_keys ) {
				return;
			}

			if ( this.arrow_key_handler_added ) {
				return;
			}

			jQuery(document).on('keyup', { self : this }, this.handleKeyUp );
			this.arrow_key_handler_added = true;

		},


		addNavClickHandler : function() {
			if ( this.nav_click_handler_added ) { return; }
			this.$prev.add( this.$next ).on( 'click', { self : this }, this.handleNavClick );
			this.nav_click_handler_added = true;
		},


		placeNavElements : function() {
			if ( this.nav_elements_placed ) {
				return;
			}

			this.$carousel_container.append( this.$prev, this.$next );
			this.nav_elements_placed = true;
		},


		createNavElements : function() {
			if ( this.nav_elements_created ) {
				return;
			}

			this.$prev = jQuery('<input/>', {
				'type' : 'image',
				'class' : this.options.nav_button_size,
				'alt' : 'previous',
				'src' : '/assets/v2.1/images/icons/carousel-arrow-left.png',
				'style' : 'display: none;',
				'data-dir' : 'prev'
			});

			this.$next = jQuery('<input/>', {
				'type' : 'image',
				'class' : this.options.nav_button_size,
				'alt' : 'next',
				'src' : '/assets/v2.1/images/icons/carousel-arrow-right.png',
				'style' : 'display: none;',
				'data-dir' : 'next'
			});

			this.nav_elements_created = true;
		},


		addNavigation : function() {
			// return if no nav elements are needed
			if ( this.options.item_width_is_container_width ) {
					if (
						this.items_length < 2
						&& this.options.items_collection_total < this.items_length
					) {
						return;
					}
				} else {
					if (
						this.items_length < this.items_per_container
						&& this.options.items_collection_total < this.items_length
					) {
						return;
					}
				}

			// create the nav elements
			this.createNavElements();

			// add nav elements to the carousel
			this.placeNavElements();

			// add click listeners to the nav elements
			this.addNavClickHandler();

			// add keyboard arrow support
			this.addKeyboardHandler();

			// add touch swipe support
			// uses a modified version of http://www.netcu.de/jquery-touchwipe-iphone-ipad-library
			this.addSwipeHandler();
		},


		getItemWidth : function() {
			var self = this,
			i,
			ii = self.items_length,
			width = 0;

			if ( self.options.item_width_is_container_width ) {
				return self.carousel_container_width;
			}

			for ( i = 0; i < ii; i += 1) {
				if ( self.$items.eq(i).outerWidth(true) > width ) {
					width = self.$items.eq(i).outerWidth(true);
				}
			}

			return width;
		},


		setCarouselWidth : function() {
			var pos = this.current_item_index === 0
				? 1
				: this.current_item_index,
				new_margin_left = -( pos * this.item_width - this.item_width ),
				new_margin_right = '';

			if (
				!this.options.item_width_is_container_width
				&& this.items_length <= this.items_per_container
			) {
				new_margin_left = 'auto';
				new_margin_right = 'auto';
			}

			this.$carousel_ul.css({
				width : this.items_total_width + 5,
				'margin-left' : new_margin_left,
				'margin-right' : new_margin_right
			});
		},


		calculateDimmensions : function() {
			this.items_length = this.$items.length;
			this.carousel_container_width = this.$carousel_container.width();
			this.item_width = this.getItemWidth();
			this.items_total_width = this.items_length * this.item_width;
			this.items_per_container = Math.round( this.carousel_container_width / this.item_width );
		},


		setDimmensions : function( evt ) {
			var self = evt ? evt.data.self : this;
					self.calculateDimmensions();
					self.setCarouselWidth();

			self.$items.each(function() {
				var $item = jQuery(this);
				$item.css('width', self.item_width );
			});
		},


		addOrientationHandler : function() {
			var self = this;
			if ( window.orientation === undefined ) {
				return;
			}

			setInterval(
				function() {
					if ( window.orientation !== self.orientation ) {
						self.setDimmensions();
						self.orientation_count += 1;

						if ( self.orientation_count >= 2 ) {
							self.transition();
							self.orientation = window.orientation;
							self.orientation_count = 0;
						}
					}
				},
				500
			);
		},


		addWindowResizeHandler : function() {
			if (
				window.onresize === undefined
				|| window.onorientationchange !== undefined
			) {
				return;
			}

			jQuery(window).on( 'resize', { self : this }, this.setDimmensions );
		},


		ajaxCarouselSetup : function() {
			this.$items = this.$carousel_container.find('li');
			this.setDimmensions();
			this.addSwipeHandler();
		},


		deriveCarouselElements : function( carousel_container ) {
			this.$carousel_container = jQuery( carousel_container );
			this.$carousel_ul = this.$carousel_container.find('ul');
			this.$items = this.$carousel_container.find('li');
			this.$overlay = this.$carousel_container.find('.carousel-overlay');
		},

		callInitComplete: function() {
			if ( 'function' === typeof this.options.callbacks.init_complete ) {
				this.options.callbacks.init_complete.call( this );
			}
		},

		init : function( options, carousel_container ) {
			this.options = jQuery.extend( true, {}, jQuery.fn.rCarousel.options, options );
			this.deriveCarouselElements( carousel_container );
			this.setDimmensions();
			this.addNavigation();
			this.toggleNav();

			this.addWindowResizeHandler();
			this.addOrientationHandler();

			if ( this.options.hide_overlay ) {
				this.hideOverlay();
			} else {
				this.callInitComplete();
			}
		}
	};


	jQuery.fn.rCarousel = function( options ) {
		return this.each(function() {
			var rcarousel = Object.create( RCarousel );
			rcarousel.init( options, this );
			jQuery(this).data( 'rCarousel', rcarousel );
		});
	};


	jQuery.fn.rCarousel.options = {
		listen_to_arrow_keys : true,
		add_swipe_handler : true,
		hide_overlay: true,
		item_width_is_container_width : true,
		items_collection_total : 0,
		nav_button_size : 'medium',
		nav_by : 3, // set a default for the one-way-by,
		cancel_nav : false,
		callbacks : {
			after_nav : null,
			before_nav : null,
			init_complete: null
		}
	};

}());
