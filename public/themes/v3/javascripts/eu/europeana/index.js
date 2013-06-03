(function() {
	
	'use strict';
	
	/*
	$('#index-featured').imagesLoaded(function() {
		this.rCarousel();
	});
	*/	
	
	$('#news-articles').readMore({ read_more_link : '#read-more' });

	
	


	/* event debouncing () */
	/* Andy: TODO move this into its own file */

	(function($,sr){

		var debounce = function (func, threshold, execAsap) {
			var timeout;
			return function debounced () {
				var obj = this, args = arguments;
				function delayed () {
					if (!execAsap)
						func.apply(obj, args);
						timeout = null;
					};
		
					if (timeout){
						clearTimeout(timeout);
					}
					else if (execAsap){
						func.apply(obj, args);
					}
		
					timeout = setTimeout(delayed, threshold || 100);
				};
			};
	
			// smartresize 
		jQuery.fn[sr] = function(fn){	return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };
		jQuery.fn['euScroll'] = function(fn){	return fn ? this.bind('scroll', debounce(fn)) : this.trigger(sr); };

	})(jQuery,'euRsz');



	var minGutterWidth		= 8;
	var cellWidth			= 235;
	
	var masonryResize = function(){
		var self = $('#featured-categories');
		
		/* Featured category images are always the same size, so a fixed column width is always returned.
		 * 
		 * This function is used not to calculate the column width, but to force the gutterWidth to update according to amount of columns that are present.
		 * 
		 */
		
		var ul		= self.find('ul');
		var items	= self.find('.item');
		
		var centre = function(usedSpace){
			ul.css('margin', 'auto');
			ul.css('width', usedSpace + 'px');
			self.css('width', (usedSpace + 4) + 'px');
		}
		
		var uncentre = function(){
			ul.css('width', 'auto'); 
			self.css('width', '100%');
		}
		
		var justify = function(gutterWidth){
			self.masonry( 'option', {"gutterWidth": gutterWidth} );
		}
		
		var unjustify = function(){
			self.masonry( 'option', { "gutterWidth" : minGutterWidth} );
		}
		
		uncentre();
		unjustify();
		
		var containerWidth 		= self.width();
		var minGutterWidthTotal	= 0;
		var mobileView			= $('.icon-mobilemenu').is(':visible');
		var maxFit				= parseInt(containerWidth / (cellWidth + minGutterWidth));
		var usedSpace			= (maxFit * cellWidth) + ((maxFit -1) * minGutterWidth);
		var leftover			= containerWidth - usedSpace;
			
			
		// use the leftover space to increase gutters to centre the column if viewing on a mobile device.
			
		if(maxFit == 1){
			centre(usedSpace);		// mobile view always assumed - centre the single column
		}
		else if(maxFit == 2){
			if(mobileView){						
				centre(usedSpace);
			}
			else{
				justify(leftover);
			}
		}
		else{			
			justify(parseInt(leftover / (maxFit - 1)));
		}
		self.masonry('reload');
	};

	$('#featured-categories').imagesLoaded(function() {
		$(this).masonry({
			itemSelector:  'li',
			columnWidth:   cellWidth, 
			gutterWidth:   minGutterWidth,
			isAnimated :   true
		});		

		$(window).euRsz(function(){
			masonryResize();
		});
		
		masonryResize();
	});

	js.utils.initSearch();
	
}());