(function(){
	
	'use strict';
	
	jQuery('#editors-picks').infinitescroll({
		navSelector  	: '.next-article',
		nextSelector 	: '.next-article',
		itemSelector 	: 'article',
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