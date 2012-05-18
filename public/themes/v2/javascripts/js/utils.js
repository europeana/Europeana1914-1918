(function() {
	
	'use strict';
	if ( !window.js ) { window.js = {}; }
	
	
	js.utils = {
		
		flashHighlight : function( $elm, start_color, end_color, duration ) {
			
			$elm.css( 'background-color', start_color );
			setTimeout( function() { $elm.css('background-color', end_color ); }, duration );
			
		}
		
	};
	
	
}());