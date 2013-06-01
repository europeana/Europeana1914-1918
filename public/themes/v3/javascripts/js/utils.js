(function() {
	
	'use strict';
	if ( !window.js ) { window.js = {}; }
	
	
	js.utils = {
		
		flashHighlight : function( $elm, start_color, end_color, duration ) {
			
			$elm.css( 'background-color', start_color );
			setTimeout( function() { $elm.css('background-color', end_color ); }, duration );
			
		},
		
		initSearch : function(){
			
			$('.submit-cell').css("width",	$('.submit-cell button').outerWidth(true)-1 + "px"); 
			
			$('#q').focus(function(){
				$('.query-cell').addClass('glow');
			});
			
			$('#q').blur(function(){
				$('.query-cell').removeClass('glow');
			});
		}
		
	};
	
	
}());