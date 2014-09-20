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

		options : {
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

			// allows user to override item total found in the container
			// main use case is when only a certain nr of items are in the container
			// and an ajax call will pull in additional items
			items_collection_total : 0,

			listen_to_arrow_keys : true,
			nav_initial_delay : 3000,
			nav_next : {
				'type' : 'image',
				'class' : 'medium',
				'alt' : 'next',
				'src' : 'js/jquery/plugins/rcarousel/images/carousel-arrow-right.png',
				'style' : 'display: none;',
				'data-dir' : 'next'
			},
			nav_prev : {
				'type' : 'image',
				'class' : 'medium',
				'alt' : 'previous',
				'src' : 'js/jquery/plugins/rcarousel/images/carousel-arrow-left.png',
				'style' : 'display: none;',
				'data-dir' : 'prev'
			}
		},

		$carousel_container : null,
		$carousel_ul : null,
		$items : null,
		$nav_next : null,
		$nav_prev : null,
		$overlay : null,

		attributes: {
			container_width : 0,
			current_item_index : 0,
			item_total : 0,
			items_last_index : 0,
			tallest_item : 0,
			total_width : 0,
			ul_width : 0,
			widest_item : 0
		},

		arrow_key_handler_added : false,
		loading_content : false,
		nav_elements_created : false,
		nav_elements_placed : false,
		nav_click_handler_added : false,

		new_nav : {
			direction : '',
			index : 0
		},

		orientation : window.orientation,
		orientation_count : 0,

		addKeyboardHandler : function() {
			if (
				!this.options.listen_to_arrow_keys ||
				this.arrow_key_handler_added
			) {
				return;
			}

			$( document ).on( 'keyup', { self: this }, this.handleKeyUp );
			this.arrow_key_handler_added = true;
		},

		addNavClickHandler : function() {
			if ( this.nav_click_handler_added ) {
				return;
			}

			var
			self = this;

			this.$nav_prev.add( this.$nav_next ).on( 'click', { self: self }, self.handleNavClick );
			this.nav_click_handler_added = true;
		},

		addNavArrowHandling : function() {
			if (
				this.$items.length < 2 ||
				this.$nav_next === undefined
			) {
				return;
			}

			var
			self = this;

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
			if ( this.attributes.item_total === 1 ) {
				return;
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
			if ( window.orientation === undefined ) {
				return;
			}

			var
			self = this;

			setInterval(
				function() {
					if ( window.orientation !== self.orientation ) {
						self.calculateDimensions();
						self.orientation_count += 1;

						if ( self.orientation_count >= 2 ) {
							self.animate();
							self.orientation = window.orientation;
							self.orientation_count = 0;
						}
					}
				},
				500
			);
		},

		addSwipeHandler : function() {
			var
			$elm,
			self = this;

			if (
				!self.options.add_swipe_handler ||
				document.documentElement.ontouchstart === undefined ||
				!$().touchwipe
			) {
				return;
			}

			self.$items.each(function() {
				$elm = $( this );

				if ( !$.data( this, 'touchwipe-added' ) ) {
					$elm.touchwipe({
						wipeLeft : function( evt ) {
							evt.preventDefault();
							self.$nav_next.trigger('click');
						},
						wipeRight : function( evt ) {
							evt.preventDefault();
							self.$nav_prev.trigger('click');
						},
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
				window.onresize === undefined ||
				window.onorientationchange !== undefined
			) {
				return;
			}

			var self = this;

			// a version of smartresize is currently included in jquery.masonry
			// another version is available at this url if needed
			// http://www.paulirish.com/2009/throttled-smartresize-jquery-event-handler/
			$( window ).smartresize(
				function() {
					self.calculateDimensions( { data: { self: self } } );
				}, 400
			);
		},

		ajaxCarouselSetup : function() {
			this.$items = this.$carousel_container.find( 'li' );
			this.calculateDimensions();
			this.addSwipeHandler();
		},

		/**
		 * animates the carousel to its new position
		 */
		animate : function() {
			var
			self = this;

			if ( self.loading_content ) {
				setTimeout(
					function() {
						self.animate();
					},
					100
				);

				return;
			}

			if ( this.new_nav.width !== this.attributes.ul_width ) {
				if ( $.support.transition ) {
					this.$carousel_ul.css( 'margin-left', this.new_nav.width );
				} else {
					this.$carousel_ul.animate({
						'margin-left': this.new_nav.width
					});
				}

				this.attributes.ul_width = this.new_nav.width;
			}

			this.attributes.current_item_index = this.new_nav.index;
		},

		/**
		 * this method is called at various moments. sometimes with jQuery events
		 * and sometimes not, thus the need to define self as below.
		 *
		 * it’s used to calculate and re-calculate carousel attributes based on
		 * the items within the carousel
		 *
		 * @param {Event|undefined} evt
		 * jQuery Event
		 */
		calculateDimensions: function( evt ) {
			var
			self = evt ? evt.data.self : this;

			self.deriveCarouselItems();
			self.calculateWidestTallest();
			self.equalizeItemWidth();
			self.calculateTotalWidth();

			self.setCarouselHeight();
			self.setCarouselWidth();
		},

		/**
		 * calculates new nav values,
		 * preparing for navigation in the carousel
		 *
		 * @param {string|int} dir
		 */
		calculateNewNav: function( dir ) {
			// validate dir
			if (dir !== 'next' && dir !== 'prev' && !$.isNumeric( dir ) ) {
				throw new Error( 'cannot evaluate nav click direction or value' );
			}

			// reset new nav values
			this.new_nav.direction = '';
			this.new_nav.index = 0;
			this.new_nav.width = 0;

			// handle next nav
			if ( dir === 'next' ) {
				this.new_nav.index = this.attributes.current_item_index + 1;

				if ( this.options.item_width_is_container_width ) {
					this.new_nav.width = -1 * ( this.new_nav.index * this.attributes.container_width );
				} else {
					this.calculateNewNavNext();
				}

			// handle prev nav
			} else if ( dir === 'prev' ) {
				this.new_nav.index = this.attributes.current_item_index - 1;

				if ( this.options.item_width_is_container_width ) {
					this.new_nav.width = -1 * ( this.new_nav.index * this.attributes.container_width );
				} else {
					this.calculateNewNavPrev();
				}

			// handle index nav
			} else if ( $.isNumeric( dir ) ) {
				this.new_nav.index = parseInt( dir, 10 );
				this.new_nav.width = -1 * ( this.new_nav.index * this.attributes.container_width );

				// set direction for an index nav value
				if ( this.new_nav.index <= this.attributes.current_item_index ) {
					this.new_nav.direction = 'prev';
				} else if ( this.new_nav.index >= this.attributes.current_item_index ) {
					this.new_nav.direction = 'next';
				}
			}
		},

		/**
		 * calculates the next new nav values for
		 * carousel containers that have items of varying widths
		 */
		calculateNewNavNext: function() {
			// you should only get here if the carousel item is not the container width
			if ( this.options.item_width_is_container_width ) {
				return;
			}

			var
			item_width,
			new_additional_width = 0,
			self = this;

			// reset new_nav width
			this.new_nav.width = 0;

			$.each( this.$items, function( index ) {
				item_width = $(this).outerWidth(true);

				if ( index > self.attributes.current_item_index ) {
					new_additional_width += item_width;
				}

				if ( new_additional_width > self.attributes.container_width ) {
					new_additional_width -= item_width;
					return false;
				}

				self.new_nav.index = index;
				return true;
			});

			this.new_nav.width = -1 * ( new_additional_width - self.attributes.ul_width );
		},

		/**
		 * calculates the previous new nav values for
		 * carousel containers that have items of varying widths
		 */
		calculateNewNavPrev: function() {
			// you should only get here if the carousel item is not the container width
			if ( this.options.item_width_is_container_width ) {
				return;
			}

			var
			i,
			item_width = 0,
			new_lessening_width = 0;

			// reset new_nav width
			this.new_nav.width = 0;

			for ( i = this.attributes.items_last_index; i >= 0; i -= 1 ) {
				item_width = this.$items.eq(i).outerWidth(true);

				if ( i <= this.attributes.current_item_index - 1 ) {
					new_lessening_width += item_width;
				}

				if ( new_lessening_width > this.attributes.container_width ) {
					new_lessening_width -= item_width;
					break;
				}

				this.new_nav.index = i;
			}

			this.new_nav.width = this.attributes.ul_width + new_lessening_width;
		},

		/**
		 * calculates and sets the carousel ul’s total width
		 */
		calculateTotalWidth: function() {
			var
			self = this;

			this.attributes.total_width = 0;

			this.$items.each(function() {
				self.attributes.total_width += Math.ceil( $( this ).outerWidth( true ) );
			});

			// strange hack to overcome issue found in chrome
			self.attributes.total_width += 1;
		},

		calculateWidestTallest: function() {
			var
			$elm,
			item_height,
			item_width,
			self = this;

			this.attributes.tallest_item = 0;
			this.attributes.widest_item = 0;

			$.each( this.$items, function() {
				$elm = $( this );
				item_width = Math.ceil( $elm.outerWidth( true ) );
				item_height = Math.ceil( $elm.outerHeight( true ) );

				// determine widest item
				if ( item_width > self.attributes.widest_item ) {
					self.attributes.widest_item = item_width;
				}

				// determine tallest item
				if ( item_height > self.attributes.tallest_item ) {
					self.attributes.tallest_item = item_height;
				}
			});
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

			this.$nav_prev = $( '<input>', this.options.nav_prev );
			this.$nav_next = $( '<input>', this.options.nav_next );
			this.nav_elements_created = true;
		},

		deriveCarouselItems: function() {
			this.attributes.container_width = this.$carousel_container.width();
			this.$items = this.$carousel_container.find( 'li' );
			this.attributes.item_total = this.options.items_collection_total || this.$items.length;
			this.attributes.items_last_index = this.attributes.item_total - 1;
		},

		/**
		 * @param {DOM Element} carousel_container
		 */
		deriveMainCarouselElements: function( carousel_container ) {
			this.$carousel_container = $( carousel_container );
			this.$carousel_ul = this.$carousel_container.find( 'ul' );
			this.$overlay = this.$carousel_container.find( '.carousel-overlay' );
		},

		/**
		 * sets the width of all carousel elements to the widest carousel element.
		 *
		 * the use case for this is when the item width needs to limited to the
		 * carousel width; thus the carousel displays only one item at a time.
		 */
		equalizeItemWidth: function() {
			if ( !this.options.item_width_is_container_width ) {
				return;
			}

			var
			self = this;

			this.$items.each(function() {
				$(this).css( 'width', self.attributes.container_width );
			});
		},

		/**
		 * @returns {int}
		 */
		getCurrentItemIndex : function() {
			return this.attributes.current_item_index;
		},

		/**
		 *
		 * @param {int} index
		 */
		goToIndex: function( index ) {
			var
			dir = parseInt( index, 10 );

			this.move( dir );
		},

		/**
		 * @param {Event} evt
		 * jQuery Event
		 */
		handleKeyUp : function( evt ) {
			var
			self = evt.data.self;

			switch( evt.keyCode ) {
				case 37 :
					self.$nav_prev.trigger( 'click' );
					break;

				case 39 :
					self.$nav_next.trigger( 'click' );
					break;
			}
		},

		/**
		 *
		 * @param [Event} evt
		 * jQuery Event
		 */
		handleNavClick: function( evt ) {
			var
			self = evt.data.self,
			$elm = $( this ),
			dir = $elm.attr( 'data-dir' );

			evt.preventDefault();
			evt.stopPropagation();

			// call any callbacks before moving the carousel
			if ( $.isFunction( self.options.callbacks.before_nav ) ) {
				self.options.callbacks.before_nav.call( this, dir );
			}

			// move the carousel
			if ( !self.options.cancel_nav ) {
				self.move( dir );
			}

			// call any callbacks after moving the carousel
			if ( $.isFunction( self.options.callbacks.after_nav ) ) {
				self.options.callbacks.after_nav.call( this, dir );
			}

			// why is this here?
			self.options.cancel_nav = false;
		},

		hideOverlay : function() {
			var self = this;

			if ( this.$overlay.is( ':visible' ) ) {
				this.$overlay.fadeOut( function() {
					self.callInitComplete();
				});
			}
		},

		/**
		 * @param {object} options
		 * @param {DOM Element} carousel_container
		 */
		init : function( options, carousel_container ) {
			this.initializeInstance( options );

			this.deriveMainCarouselElements( carousel_container );
			this.calculateDimensions();

			this.addNavigation();
			this.toggleNavArrows();

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
		 * need to make sure that each instance of this object has its own
		 * version of the object properties otherwise the jQuery objects created
		 * will all use the same prototype properties
		 *
		 * @param {object} options
		 * allows the user to override default options
		 */
		initializeInstance: function( options ) {
			this.options = $.extend( true, {}, this.options, options );
			this.attributes = $.extend( true, {}, this.attributes, {} );

			this.$carousel_container = null;
			this.$carousel_ul = null;
			this.$items = null;
			this.$nav_next = null;
			this.$nav_prev = null;
			this.$overlay = null;

			this.arrow_key_handler_added = false;
			this.loading_content = false;
			this.nav_elements_created = false;
			this.nav_elements_placed = false;
			this.nav_click_handler_added = false;

			this.new_nav = {
				direction: '',
				index: 0
			};

			this.orientation = window.orientation;
			this.orientation_count = 0;
		},

		/**
		 * moves the carousel in a given direction or to a specific index
		 *
		 * @param {string|int} dir
		 * a direction such as next|prev
		 * or to a specific index such as 3
		 */
		move: function( dir ) {
			this.calculateNewNav( dir );
			this.validateNewNav();
			this.animate();
			this.toggleNavArrows();
		},

		/**
		 * @param {Event} evt
		 */
		navArrowHide : function( evt ) {
			var
			self = evt.data.self;

			self.$nav_next.removeClass( 'focus' );
			self.$nav_prev.removeClass( 'focus' );
		},

		/**
		 * @param {Event} evt
		 * jQuery Event
		 */
		navArrowReveal : function( evt ) {
			var
			self = evt.data.self;

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
			this.$carousel_ul.css( 'width', this.attributes.total_width );
		},

		/**
		 * toggle display of nav arrows
		 */
		toggleNavArrows : function() {
			if ( this.$nav_prev ) {
				if ( this.attributes.current_item_index === 0 ) {
					this.$nav_prev.fadeOut();
				} else if ( this.$nav_prev.is(':hidden') ) {
					this.$nav_prev.fadeIn();
				}
			}

			if ( this.$nav_next ) {
				if ( this.attributes.current_item_index >= this.attributes.item_total - 1 ) {
					this.$nav_next.fadeOut();
				} else if ( this.$nav_next.is(':hidden') ) {
					this.$nav_next.fadeIn();
				}
			}
		},

		validateNewNav: function() {
			var
			max_width =
				-1 *
				(
					this.attributes.total_width -
					this.attributes.container_width -
					1 // to deal with the hack in calculateTotalWidth
				);

			// validate index
			if ( this.new_nav.index > this.attributes.items_last_index ) {
				this.new_nav.index = this.attributes.items_last_index;
			} else if ( this.new_nav.index < 0 ) {
				this.new_nav.index = 0;
			}

			// validate width
			if ( this.new_nav.width > 0 ) {
				this.new_nav.width = 0;
			} else if ( this.new_nav.width < max_width ) {
				this.new_nav.width = max_width;
			}
		}
	};

	/**
	 *
	 * @param {object} options
	 * @returns {*}
	 */
	$.fn.rCarousel = function( options ) {
		// the each cycles over the selectors provided, typically one, but more
		// than one could be provided, e.g. $('#carousel-1, #carousel-2').rCarousel()
		return this.each(function() {
			var rcarousel = Object.create( RCarousel );
			rcarousel.init( options, this );
			$(this).data( 'rCarousel', rcarousel );
		});
	};

}( jQuery ));
