/**
 *  truncate-content.js
 *
 *  @package    com.gmtplusone
 *  @author     dan entous <contact@gmtplusone.com>
 *  @created    2011-07-15 07:00 gmt +1
 *  @version    2012-04-26 03:10 gmt +1
 */

/**
 *  @package	com.gmtplusone
 *  @author		dan entous <contact@gmtplusone.com>
 */
(function() {
	
	'use strict';
	
	if ( 'function' !== typeof Object.create ) {
		
		Object.create = function( obj ) {
			
			function F() {};
			F.prototype = obj;
			return new F();
			
		};
		
	}
	
	
	var Truncate = {
		
		options : null,
		height : {},
		default_options : {
				limit : {
				pixels : 100,
				percent : .33,
				use_pixels : true
			}
		},
		
		
		handleToggleClick : function( evt ) {
			
			var self = evt.data.self,
					height = evt.data.height;
			
			
			evt.preventDefault();
			
			if ( self.$target.outerHeight(true) < self.height.total ) {
				
				self.$target.next().html( self.options.toggle_html.less );
				self.$target.next().removeClass( self.options.toggle_html.more_class );
				self.$target.next().addClass( self.options.toggle_html.less_class );
				self.$target.animate( { height: height.total }, 500 );
				
			} else {
				
				self.$target.next().html( self.options.toggle_html.more );
				self.$target.next().removeClass( self.options.toggle_html.less_class );
				self.$target.next().addClass( self.options.toggle_html.more_class );
				self.$target.animate( { height: height.truncated }, 500 );
				
			}
			
		},
		
		
		adjustHeight : function( height ) {
			
			var self = this;
			
			if ( self.height.total > self.height.truncated ) {
				
				self.$target
					.css({ height : self.height.truncated, overflow : 'hidden' })
					.slideDown()
					.after( self.options.toggle_html.container )
					.next()
					.html( self.options.toggle_html.more )
					.addClass( self.options.toggle_html.more_class )
					.on(
						'click',
						{ self : self, height : self.height }, 
						self.handleToggleClick
					);
				
			} else {
				
				self.$target.css('display', 'block' );
				
			}
			
		},
		
		
		getTruncatedHeight : function() {
			
			var self = this,
					truncated_height = 0;
			
				if ( self.options.limit.use_pixels ) {
					
					truncated_height =
						Math.floor( self.options.limit.pixels / self.height.line_height )
						* self.height.line_height;
					
				} else {
					
					truncated_height =
						Math.floor( self.height.total * self.options.limit.percent );
					
				}
			
			return truncated_height;
			
		},
		
		
		determineHeight : function() {
			
			var self = this;
			
			self.height.total = self.$target.outerHeight(true);
			self.height.line_height = parseInt( self.$target.css('line-height'), 10 );
			self.height.truncated = self.getTruncatedHeight();
			
		},
		
		
		prepOptions : function() {
			
			var self = this;
			
			self.options.limit.pixels =
				!isNaN( parseInt( self.options.limit.pixels, 10 ) )
					? parseInt( self.options.limit.pixels, 10 )
					: self.default_options.limit.pixels;
			
			self.options.limit.percent =
				!isNaN( parseFloat( self.options.limit.percent ) )
					? parseFloat( self.options.limit.percent )
					: self.default_options.limit.percent;
			
			self.options.limit.use_pixels =
				'boolean' === typeof self.options.limit.use_pixels
					? self.options.limit.use_pixels
					: self.default_options.limit.use_pixels;
			
		},
		
		init : function( options, target ) {
			
			var self = this;
					self.$target = jQuery(target);
			
			self.options = $.extend( {}, $.fn.truncate.options, options );
			
			self.prepOptions();
			self.determineHeight();
			self.adjustHeight( self.height );
			
			if ( self.options.callback ) { self.options.callback.call( $target ); }
			
		}
		
	};
	
	
	jQuery.fn.truncate = function( options ) {
		
		return this.each(function() {
			
			var truncate = Object.create( Truncate );
			truncate.init( options, this );
			
		});
		
	};
	
	
	jQuery.fn.truncate.options = {
		
		limit : {
			pixels : 100,
			percent : .33,
			use_pixels : true
		},
		
		toggle_html : {
			container : '<a href=""></a>',
			more : 'show more ...',
			less : 'show less ...',
			more_class : '',
			less_class : ''
		},
		
		callback : null
		
	};
	
	
}());