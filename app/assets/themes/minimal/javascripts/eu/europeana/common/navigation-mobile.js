(function() {
	
	'use strict';
	
	
	jQuery.fn.fadeSlideToggle = function(speed, fn) {
		
		return jQuery(this).animate({
			'height': 'toggle',
			'opacity': 'toggle'
		}, speed || 400, function() {
			if ( jQuery.isFunction(fn) ) { fn.call(this); }
		});
		
	};
	
	
	var mobileMenu = {
		
		$navigation_mobile_trigger : jQuery('#navigation-mobile-trigger'),
		$navigation_mobile : jQuery('<ul>', { id : 'navigation-mobile' }),
		$navigation_user : jQuery('#navigation-user'),
		$navigation_user_menu : jQuery('#navigation-user-menu'),
		$navigation_main : jQuery('#navigation-main'),
		
		resizeTimer : 0,
		
		
		handleWindowResize : function() {
			
			if ( jQuery(window).width() >= 768 ) {
				
				if ( this.$navigation_mobile.is(':visible') ) {
					
					this.$navigation_mobile.fadeSlideToggle();
					
				}
				
			}
			
		},
		
		
		addWindowResizeHandler : function() {
			
			var self = this;
			
			if ( jQuery(window).width() < 768 ) { return; }
			
			jQuery(window).on('resize', function() {
				
				clearTimeout( self.resizeTimer );
				self.resizeTimer = setTimeout( function() { self.handleWindowResize(); }, 500 );
				
			});
			
		},
		
		
		handleClick : function(evt) {
			
			var self = evt.data.self,
					$elm = jQuery(this);
			
			
			evt.stopPropagation();
			
			if ( jQuery(window).width() >= 768 || this.id === undefined ) { return; }
			
			if ( this.id === 'navigation-mobile' && !self.$navigation_mobile_trigger.is(':visible') ) {
				
				$elm.fadeSlideToggle(500);
				
			} else if ( self.$navigation_mobile_trigger.is(':visible') ) {
				
				self.$navigation_mobile.fadeSlideToggle(500);
				
			}
			
		},
		
		
		createMobileMenu : function() {
			
			this.$navigation_mobile
				.append( jQuery('<ul>', { 'class' : 'menu' }).append( this.$navigation_user.find('li').clone() ) )
				.append( jQuery('<ul>', { 'class' : 'menu' }).append(this.$navigation_main.find('li').clone() ) )
				.append( jQuery('<ul>', { 'class' : 'menu' }).append(this.$navigation_user_menu.find('li').clone() ) )
				.on('click', { self : this }, this.handleClick);
			
			jQuery('body').prepend( this.$navigation_mobile );
			
		},
		
		
		init : function() {
			
			this.createMobileMenu();
			this.$navigation_mobile_trigger.add(document).on('click', { self : this }, this.handleClick);
			this.addWindowResizeHandler();
			
		}
		
		
	};
	
	mobileMenu.init();
	
	
}());