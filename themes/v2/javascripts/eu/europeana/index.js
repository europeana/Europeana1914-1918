(function(){
	
	'use strict';
	
	jQuery('#stories-from-the-archive').elastislide({
		imageW : jQuery('#stories-from-the-archive div > ul').eq(0).outerWidth(true),
		border : 0,
		margin : 0,
		onClick : function( $item ) { return true; }
	});
	
	
	jQuery('#news-articles').infinitescroll({
		navSelector  	: '.next-article',
		nextSelector 	: '.next-article',
		itemSelector 	: 'table',
		debug		 	: false,
		dataType	 	: 'html',
		
		loading: {
			finished: undefined,
			finishedMsg: "",
			img: "/themes/v2/images/icons/loading-animation.gif",
			msg: null,
			msgText: "",
			selector: null,
			speed: 'slow',
			start: undefined
		}
	});
	
}());