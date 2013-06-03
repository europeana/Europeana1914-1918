(function() {
	
	'use strict';
	
	/*
	$('#index-featured').imagesLoaded(function() {
		this.rCarousel();
	});
	*/	
	
	$('#news-articles').readMore({ read_more_link : '#read-more' });

	
	

	$('#featured-categories').imagesLoaded(function() {
		
		var minGutterWidth		= 8;
		var self				= $(this); 
		self.masonry({
			itemSelector : 'li',
			columnWidth : function( containerWidth ) {
				
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
					//setTimeout(function(){
					//	console.log("centre (@usedSpace = " + usedSpace + ")" );
						//self.masonry( 'option', { "isAnimated" : true} );
					//}, 1);
				}
				
				var uncentre = function(){
					//console.log("uncentre" );
					ul.css('width', 'auto'); 
				}
				
				var justify = function(gutterWidth){
					
					
					setTimeout(function(){							
						//console.log("justify (@gutterWidth = " + gutterWidth + ")" );
						
						self.masonry( 'option', {"gutterWidth": gutterWidth} );
						//self.masonry( 'reload' );
						//self.masonry( 'option', { "isAnimated" : true} );
					}, 1);
				}
				
				var unjustify = function(){
					setTimeout(function(){
						self.masonry( 'option', { "gutterWidth" : minGutterWidth} );
						//self.masonry( 'option', { "isAnimated" : false} );
					}, 1);
				}
				
				uncentre();
				unjustify();
				
				var cellWidth			= 235;
				var minGutterWidthTotal	= 0;
				var mobileView			= $('.icon-mobilemenu').is(':visible');
				var maxFit				= parseInt(containerWidth / (cellWidth + minGutterWidth));
				var usedSpace			= (maxFit * cellWidth) + ((maxFit -1) * minGutterWidth);
				var leftover			= containerWidth - usedSpace;
				
				
				// use the leftover space to increase gutters to centre the column if viewing on a mobile device.
				
				//console.log("containerWidth = " + containerWidth);
				//console.log("usedSpace = " + usedSpace);
				//console.log("leftover = " + leftover);
				//console.log("maxFit = " + maxFit);
				
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
				else{	// 3+					
					justify(parseInt(leftover / (maxFit - 1)));
				}
				
				
				
				setTimeout(function(){
					self.masonry( 'reload' );
				}, 1);

				
				return cellWidth;
			},
			gutterWidth:	minGutterWidth,
			isAnimated :	false
		});		
		
	});


	

	js.utils.initSearch();
	
}());