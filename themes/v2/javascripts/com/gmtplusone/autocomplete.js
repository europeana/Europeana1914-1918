(function() {
	
	'use strict';
	
	if ( 'function' !== typeof Object.create ) {
		
		Object.create = function( obj ) {
			
			function F() {}
			F.prototype = obj;
			return new F();
			
		};
		
	}
	
	
	// suggest.json?q=ord
	var AutoComplete = {
		
		$target : null,
		//options : null,
		options : {
			service_url : null,
			min_chars : 0,
			query_param : null,
			timeout : 0
		},
		
		
		handleAjaxError : function( jqXHR, textStatus, errorThrown ) {
			
		},
		
		
		handleAjaxSuccess : function( data, textStatus, jqXHR ) {
			
			// console.log( data );
			
		},
		
		
		getSuggestions : function( val ) {
			
			var self = this,
				query_param = self.options.query_param;
			
			if ( !self.options.service_url ) { return; }
			
			jQuery.ajax({
				url : self.options.service_url,
				type : 'GET',
				data : {  'q' : val },
				dataType : 'json',
				timeout : self.options.timeout,
				success: function( data, textStatus, jqXHR ) { self.handleAjaxSuccess( data, textStatus, jqXHR ); },
				error: function( jqXHR, textStatus, errorThrown ) { self.handleAjaxError( jqXHR, textStatus, errorThrown ); }
			});
			
		},
		
		
		handleKeyup : function( evt ) {
			
			var self = evt.data.self,
				$elm = jQuery(this),
				val = $elm.val(),
				keyCode = evt.keyCode;
			
			
			if ( val.length >= self.options.min_chars ) {
				
				self.getSuggestions( val );
				
			}
			
		},
		
		
		init : function( options, target ) {
			
			var self = this;
				self.$target = jQuery(target);
			
			self.options = jQuery.extend( {}, jQuery.fn.autoComplete.options, options );
			self.$target.on('keyup', { self : self }, self.handleKeyup );
			
		}
		
	};
	
	
	jQuery.fn.autoComplete = function( options ) {
		
		return this.each(function() {
			
			var autoComplete = Object.create( AutoComplete );
			autoComplete.init( options, this );
			jQuery(this).data( 'autoComplete', autoComplete );
			
		});
		
	};
	
	
	jQuery.fn.autoComplete.options = {
		service_url : null,
		min_chars : 3,
		query_param : 'q',
		timeout : 5000
	};
	
	
}());
