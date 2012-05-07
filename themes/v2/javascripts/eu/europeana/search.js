(function( undefined ) {
	
	'use strict';
	
	
	function init() {
		
		var $container = jQuery('#stories');
		
		$container.imagesLoaded(function() {
			$container.masonry({
				itemSelector : 'li',
				columnWidth : 1,
				isFitWidth : true,
				isAnimated : true
			});
		});
		
		jQuery('#q').autocomplete({
			minLength : 3,
			source : document.location.protocol + '//' + document.location.host + '/suggest.json',
			select: function(event, ui) { jQuery(this).closest('form').submit(); }
		});
		
	}
	
	init();
	
}());