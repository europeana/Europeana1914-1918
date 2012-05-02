(function() {
	
	'use strict';
	
	
	function init() {
		
		jQuery('#explore-featured').rCarousel();
		
		jQuery('#explore-collection-days')
			.rCarousel({
				item_width_is_container_width : false,
				nav_button_size : 'small'
			});
			
		jQuery('#explore-editors-picks')
			.readMore({
				read_more_link : '#read-more'
			});
		
		jQuery('#explore-featured-categories ol')
			.imagesLoaded(function() {
				jQuery(this).masonry({
					itemSelector : 'li',
					columnWidth : 1,
					isFitWidth : true,
					isAnimated : true
				});
			});
		
		//jQuery("#q").autocomplete({
		//	serviceUrl : '/suggest.json',
		//	minChars: 3,
		//	maxHeight : 100
		//});
		
	}
	
	init();
	
}());