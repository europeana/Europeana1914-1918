(function() {
	
	'use strict';
	if ( !window.RunCoCo ) { window.RunCoCo = {}; }
	
	
	RunCoCo.fieldsetButtons = {		
		
		$collapse : null,
		$open : null,
		
		
		handleButtonClick : function( evt ) {
			
			var self = evt.data.self,
					action = jQuery(this).data('action');
			
			
			jQuery('.formtastic > fieldset > legend').each(function() {
				
				var $legend = jQuery(this),
						$fieldset = $legend.closest('fieldset'),
						collapsed = $fieldset.hasClass('collapsed');
				
				if ( 'open' === action && collapsed ) {
					
					$legend.trigger('click');
					
				} else if ( 'collapse' === action && !collapsed ) {
					
					$legend.trigger('click');
					
				}
				
			});
			
		},
		
		
		addButtons : function() {
			
			var self = this;
			
			self.$open.add( self.$collapse ).insertAfter( jQuery('.action-links') );
			self.$open.add( self.$collapse ).on( 'click', { self : self }, self.handleButtonClick );
			
		},
		
		
		createButtons : function() {
			
			this.$open = jQuery('<button/>', { 'data-action' : 'open', text : 'open all' });
			this.$collapse = jQuery('<button/>', { 'data-action' : 'collapse',text : 'close all' });
			
		},
		
		
		init : function() {
			
			this.createButtons();
			this.addButtons();
			
		}
		
	};
	
}());