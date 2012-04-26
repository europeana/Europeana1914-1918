(function( undefined ) {
	
	'use strict';
	
	
	function init() {
		
		var $container = jQuery('#stories');
		
		$container.imagesLoaded(function() {
			$container.masonry({
				itemSelector : 'li',
				columnWidth : 93,
				isFitWidth : true,
				isAnimated : true
			});
		});
		
	}
	
	init();
	
}());