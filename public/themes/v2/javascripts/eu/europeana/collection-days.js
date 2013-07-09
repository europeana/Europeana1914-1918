(function(){
	
	'use strict';
	
	jQuery('#collection-days').elastislide({
		imageW : jQuery('#collection-days li').eq(0).outerWidth(true) - 4,
		border : 0,
		margin : 5,
		onClick : function( $item ) { return true; }
	});	
	
}());