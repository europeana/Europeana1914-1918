/**
 *	@author dan entous <contact@gmtplusone.com>
 *	@version 2012-05-19 16:19 gmt +1
 */
(function() {

	'use strict';	
	
	if ( 'function' !== typeof Object.create ) {
		
		Object.create = function( obj ) {
			
			function F() {}
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
		carousel_pages : 0,
		carousel_current_page : 0,
		
		item_width : 0,
		items_length : 0,
		items_total_width : 0,
		items_per_container : 0,
		
		current_item_index : 0,
		orientation : window.orientation,
		
		
		/**
		 *	helper function for external scripts
		 */
		get : function( property ) {
			
			return this[property];
			
		},
		
		
		transition : function( coords ) {
			
			this.$carousel_ul.animate({
				'margin-left': coords || -( this.current_item_index * this.item_width )
			});
			
		},		
		
		
		/**
		 *	helper function for external scripts
		 */
		goToIndex : function( index ) {
			
			this.current_item_index = index;
			this.transition();
			this.toggleNav();
			
		},
		
		
		determinePageInfo : function( current_item_index, items_per_container ) {
			
			current_item_index = current_item_index || this.current_item_index;
			items_per_container = items_per_container || this.items_per_container;
			
			var nr_of_pgs = this.items_length / items_per_container,
					current_page_nr = current_item_index / items_per_container,
					page_first_item_index = current_page_nr * items_per_container;
			
			
			return {
				current_item_index : current_item_index,
				items_per_container : items_per_container,
				nr_of_pgs : nr_of_pgs,
				current_page_nr : current_page_nr,
				page_first_item_index : page_first_item_index
			};
			
		},
		
		
		toggleNav : function() {
			
			var page_info = this.determinePageInfo();
			
			
			if ( this.current_item_index == 0 ) {
				
				this.$prev.fadeOut();
				
			} else if ( this.$prev.is(':hidden') ) {
				
				this.$prev.fadeIn();
				
			}
			
			if ( this.current_item_index === this.items_length - 1
					 || page_info.nr_of_pgs === page_info.current_page_nr + 1
			) {
				
				this.$next.fadeOut();
				
			} else if ( this.$next.is(':hidden') ) {
				
				this.$next.fadeIn();
				
			}
			
		},
		
		
		navigationOneWay : function( dir ) {
			
			var pos = dir === 'next' ? this.items_per_container : -1 * this.items_per_container;
			
			
			if ( this.current_item_index + pos < this.items_length
					 && this.current_item_index + pos >= 0 ) {
				
				this.current_item_index = this.current_item_index + pos;
				
			}			
			
			this.toggleNav();
			
		},
		
		
		navigationRewind : function( dir ) {
			
			var pos = previous_index = this.current_item_index;
			
			
			if ( !this.options.item_width_is_container_width ) {
				
				pos = dir === 'next' ? this.items_per_container : -1 * this.items_per_container;				
				
				this.current_item_index = this.current_item_index + pos;
				
				
				if ( this.current_item_index >= this.items_length ) {
					
					this.current_item_index = 0;
					
				}
				
				if ( this.current_item_index < 0 ) {
					
					if ( previous_index !== 0 ) {
						
						this.current_item_index = 0;
						
					} else {
						
						this.current_item_index = this.items_length - this.items_per_container;
						
					}
					
				}
				
			} else {
				
				pos += ( ~~( dir === 'next' ) || -1 );
				this.current_item_index = ( pos < 0 ) ? this.items_length - 1 : pos % this.item_width;
				if ( pos >= this.items_length ) { this.current_item_index = 0; }
				
			}
			
		},
		
		
		setCurrentItemIndex : function( dir ) {
			
			switch ( this.options.navigation_style ) {
				
				case 'rewind' :
					this.navigationRewind( dir );
					break;
				
				default :
					this.navigationOneWay( dir );
					break;
				
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
			
			
			if ( 'function' === typeof self.options.callbacks.before_nav ) {
				
				self.options.callbacks.before_nav.call( this, dir );
				
			}
			
			self.setCurrentItemIndex( dir );
			self.transition();
			
			if ( 'function' === typeof self.options.callbacks.after_nav ) {
				
				self.options.callbacks.after_nav.call( this, dir );
				
			}
			
		},
		
		
		createNavElements : function() {
			
			var self = this;
			
			self.$prev = jQuery('<input/>', {
				'type' : 'image',
				'class' : self.options.nav_button_size,
				'alt' : 'previous',
				'src' : '/themes/v2/images/icons/carousel-arrow-left.png',
				'style' : 'display: none;',
				'data-dir' : 'prev'
			});
			
			self.$next = jQuery('<input/>', {
				'type' : 'image',
				'class' : self.options.nav_button_size,
				'alt' : 'next',
				'src' : '/themes/v2/images/icons/carousel-arrow-right.png',
				'data-dir' : 'next'
			});
			
		},
		
		
		addNavigation : function() {
			
			var self = this;
			
			
			// return if no nav elements are needed
			
				if ( self.options.item_width_is_container_width ) {
					
					if ( self.$items.length < 1 ) { return; }
					
				} else {
					
					if ( self.$items.length < self.items_per_container ) { return; }
					
				}
			
			
			// create the nav elements
				
				self.createNavElements();
			
			
			// add nav elements to the carousel
				
				self.$carousel_container.append( self.$prev, self.$next );
			
			
			// add click listeners to the nav elements
				
				self.$prev.add( self.$next ).on( 'click', { self : self }, self.handleNavClick );
			
			
			// add keyboard arrow support
				
				if ( self.options.listen_to_arrow_keys ) {
					
					jQuery(document).bind('keyup', { self : self }, self.handleKeyUp );
					
				}
			
			
			// add touch swipe support
			// uses a modified version of http://www.netcu.de/jquery-touchwipe-iphone-ipad-library
				
				if ( jQuery().touchwipe ) {
					
					self.$items.each(function() {
						
						var $elm = jQuery(this),
								$iframe = $elm.find('iframe');
						
						$elm.touchwipe({
							wipeLeft : function( evt ) { evt.preventDefault(); self.$next.trigger('click'); },
							wipeRight : function( evt ) { evt.preventDefault(); self.$prev.trigger('click'); },
							wipeUp : function( evt ) {},
							wipeDown : function( evt ) {}
						});
						
						if ( $iframe.length > 0 ) {
							
							$iframe.touchwipe({
								wipeLeft : function( evt ) { evt.preventDefault(); self.$next.trigger('click'); },
								wipeRight : function( evt ) { evt.preventDefault(); self.$prev.trigger('click'); },
								wipeUp : function( evt ) {},
								wipeDown : function( evt ) {}
							});
							
						}
						
					});
					
				}
			
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
		
		
		calculateDimmensions : function() {
			
			var self = this,
					pos = self.current_item_index === 0 ? 1 : self.current_item_index,
					new_margin_left = -( pos * self.item_width - self.item_width ),
					new_margin_right = '',
					page_info;
			
			
			self.items_length = self.$items.length;
			self.carousel_container_width = self.$carousel_container.width();
			self.item_width = self.getItemWidth();
			
			self.items_total_width = self.items_length * self.item_width;
			self.items_per_container = Math.floor( self.carousel_container_width / self.item_width );
			
			self.carousel_pages = Math.ceil( self.items_length / self.items_per_container );			
			
			if ( !self.options.item_width_is_container_width
					&& self.$items.length <= self.items_per_container ) {
				
				new_margin_left = 'auto';
				new_margin_right = 'auto';
				
			}
			
			self.$carousel_ul.css({
				width : self.items_total_width,
				'margin-left' : new_margin_left,
				'margin-right' : new_margin_right
			});
			
		},
		
		
		setDimmensions : function( evt ) {
			
			var self = evt ? evt.data.self : this;
					self.calculateDimmensions();
			
			if (evt ) { console.log(evt.type); }
			self.$items.each(function() {
				
				var $item = jQuery(this);
				$item.css('width', self.item_width );
				
			});
			
		},
		
		
		addOrientationHandler : function() {
			
			var self = this;
			if ( 'undefined' === typeof window.orientation ) { return; }
			
			
			setInterval(
				function() {
					
					if ( window.orientation !== self.orientation ) {
						self.setDimmensions();
						self.orientation = window.orientation;
					}
					
				},
				1500
			);
			
		},
		
		
		addWindowResizeHandler : function() {
			
			if ( 'undefined' === typeof window.onresize
					 || 'undefined' !== typeof window.onorientationchange
			) {
				
				return;
			
			}
			
			jQuery(window).on( 'resize', { self : this }, this.setDimmensions );
			
		},
		
		
		deriveCarouselElements : function( carousel_container ) {
			
			this.carousel_container = carousel_container;
			this.$carousel_container = jQuery( carousel_container );
			this.$carousel_ul = this.$carousel_container.find('ul');
			this.$items = this.$carousel_container.find('li');
			this.$overlay = this.$carousel_container.find('.carousel-overlay');
			
		},
		
		
		init : function( options, carousel_container ) {
			
			var self = this;
			
			self.options = jQuery.extend( true, {}, jQuery.fn.rCarousel.options, options );
			self.deriveCarouselElements( carousel_container );
			self.setDimmensions();
			self.addNavigation();
			
			self.addWindowResizeHandler();
			self.addOrientationHandler();
			
			self.$overlay.fadeOut();
			
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
		item_width_is_container_width : true,
		nav_button_size : 'medium',
		navigation_style : 'one-way',
		callbacks : {
			before_nav : null,
			after_nav : null
		}
		
	};
	
	
}());