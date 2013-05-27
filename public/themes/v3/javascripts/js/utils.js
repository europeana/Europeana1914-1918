(function() {
	
	'use strict';
	if ( !window.js ) { window.js = {}; }
	
	
	js.utils = {
		
		flashHighlight : function( $elm, start_color, end_color, duration ) {
			
			$elm.css( 'background-color', start_color );
			setTimeout( function() { $elm.css('background-color', end_color ); }, duration );
			
		},
		
		initSearch : function(){
			//$('.submit-cell').css("width",	$('.submit-cell button')	.outerWidth(true) + "px"); 
			//$('.menu-cell').css("width",	$('#search-menu')				.outerWidth(true) + "px");
			
			$('.submit-cell button').css("border-left",	"solid 1px #4C7ECF");	// do this after the resize to stop 1px gap in FF
			
			$("table.t-query").css("display",		"none");
			$("table.t-query").css("visibility",	"visible");
			$("table.t-query").fadeIn(600);
			
			$('#q').focus(function(){
				$('.query-cell').addClass('glow');
			});
			
			$('#q').blur(function(){
				$('.query-cell').removeClass('glow');
			});
		}
		
	};
	
	
}());