/**
 *	@author dan entous <contact@gmtplusone.com>
 *	@version 2012-06-12 12:48 gmt +1
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
	
	
	var Video = {
		
		target : null,
		$target : null,
		$overlay : null,
		
		
		handleOverlayClick : function( evt ) {
			
			var self = evt.data.self;
			self.$overlay.fadeToggle();
			
			if ( self.target.paused ) {
				
				self.target.play();
				
			} else {
				
				if ( !self.$overlay.is(':visible') ) { self.$overlay.fadeToggle(); }
				self.target.pause();
				
			}
			
		},
		
		
		addOverlay : function() {
			
			this.$overlay =
				jQuery( '<div>', { 'class' : 'video-overlay'} )
					.append( jQuery( '<div>', { 'class' : 'video-overlay-button'} ) );
			
			this.$target.before( this.$overlay );
			this.$overlay.on('click', { self : this }, this.handleOverlayClick );
			
		},
		
		
		init : function( options, target ) {
			
			var self = this;
					self.target = target;
					self.$target = jQuery(target);
			
			self.$target.on( 'click', { self : this }, this.handleOverlayClick );
			this.options = jQuery.extend( true, {}, jQuery.fn.video.options, options );
			this.addOverlay();
			
		}
		
	};
	
	
	jQuery.fn.video = function( options ) {
		
		return this.each(function() {
			
			var video = Object.create( Video );
			video.init( options, this );
			
		});
		
	};
	
	
	jQuery.fn.video.options = {};
	
	
}());