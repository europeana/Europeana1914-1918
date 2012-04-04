(function(){
	
	'use strict';
	
	jQuery('#stories-from-the-archive').elastislide({
		imageW : jQuery('#stories-from-the-archive div > ul').eq(0).outerWidth(true),
		border : 0,
		margin : 0,
		onClick : function( $item ) { return true; }
	});
	
	
}());