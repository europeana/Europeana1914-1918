(function() {
	
	'use strict';


	var submit = {
		
		interval : undefined,
		
		
		checkHash: function() {
			
			var hash = window.location.hash,
				$attachment_upload = jQuery('#attachment_upload');
			
			
			if ( hash && '#submit' === hash ) {
				
				if ( !$attachment_upload.hasClass('collapsed') && !$attachment_upload.hasClass('collapsible') ) {
					
					$attachment_upload.addClass('collapsed');
					$attachment_upload.collapse( { closed: true } );
					
				}
				
				if ( !$attachment_upload.hasClass('collapsed') ) {
					
					$attachment_upload.find("legend:first").trigger('click');
					
				}
				
				window.location.hash = '';
				
			}
			
			if ( hash && '#attachment_upload' === hash ) {
				
				if ( $attachment_upload.hasClass('collapsed') ) {
					
					$attachment_upload.find("legend:first").trigger('click');
					
				}
				
				window.location.hash = '';
				
			}
			
		},
		
		
		init: function() {
			
			submit.interval = setInterval( submit.checkHash, 100 );
			
		}
		
	}
	
	submit.init();

}());