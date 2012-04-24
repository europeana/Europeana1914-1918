(function() {

	'use strict';	
	
	if ( 'function' !== typeof Object.create ) {
		
		Object.create = function( obj ) {
			
			function F() {};
			F.prototype = obj;
			return new F();
			
		};
		
	}
	
	
	var ReadMore = {
		
		options : null,
		$new_content : null,
		$loading_feedback : null,
		ajax_load_processed : true,
		
		
		addReadMoreTrigger : function( read_more_link ) {
			
			var self = this,
				$elm = read_more_link ? jQuery( read_more_link ) : jQuery( self.options.read_more_link );
			
			$elm.on( 'click', { self : self }, self.handleReadMoreClick );
			
		},
		
		
		handleContentLoad : function( responseText, textStatus, XMLHttpRequest ) {
			
			var self = this,
					i,
					ii;
			
			
			if ( self.ajax_load_processed ) { return; }
			self.$new_content = self.$new_content.children().get();
			
			for ( i = 0, ii = self.$new_content.length; i < ii; i += 1 ) {
				
				if ( '#' + self.$new_content[i].id === self.options.read_more_link ){
					
					self.addReadMoreTrigger( self.$new_content[i] );
					break;
					
				}
				
			}
			
			self.$target.append( self.$new_content );
			self.$loading_feedback.fadeToggle('slow');
			self.ajax_load_processed = true
			
		},
		
		
		retrieveContent : function( href ) {
			
			var self = this;
			
			if ( !href || !self.ajax_load_processed ) { return; }
			self.ajax_load_processed = false;
			self.$new_content = self.$target.is('table') ? jQuery('<tbody/>') : jQuery('<div/>');
			
			try {
				
				self.$new_content.load(
					href,
					null,
					function( responseText, textStatus, XMLHttpRequest ) {
						self.handleContentLoad( responseText, textStatus, XMLHttpRequest );					
					}				
				);
				
			} catch(e) {}
			
		},
		
		
		handleReadMoreClick : function( evt ) {
			
			var self = evt.data.self,
				$elm = jQuery(this);
			
			evt.preventDefault();
			self.$loading_feedback.fadeToggle('slow');
			$elm.fadeOut().remove();
			self.retrieveContent( $elm.attr('href') );
			
		},
		
		
		setupAjaxHandler : function() {
			
			jQuery(document).ajaxError(function( evt, XMLHttpRequest, jqXHR, textStatus ) {
				
				evt.preventDefault();
				// XMLHttpRequest.status == 404
				
			});
			
		},
		
		
		init : function( options, target ) {
			
			var self = this;
					self.$target = jQuery(target);
			
			self.options = $.extend( {}, $.fn.readMore.options, options );
			
			self.$loading_feedback = jQuery( self.options.loading_feedback );
			self.$target.prepend( self.$loading_feedback );
			self.setupAjaxHandler();
			self.addReadMoreTrigger();
			
		}
		
	};
	
	
	jQuery.fn.readMore = function( options ) {
		
		return this.each(function() {
			
			var readmore = Object.create( ReadMore );
			readmore.init( options, this );
			
		});
		
	};
	
	
	jQuery.fn.readMore.options = {
		
		read_more_link : '#read-more',
		loading_feedback : '<div id="loading-feedback"></div>'
		
	};
	
	
}());
	