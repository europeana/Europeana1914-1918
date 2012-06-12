(function() {
	
	'use strict';
	
	
	jQuery('#index-featured').imagesLoaded(function() {
		this.rCarousel();
	});	
	
	jQuery('#news-articles').readMore({ read_more_link : '#read-more' });
	jQuery('video').video();
	
}());