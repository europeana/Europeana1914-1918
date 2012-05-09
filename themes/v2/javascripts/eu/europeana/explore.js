(function() {
	
	'use strict';	
	
	
	jQuery('#explore-featured').rCarousel();
	
	jQuery('#explore-collection-days')
		.rCarousel({
			listen_to_arrow_keys : false,
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
	
	jQuery('#q').autocomplete({
		minLength : 3,
		source : document.location.protocol + '//' + document.location.host + '/suggest.json',
		select: function(event, ui) { var self = this; setTimeout( function() { jQuery(self).closest('form').submit(); }, 100 ); }
	});
	
	
}());