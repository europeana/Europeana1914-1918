/*global jQuery */
/*jslint browser: true, white: true */
/**
 *	@author dan entous <contact@gmtplusone.com>
 *	@version 2014-06-23 19:51 gmt +1
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
		items_total : 0,
		items_total_width : 0,
		items_per_container : 0,

		current_direction: '',
		current_item_index : 0,
		next_item_index: 0,
		new_index: 0,
		new_width: 0,


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

		addNavClickHandler : function() {
			if ( this.nav_click_handler_added ) { return; }
			this.$nav_prev.add( this.$nav_next ).on( 'click', { self : this }, this.handleNavClick );
			this.nav_click_handler_added = true;
		},

		addNavArrowHandling : function() {
			if ( this.$items.length < 2 ) {
				return;
			}

			var self = this;

			setTimeout(
				function() {
					self.$nav_next.addClass( 'initial' );
					self.$nav_prev.addClass( 'initial' );
				},
				self.options.nav_initial_delay
			);

			this.$items.each( function() {
				var $elm = $( this );

				// decided to use $elm.data instead of $(element).data('events')
				// see http://blog.jquery.com/2012/08/09/jquery-1-8-released/ What's been removed
				if ( !$elm.data( 'carousel-events-added' ) ) {
					$elm
						.on( 'mouseenter', { self: self }, self.navArrowReveal )
						.on( 'mouseleave', { self: self }, self.navArrowHide )
						.on( 'touchstart', { self: self }, self.navArrowReveal )
						.on( 'touchend', { self: self }, self.navArrowHide );

					$elm.data( 'carousel-events-added', true );
				}
			});
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
						wipeLeft : function( evt ) { evt.preventDefault(); self.$nav_next.trigger('click'); },
						wipeRight : function( evt ) { evt.preventDefault(); self.$nav_prev.trigger('click'); },
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
			this.$items = this.$carousel_container.find( 'li' );
			this.setDimmensions();
			this.addSwipeHandler();
		},

		calculateDimmensions : function() {
			this.items_length = this.$items.length;
			this.items_total = this.items_length - 1;
			this.carousel_container_width = this.$carousel_container.width();
			this.item_width = this.getItemWidth();
			this.items_total_width = this.getTotalWidth();
			this.items_per_container = Math.round( this.carousel_container_width / this.item_width );
		},

		calculateNavNext : function() {
			var
				previous_amt = 0,
				new_values = {
					new_index: 0,
					new_width: 0
				},
				self = this;

			$.each( this.$items, function( index ) {
				var $elm = $( this );

				// stop carousel from scrolling beyond last element
				if ( self.current_item_index === self.$items.length - 1 ) {
					return false;
				} else if ( index >= self.current_item_index ) {
					new_values.new_width += $elm.outerWidth( true );

					if ( ( new_values.new_width - previous_amt ) > self.carousel_container_width ) {
						// this can happen if the window is smaller than the element’s width
						if ( index !== self.current_item_index ) {
							new_values.new_width -= $elm.outerWidth( true );
							new_values.new_index = index;
						} else {
							new_values.new_index = index + 1;
						}

						return false;
					}
				} else {
					new_values.new_width += $elm.outerWidth( true );
					previous_amt = new_values.new_width;
				}
			});

			// stop carousel from scrolling beyond last element
			if (
				this.current_item_index === this.items_total ||
				new_values.new_width >= this.items_total_width
			) {
				new_values.new_index = this.items_total;
				new_values.new_width = -1 * parseInt( this.$carousel_ul.css( 'margin-left' ) , 10 );
			}

			return new_values;
		},

		calculateNavPrev : function() {
			var
				i,
				new_values = {
					new_index: 0,
					new_width: 0
				},
				self = this;

			if ( this.current_direction === 'prev' && this.current_item_index !== 0 ) {
				for ( i = this.items_total; i >= 0; i -= 1 ) {
					if ( i <= this.current_item_index - 1 ) {
						new_values.new_width += this.$items.eq( i ).outerWidth( true );

						if ( new_values.new_width > this.carousel_container_width ) {
							new_values.new_index = i;
							break;
						}

						new_values.new_index = i;
					}
				}
			}

			// reset width after running over to find an index
			new_values.new_width = 0;

			$.each( this.$items, function( index ) {
				var $elm = $( this );

				new_values.new_width += $elm.outerWidth( true );

				if ( index === new_values.new_index ) {
					new_values.new_width -= $elm.outerWidth( true );
					return false;
				}
			});

			return new_values;
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

			this.$nav_prev = this.options.$nav_prev;
			this.$nav_next = this.options.$nav_next;
			this.nav_elements_created = true;
		},

		/**
		 *
		 * @param carousel_container
		 */
		deriveCarouselElements : function( carousel_container ) {
			this.$carousel_container = $( carousel_container );
			this.$carousel_ul = this.$carousel_container.find( 'ul' );
			this.$items = this.$carousel_container.find( 'li' );
			this.$overlay = this.$carousel_container.find( '.carousel-overlay' );
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
				var $elm = $( this );

				if ( $elm.outerWidth( true ) > width ) {
					width = $elm.outerWidth( true );
				}
			});

			return width;
		},

		/**
		 * @returns {number}
		 */
		getTotalWidth: function() {
			var width = 0;

			if ( this.options.item_width_is_container_width ) {
				return this.items_length * this.item_width;
			}

			$.each( this.$items, function( index ) {
				width += $( this ).outerWidth( true );
			});

			// strange hack. when the browser width is at its smallest total width doesn’t work
			return width;
		},

		/**
		 *
		 * @param {int} index
		 */
		goToIndex: function( index ) {
			index = parseInt( index, 10 );
			this.setNavValues( index );
			this.transition();
			this.toggleNav();
		},

		handleKeyUp : function( evt ) {
			if ( !evt || !evt.keyCode ) { return; }
			var self = evt.data.self;

			switch( evt.keyCode ) {
				case 37 :
					self.$nav_prev.trigger('click');
					break;

				case 39 :
					self.$nav_next.trigger('click');
					break;
			}
		},

		/**
		 *
		 * @param [Event} evt
		 */
		handleNavClick : function( evt ) {
			var
				self = evt.data.self,
				$elm = $( this ),
				dir = $elm.data( 'dir' );

			evt.preventDefault();

			if ( $.isFunction( self.options.callbacks.before_nav ) ) {
				self.options.callbacks.before_nav.call( this, dir );
			}

			if ( !self.options.cancel_nav ) {
				self.setNavValues( dir );
				self.transition();
				self.toggleNav();
			}

			if ( $.isFunction( self.options.callbacks.after_nav ) ) {
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

		/**
		 * @param {object} options
		 * @param {} carousel_container
		 */
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
			}

			if ( this.options.add_nav_arrow_reveal ) {
				this.addNavArrowHandling();
			}

			this.callInitComplete();
		},

		/**
		 * @param {Event} evt
		 */
		navArrowHide : function( evt ) {
			var self = evt.data.self;
			self.$nav_next.removeClass( 'focus' );
			self.$nav_prev.removeClass( 'focus' );
		},

		/**
		 * @param {Event} evt
		 */
		navArrowReveal : function( evt ) {
			var self = evt.data.self;
			self.$nav_next.addClass( 'focus' );
			self.$nav_prev.addClass( 'focus' );
		},

		placeNavElements : function() {
			if ( this.nav_elements_placed ) {
				return;
			}

			this.$carousel_container.append( this.$nav_prev, this.$nav_next );
			this.nav_elements_placed = true;
		},

		setCarouselHeight: function() {
			this.$carousel_container.css( 'height', 'auto' );
		},

		setCarouselWidth : function() {
			this.$carousel_ul.css(
				'width', this.items_total_width
			);
		},

		/**
		 *
		 * @param {Event|undefined} evt
		 */
		setDimmensions : function( evt ) {
			var self = evt ? evt.data.self : this;
			self.calculateDimmensions();
			self.setCarouselWidth();
			self.setCarouselHeight();

			if ( !self.options.item_width_is_container_width ) {
				return;
			}

			self.$items.each(function() {
				var $item = $(this);
				$item.css('width', self.item_width );
			});
		},

		/**
		 * sets the following nav values within the object
		 *
		 * this.new_width
		 * this.new_index
		 * this.current_direction
		 *
		 * @param {string|dir} dir
		 */
		setNavValues : function( dir ) {
			// validate dir
			if (dir !== 'next' && dir !== 'prev' && !$.isNumeric(dir)) {
				throw new Error('cannot evaluate nav click direction or value');
			}

			// set locale vars
			var new_values = {
				new_index: 0,
				new_width: 0
			};

			// handle next nav
			if ( dir === 'next' ) {
				this.current_direction = dir;

				if ( this.options.item_width_is_container_width ) {
					new_values.new_index = this.current_item_index + 1;
					new_values.new_width = new_values.new_index * this.item_width;
				} else {
					new_values = this.calculateNavNext();
				}

			// handle prev nav
			} else if ( dir === 'prev' ) {
				this.current_direction = dir;

				if ( this.options.item_width_is_container_width ) {
					new_values.new_index = this.current_item_index - 1;
					new_values.new_width = new_values.new_index * this.item_width;
				} else {
					new_values = this.calculateNavPrev();
				}

			// handle index nav
			} else if ( $.isNumeric( dir ) ) {
				new_values.new_index = parseInt( dir, 10 );
				new_values.new_width = new_values.new_index * this.item_width;

				if ( new_values.new_index <= this.current_item_index ) {
					this.current_direction = 'prev';
				} else if ( new_values.new_index >= this.current_item_index ) {
					this.current_direction = 'next';
				}
			}

			// protect against next setting width or index beyond total carousel width or total nr of items
			if ( new_values.new_width > this.items_total_width || new_values.new_index > this.items_total ) {
				new_values.new_index = this.items_total;
				new_values.new_width = this.items_total_width - this.$items.eq( this.items_total).outerWidth( true );
			}

			// protect against prev setting width of index before first element
			if ( new_values.new_width < 0 || new_values.new_index < 0 ) {
				new_values.new_index = 0;
				new_values.new_width = 0;
			}

			// convert width to margin-left value
			if ( new_values.new_width > 0 ) {
				new_values.new_width = -1 * new_values.new_width;
			}



			// set values
			this.new_width = new_values.new_width;
			this.new_index = new_values.new_index;
		},

		toggleNav : function() {
			var items_length = this.options.items_collection_total > 0
				? this.options.items_collection_total
				: this.items_length;

			if ( this.$nav_prev ) {
				if ( this.current_item_index === 0 ) {
					this.$nav_prev.fadeOut();
				} else if ( this.$nav_prev.is(':hidden') ) {
					this.$nav_prev.fadeIn();
				}
			}

			if ( this.$nav_next ) {
				if ( this.current_item_index >= items_length - 1 ) {
					this.$nav_next.fadeOut();
				} else if ( this.$nav_next.is(':hidden') ) {
					this.$nav_next.fadeIn();
				}
			}
		},

		transition : function() {
			var	self = this;

			if ( self.loading_content ) {
				setTimeout(
					function() {
						self.transition();
					},
					100
				);

				return;
			}

			if ( this.new_width !== parseInt( this.$carousel_ul.css('margin-left'), 10 ) ) {
				if ( $.support.transition ) {
					this.$carousel_ul.css( 'margin-left', this.new_width );
				} else {
					this.$carousel_ul.animate({
						'margin-left': this.new_width
					});
				}
			}

			this.current_item_index = this.new_index;
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
		add_swipe_handler : true,
		add_nav_arrow_reveal : true,
		callbacks : {
			after_nav : null,
			before_nav : null,
			init_complete: null
		},
		cancel_nav : false,
		hide_overlay: true,
		item_width_is_container_width : true,
		items_collection_total : 0,
		listen_to_arrow_keys : true,
		nav_by : 3, // set a default for the one-way-by,
		nav_initial_delay : 3000,
		$nav_next : $('<input>', {
			'type' : 'image',
			'class' : 'medium',
			'alt' : 'next',
			'src' : 'js/jquery/plugins/rcarousel/images/carousel-arrow-right.png',
			'style' : 'display: none;',
			'data-dir' : 'next'
		}),
		$nav_prev : $('<input>', {
			'type' : 'image',
			'class' : 'medium',
			'alt' : 'previous',
			'src' : 'js/jquery/plugins/rcarousel/images/carousel-arrow-left.png',
			'style' : 'display: none;',
			'data-dir' : 'prev'
		})
	};

}( jQuery ));
