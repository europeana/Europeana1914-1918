(function() {

	'use strict';	
	
	if ( 'function' !== typeof Object.create ) {
		
		Object.create = function( obj ) {
			
			function F() {};
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
		current : 0,
		
		
		getTotal : function() {
			
			return this.items_length;
			
		},
		
		
		getCurrent : function() {
			
			return this.current + 1;
			
		},
		
		transition : function( coords ) {
			
			this.$carousel_ul.animate({
				'margin-left': coords || -( this.current * this.item_width )
			});
			
		},
		
		
		goToIndex : function( index ) {
			
			this.current = index;
			this.transition();
			
		},
		
		
		setCurrent : function( dir ) {
			
			var pos = this.current;
			
			if ( !this.options.item_width_is_container_width ) {
				
				pos = dir == 'next' ? this.items_per_container : -1 * this.items_per_container;				
				
				this.current = this.current + pos;
				if ( this.current >= this.items_length ) { this.current = 0; }
				if ( this.current < 0 ) { this.current = this.items_length - this.items_per_container; }
				
			} else {
				
				pos += ( ~~( dir === 'next' ) || -1 );
				this.current = ( pos < 0 ) ? this.items_length - 1 : pos % this.item_width;
				if ( pos >= this.items_length ) { this.current = 0; }
				
			}
			
			
			return pos;
			
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
					$elm = jQuery(this);
			
			
			self.setCurrent( $elm.data('dir') );
			self.transition();
			
		},
		
		
		addNavigation : function() {
			
			var self = this;
			
			self.$carousel_container.append( self.$prev, self.$next );
			self.$prev.add( self.$next ).on( 'click', { self : self }, self.handleNavClick );
			
			if ( self.options.listen_to_arrows ) {
				
				jQuery(document).bind('keyup', { self : self }, self.handleKeyUp );
				
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
				
				if ( self.$items.eq(i).width() > width ) {
					
					width = self.$items.eq(i).width();
					
				}
				
			}
			
			return width;
			
		},
		
		
		calculateDimmensions : function() {
			
			var self = this,
					pos = self.current == 0 ? 1 : self.current,
					new_margin_left = -( pos * self.item_width - self.item_width ),
					new_margin_right = '';
			
			self.items_length = self.$items.length;
			self.carousel_container_width = self.$carousel_container.width();
			self.item_width = self.getItemWidth();
			
			self.items_total_width = self.items_length * self.item_width;
			self.items_per_container = Math.floor( self.carousel_container_width / self.item_width );
			
			
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
		
		
		resizeItems : function( evt ) {
			
			var self = evt ? evt.data.self : this;
					self.calculateDimmensions();
			
			self.$items.each(function() {
				
				var $item = jQuery(this);
				$item.css('width', self.item_width );
				
			});
			
		},
		
		
		handleWindowResize : function( evt ) {
			
			var self = evt.data.self;
			self.resizeItems( evt );
			
		},
		
		
		deriveCarouselElements : function( carousel_container ) {
			
			var self = this;
			self.carousel_container = carousel_container;
			self.$carousel_container = jQuery( carousel_container );
			self.$carousel_ul = self.$carousel_container.find('ul');
			self.$items = self.$carousel_container.find('li');
			self.$overlay = self.$carousel_container.find('.carousel-overlay');
			self.id = self.carousel_container.id;
			
		},
		
		
		createNavElements : function() {
			
			var self = this;
			
			self.$prev = jQuery('<input/>', {
				type : 'image',
				class : self.options.nav_button_size,
				alt : 'previous',
				src : '/themes/v2/images/icons/carousel-arrow-left.png',
				'data-dir' : 'prev'
			});
			
			self.$next = jQuery('<input/>', {
				type : 'image',
				class : self.options.nav_button_size,
				alt : 'next',
				src : '/themes/v2/images/icons/carousel-arrow-right.png',
				'data-dir' : 'next'
			});
			
		},
		
		
		init : function( options, carousel_container ) {
			
			var self = this;
			
			self.options = $.extend( {}, $.fn.rCarousel.options, options );
			self.createNavElements();
			self.deriveCarouselElements( carousel_container );
			self.resizeItems();
			jQuery(window).on( 'resize', { self : self }, self.handleWindowResize );			
			
			if ( self.options.item_width_is_container_width ) {
				
				if ( self.$items.length > 1 ) { self.addNavigation(); }
				
			} else {
				
				if ( self.$items.length > self.items_per_container ) { self.addNavigation(); }
				
			}
			
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
		
		listen_to_arrows : true,
		item_width_is_container_width : true,
		nav_button_size : 'medium'
		
	};
	
	
}());