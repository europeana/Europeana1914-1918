(function( undefined ) {
	
	'use strict';
	
	
	function init() {
		
		jQuery('#explore-featured').rCarousel();
		jQuery('#explore-editors-picks').readMore({ read_more_link : '#read-more' });
		
	}
	
	init();
	
}());