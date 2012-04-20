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
		// $nav : null,
		
		carousel_width : 0,
		item_width : 0,
		items_length : 0,
		items_total_width : 0,
		current : 1,
		
		
		transition : function( $container, loc, dir ) {
			
			var unit;
			
			if ( dir && loc != 0) {
				unit = ( dir === 'next' ) ? '-=' : '+=';
			}
			
			$container.animate(
				{ 'margin-left' : unit ? (unit + loc) : loc }
			);
			
		},
		
		
		handleWindowResize : function( evt ) {
			
			var self = evt.data.self;
			//clearTimeout(this.id);
			//this.id = setTimeout(resizeItems, 500);
			self.resizeItems({ data : { self : self } });
			
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
			
			var $elm = jQuery(this),
					self = evt.data.self,
					dir = $elm.data('dir'),
					loc = self.item_width;
			
			
			dir === 'next'
				? self.current += 1
				: self.current -= 1;
			
			// if first image
			if ( self.current === 0 ) {
				
				self.current = self.items_length;
				dir = 'next';
				loc = self.items_total_width - self.item_width;
				
			} else if ( self.current - 1 === self.items_length ) {
				
				self.current = 1;
				loc = 0;
				
			}
			
			self.transition( self.$carousel_ul, loc, dir );
			
		},
		
		
		addNavigation : function() {
			
			var self = this;
			//self.$nav.append( $prev, $next ).insertAfter( $carousel_container );
			self.$carousel_container.append( self.$prev, self.$next );
			self.$prev.add( self.$next ).on( 'click', { self : self }, self.handleNavClick );
			
			if ( self.options.listen_to_arrows ) {
				
				jQuery(document).bind('keyup', { self : self }, self.handleKeyUp );
				
			}
			
		},
		
		
		calculateDimmensions : function() {
			
			var self = this;
			self.item_width = self.$carousel_container.width();
			self.items_length = self.$items.length;
			self.items_total_width = self.items_length * self.item_width;
			self.$carousel_ul.css( 'width', self.items_total_width );
			
		},
		
		
		resizeItems : function( evt ) {
			
			var self = evt.data.self;
					self.calculateDimmensions();
			
			self.$items.each(function() {
				
				var $item = jQuery(this);
				$item.css('width', self.item_width );
				
			});
			
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
			
			//self.$prev = jQuery('<button/>', { 'data-dir' : 'prev', text : 'previous' }),
			//self.$next = jQuery('<button/>', { 'data-dir' : 'next', text : 'next' }),
			self.$prev = jQuery('<input/>', { 'data-dir' : 'prev', type : 'image', alt : 'previous', src : '/themes/v2/images/icons/carousel-arrow-left.png' });
			self.$next = jQuery('<input/>', { 'data-dir' : 'next', type : 'image', alt : 'next', src : '/themes/v2/images/icons/carousel-arrow-right.png' });
			// self.$nav = jQuery('<div/>', { class : 'carousel-nav' });
			
		},
		
		
		init : function( options, carousel_container ) {
			
			var self = this;
			
			self.options = $.extend( {}, $.fn.rCarousel.options, options );
			self.createNavElements();
			self.deriveCarouselElements( carousel_container );
			self.resizeItems({ data : { self : self } });
			jQuery(window).on( 'resize', { self : self }, self.handleWindowResize );
			
			if ( self.$items.length > 1 ) { self.addNavigation(); }
			
			self.$overlay.fadeOut();
			
		}
		
	};
	
	
	jQuery.fn.rCarousel = function( options ) {
		
		return this.each(function() {
			
			var rcarousel = Object.create( RCarousel );
			rcarousel.init( options, this );
			
		});
		
	};
	
	
	jQuery.fn.rCarousel.options = {
		listen_to_arrows : true
	};
	
	
}());