(function() {
	
	'use strict';
	
	/*
	$('#index-featured').imagesLoaded(function() {
		this.rCarousel();
	});
	*/	
	
	$('#news-articles').readMore({ read_more_link : '#read-more' });

	
	
	
	$('#featured-categories').imagesLoaded(function() {
		$(this).masonry({
			itemSelector : 'li',
			columnWidth : function( containerWidth ) {
				return 260;
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
			,isFitWidth :	true
		});		
		
	});
	
	
	$('#XXXfeatured-categories').imagesLoaded(function() {
		
		var gutterW	= 20;
		
		$(this).masonry({
			itemSelector : 'li',
			columnWidth : function( containerWidth ) {
				
				var imgW	= $('#featured-categories ul img:first').width();
				
				console.log("imgW = " + imgW );
				
				var maxFit = parseInt(  (containerWidth - gutterW) / (imgW + gutterW) );
				
				
				return parseInt(containerWidth / maxFit) - parseInt(((maxFit + 1) * 8) / maxFit);	// (container-w / noCols) - (( (noCols -1 + 2 (edges)) * gutterWidth ) / noCols)

				
				return (containerWidth-gutterW) / (maxFit);// - gutterW;
				
				console.log("maxFit = " + maxFit );
				
				// set ul width for centering
				
				//var ulWidth =  (maxFit * imgW) + ((maxFit + 1) * gutterW) ;
				//var ulWidth = containerWidth - ((maxFit * imgW) + (2 * gutterW)); //    ((maxFit + 1) * gutterW) ;
				//ulWidth = containerWidth - ulWidth;
				
				var padding = (containerWidth) % imgW;
				
				padding = padding - (maxFit - 1) * gutterW;
				padding = padding / 2;
				
				console.log("padding = " + padding );
				
				var ulWidth = (maxFit * imgW) +  padding;
				
				console.log("ulWidth = " + ulWidth );
				
				
				$('#featured-categories ul').css('width', ulWidth + 'px');
				 
				 
				// $('#featured-categories ul').css('height', '500px');
				// $('#featured-categories ul').css('background-color', 'red');
				 
//				 $('#featured-categories ul').css('margin-left', parseInt( (containerWidth - ulWidth) /2) + "px" );
				// $('#featured-categories ul').css('margin-left', parseInt(padding ) + "px" );
				 
				 console.log("margin-left = " + parseInt( (containerWidth - ulWidth) /2) + "px"    );
				 
				 
				 //$('#featured-categories ul').css('width', (maxFit * imgW) + 'px');

				var res = 235;// parseInt(containerWidth / maxFit) - parseInt(((maxFit + 1) * gutterW) / maxFit);	// (container-w / noCols) - (( (noCols -1 + 2 (edges)) * gutterWidth ) / noCols)
				//var res = parseInt(containerWidth / maxFit) - parseInt(((maxFit + 1) * gutterW) / maxFit);	// (container-w / noCols) - (( (noCols -1 + 2 (edges)) * gutterWidth ) / noCols)
				console.log("res = " + res);

				return 235;
				
				if(winWidth < 500){
					console.log("1 column");
					
					$('#featured-categories ul').css('width', $('#featured-categories ul img:first').width() + (2 * 8) + 'px');
					
					return parseInt(containerWidth) - parseInt((2 * 8) );			// (container-w / noCols) - (( (noCols -1 + 2 (edges)) * gutterWidth ) / noCols)
				}
//				else{
	//				alert("auto width on UL");
					
		//			$('#featured-categories ul').css('width', 'auto');
			//	}
				if(winWidth < 1130){
					
					console.log("2 column");

					$('#featured-categories ul').css('width', ($('#featured-categories ul img:first').width() * 2) +  (2 * 8) + 'px');

					return parseInt(containerWidth / 2) - parseInt((3 * 8) / 2);	// (container-w / noCols) - (( (noCols -1 + 2 (edges)) * gutterWidth ) / noCols)
				}
				else{
					
					console.log("3 columns");

					
					$('#featured-categories ul').css('width', ($('#featured-categories ul img:first').width() * 3) + (3 * 8) + 'px');
					
					return parseInt(containerWidth / 3) - parseInt((4 * 8) / 3);	// (container-w / noCols) - (( (noCols -1 + 2 (edges)) * gutterWidth ) / noCols)					
				}
				
				
					
			},
			gutterWidth:	gutterW,
			isAnimated :	true
			 ,isFitWidth :	true		/* sets the width on thew contaienr ( #featured-categories )  */
		});		

	});	

	
	js.utils.initSearch();
	
}());