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
			
			var addGlow = function(){
				$('.query-cell').length > 0 ? $('.query-cell').addClass('glow') : $('#q').addClass('glow');
			};
			
			var removeGlow = function(){
				$('.query-cell').length > 0 ? $('.query-cell').removeClass('glow') : $('#q').removeClass('glow');
			};			

			var addError = function(){
				removeGlow();
				$('.query-cell').length > 0 ? $('.query-cell').addClass('error-border') : $('#q').addClass('error-border');
			};
			
			var removeError = function(){
				$('.query-cell').length > 0 ? $('.query-cell').removeClass('error-border') : $('#q').removeClass('error-border');
			};			
			
			$('#q').focus(function(){
				removeError();
				addGlow();
			});
			
			$('#q').blur(function(){
				removeGlow();
			});
			
			$('#q').closest('form').submit(function(){
				removeError();
				if(!$('#q').val().length){
					addError();
					return false;
				}
			})
		}
		
	};
	
	
}());