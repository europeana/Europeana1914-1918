(function(){
	
	'use strict';
	
	jQuery('#collection-days').elastislide({
		imageW : jQuery('#collection-days li').eq(0).outerWidth(true) - 4,
		border : 0,
		margin : 5,
		onClick : function( $item ) { return true; }
	});
	
	
	jQuery('#stories-from-the-archive').elastislide({
		imageW : jQuery('#stories-from-the-archive div > ul').eq(0).outerWidth(true),
		border : 0,
		margin : 0,
		onClick : function( $item ) { return true; }
	});
	
	
}());