(function() {
	
	'use strict';
	
	
	function init() {
		
		jQuery('#explore-featured').rCarousel();
		jQuery('#explore-collection-days').rCarousel({ item_width_is_container_width : false, nav_button_size : 'small' });
		jQuery('#explore-editors-picks').readMore({ read_more_link : '#read-more' });
		
		var $container = jQuery('#explore-featured-categories ol');
		$container.imagesLoaded(function() {
			$container.masonry({
				itemSelector : 'li',
				columnWidth : 1,
				isFitWidth : true,
				isAnimated : true
			});
		});
		
	}
	
	init();
	
}());