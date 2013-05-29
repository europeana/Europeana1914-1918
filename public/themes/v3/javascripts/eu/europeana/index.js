(function() {
	
	'use strict';
	
	
	$('#index-featured').imagesLoaded(function() {
		this.rCarousel();
	});	
	
	$('#news-articles').readMore({ read_more_link : '#read-more' });

	
	$('#featured-categories').imagesLoaded(function() {
		
		$(this).masonry({
			itemSelector : 'li',
			columnWidth : function( containerWidth ) {
				
				var winWidth = $('html').width();

				if(winWidth < 500){
					$('#featured-categories ul').css('width', $('#featured-categories ul img:first').width() + 'px');
					
					return parseInt(containerWidth) - parseInt((2 * 8) );			// (container-w / noCols) - (( (noCols -1 + 2 (edges)) * gutterWidth ) / noCols)
				}
				else{
					$('#featured-categories ul').css('width', 'auto');
				}
				if(winWidth < 1130){
					return parseInt(containerWidth / 2) - parseInt((3 * 8) / 2);	// (container-w / noCols) - (( (noCols -1 + 2 (edges)) * gutterWidth ) / noCols)
				}
				else{
					return parseInt(containerWidth / 3) - parseInt((4 * 8) / 3);	// (container-w / noCols) - (( (noCols -1 + 2 (edges)) * gutterWidth ) / noCols)					
				}
					
			},
			gutterWidth:	8,
			isAnimated :	true
		});		

	});	

	
	js.utils.initSearch();
	
}());