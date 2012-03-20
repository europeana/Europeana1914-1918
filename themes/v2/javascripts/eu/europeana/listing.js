(function(){
	
	'use strict';
	
	var $container = $('#stories');
    
    $container.imagesLoaded(function(){
      $container.masonry({
        itemSelector: '.story',
        columnWidth: 100,
		isAnimated: true
      });
    });
	
	$container.infinitescroll({
      navSelector  : '.pagination',    // selector for the paged navigation 
      nextSelector : '.next_page',  // selector for the NEXT link (to page 2)
      itemSelector : '.story',     // selector for all items you'll retrieve
      loading: {
          finishedMsg: 'No more pages to load.',
          img: '/images/europeana-theme/progress_bar/loading_animation.gif'
        }
      },
      // trigger Masonry as a callback
      function( newElements ) {
        // hide new items while they are loading
        var $newElems = $( newElements ).css({ opacity: 0 });
        // ensure that images load before adding to masonry layout
        $newElems.imagesLoaded(function(){
          // show elems now they're ready
          $newElems.animate({ opacity: 1 });
          $container.masonry( 'appended', $newElems, true ); 
        });
      }
    );
	
}());
