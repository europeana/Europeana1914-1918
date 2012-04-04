(function(){
	
	'use strict';
	
	jQuery('#image-viewer').elastislide({
		imageW : jQuery('#image-viewer div > ul').eq(0).outerWidth(true) - 4,
		border : 0,
		margin : 5,
		onClick : function( $item ) { return true; }
	});
	
	
	jQuery('#thumbnail-viewer').elastislide({
		imageW : jQuery('#thumbnail-viewer li').eq(0).outerWidth(true),
		border : 0,
		margin : 0,
		onClick : function( $item ) { return true; }
	});
	
	
}());