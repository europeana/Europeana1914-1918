(function(){

	'use strict';
	//RunCoCo.GMap.Display.init('story-map');
	
	jQuery('#image-viewer').elastislide({
		imageW : jQuery('#image-viewer div > ul').eq(0).outerWidth(true) - 4,
		border : 0,
		margin : 0,
		onClick : function( $item ) { return true; }
	});
	
	
	jQuery('#thumbnail-viewer').elastislide({
		imageW : jQuery('#thumbnail-viewer').eq(0).outerWidth(true),
		border : 0,
		margin : 0,
		onClick : function( $item ) { return true; }
	});
	
}());