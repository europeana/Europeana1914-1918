/*global jQuery */
/*jslint browser: true, white: true */
/**
 *	@author dan entous <contact@gmtplusone.com>
 *	@version 2014-06-18 08:44 gmt +1
 */
(function( $ ) {

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

		current_direction: '',
		current_item_index : 0,
		next_item_index: 0,

		orientation : window.orientation,
		orientation_count : 0,

		nav_elements_created : false,
		nav_elements_placed : false,
		nav_click_handler_added : false,
		arrow_key_handler_added : false,

		loading_content : false,
		page_nr : 1,


		addKeyboardHandler : function() {
			if ( !this.options.listen_to_arrow_keys ) {
				return;
			}

			if ( this.arrow_key_handler_added ) {
				return;
			}

			$(document).on('keyup', { self : this }, this.handleKeyUp );
			this.arrow_key_handler_added = true;
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

		addNavClickHandler : function() {
			if ( this.nav_click_handler_added ) { return; }
			this.$prev.add( this.$next ).on( 'click', { self : this }, this.handleNavClick );
			this.nav_click_handler_added = true;
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

		addSwipeHandler : function() {
			var self = this;

			if (
				!self.options.add_swipe_handler
				|| document.documentElement.ontouchstart === undefined
				) {
				return;
			}

			if ( !$().touchwipe ) {
				return;
			}

			self.$items.each(function() {
				var $elm = $(this);

				if ( !$.data( this, 'touchwipe-added' ) ) {
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

					$.data( this, 'touchwipe-added', true );
				}
			});
		},

		addWindowResizeHandler : function() {
			if (
				window.onresize === undefined
				|| window.onorientationchange !== undefined
				) {
				return;
			}

			$(window).on( 'resize', { self : this }, this.setDimmensions );
		},

		ajaxCarouselSetup : function() {
			this.$items = this.$carousel_container.find('li');
			this.setDimmensions();
			this.addSwipeHandler();
		},

		calculateDimmensions : function() {
			this.items_length = this.$items.length;
			this.carousel_container_width = this.$carousel_container.width();
			this.item_width = this.getItemWidth();
			this.items_total_width = this.getTotalWidth();
			this.items_per_container = Math.round( this.carousel_container_width / this.item_width );
		},

		callInitComplete: function() {
			if ( 'function' === typeof this.options.callbacks.init_complete ) {
				this.options.callbacks.init_complete.call( this );
			}
		},

		createNavElements : function() {
			if ( this.nav_elements_created ) {
				return;
			}

			this.$prev = $('<input/>', {
				'type' : 'image',
				'class' : this.options.nav_button_size,
				'alt' : 'previous',
				'src' : '/assets/v2.1/images/icons/carousel-arrow-left.png',
				'style' : 'display: none;',
				'data-dir' : 'prev'
			});

			this.$next = $('<input/>', {
				'type' : 'image',
				'class' : this.options.nav_button_size,
				'alt' : 'next',
				'src' : '/assets/v2.1/images/icons/carousel-arrow-right.png',
				'style' : 'display: none;',
				'data-dir' : 'next'
			});

			this.nav_elements_created = true;
		},

		/**
		 *
		 * @param carousel_container
		 */
		deriveCarouselElements : function( carousel_container ) {
			this.$carousel_container = $( carousel_container );
			this.$carousel_ul = this.$carousel_container.find('ul');
			this.$items = this.$carousel_container.find('li');
			this.$overlay = this.$carousel_container.find('.carousel-overlay');
		},

		/**
		 * helper function for external scripts
		 *
		 * @param property
		 * @returns {*}
		 */
		get : function( property ) {
			return this[property];
		},

		/**
		 *
		 * @returns {number}
		 */
		getItemWidth : function() {
			var width = 0;

			if ( this.options.item_width_is_container_width ) {
				return this.carousel_container_width;
			}

			$.each( this.$items, function() {
				var $elm = $(this);

				if ( $elm.outerWidth( true ) > width ) {
					width = $elm.outerWidth( true );
				}
			});

			return width;
		},

		/**
		 *
		 * @returns {number}
		 */
		getTotalWidth: function() {
			var width = 0;

			if ( this.options.item_width_is_container_width ) {
				return this.items_length * this.item_width;
			}

			$.each( this.$items, function() {
				var $elm = $(this);
				width += $elm.outerWidth( true );
			});

			return width;
		},

		/**
		 *
		 * @returns {number}
		 */
		getTransitionAmt: function() {
			var
				self = this,
				result = 0;

			if ( this.item_width_is_container_width ) {
				result = this.next_item_index * this.item_width;
			} else {
				$.each( this.$items, function( index ) {
					var $elm = $( this );

					if ( index === self.next_item_index ) {
						return false;
					}

					result += $elm.outerWidth( true );
				});
			}

			if ( result > 0 ) {
				result = -1 * result;
			}

			return result;
		},

		/**
		 *
		 * @param {int} index
		 */
		goToIndex: function( index ) {
			index = parseInt( index, 10 );
			this.setNextItemIndex( index );
			this.transition();
			this.toggleNav();
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

		/**
		 *
		 * @param [Event} evt
		 */
		handleNavClick : function( evt ) {
			var self = evt.data.self,
				$elm = $(this),
				dir = $elm.data('dir');

			evt.preventDefault();

			if ( 'function' === typeof self.options.callbacks.before_nav ) {
				self.options.callbacks.before_nav.call( this, dir );
			}

			if ( !self.options.cancel_nav ) {
				self.setNextItemIndex( dir );
				self.transition();
				self.toggleNav();
			}

			if ( 'function' === typeof self.options.callbacks.after_nav ) {
				self.options.callbacks.after_nav.call( this, dir );
			}

			self.options.cancel_nav = false;
		},

		hideOverlay : function() {
			var self = this;

			if ( this.$overlay.is(':visible') ) {
				this.$overlay.fadeOut( function() {
					self.callInitComplete();
				});
			}
		},

		init : function( options, carousel_container ) {
			this.options = $.extend( true, {}, $.fn.rCarousel.options, options );
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
		},

		placeNavElements : function() {
			if ( this.nav_elements_placed ) {
				return;
			}

			this.$carousel_container.append( this.$prev, this.$next );
			this.nav_elements_placed = true;
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

		transition : function() {
			var
				self = this,
				new_left = this.getTransitionAmt();

			if ( self.loading_content ) {
				setTimeout(
					function() {
						self.transition();
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

			this.current_item_index = this.next_item_index;
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

		/**
		 *
		 * @param {Event|undefined} evt
		 */
		setDimmensions : function( evt ) {
			var self = evt ? evt.data.self : this;
			self.calculateDimmensions();
			self.setCarouselWidth();

			if ( !self.options.item_width_is_container_width ) {
				return;
			}

			self.$items.each(function() {
				var $item = $(this);
				$item.css('width', self.item_width );
			});
		},


		/**
		 *
		 * @param {string|int} dir
		 */
		setNextItemIndex : function( dir ) {
			var next_item_index = 0,
			total_carousel_items = this.options.items_collection_total > 0
				? this.options.items_collection_total :
				this.items_length;

			if ( dir === 'next' ) {
				next_item_index = this.current_item_index + 1;
				this.dir = dir;
			} else if ( dir === 'prev' ) {
				next_item_index = this.current_item_index - 1;
				this.dir = dir;
			} else {
				next_item_index = parseInt( dir, 10 );

				if ( next_item_index < this.current_item_index ) {
					this.dir = 'prev';
				} else if ( next_item_index > this.current_item_index ) {
					this.dir = 'next';
				} else {
					this.dir = '';
				}
			}

			if ( next_item_index >= total_carousel_items ) {
				this.next_item_index = total_carousel_items - 1;
			} else if ( next_item_index < 0 ) {
				this.next_item_index = 0;
			} else {
				this.next_item_index = next_item_index;
			}
		}
	};

	/**
	 *
	 * @param {object} options
	 * @returns {*}
	 */
	$.fn.rCarousel = function( options ) {
		return this.each(function() {
			var rcarousel = Object.create( RCarousel );
			rcarousel.init( options, this );
			$(this).data( 'rCarousel', rcarousel );
		});
	};

	$.fn.rCarousel.options = {
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

}( jQuery ));
