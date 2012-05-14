/**
 * jQuery Plugin to obtain touch gestures from iPhone, iPod Touch and iPad, should also work with Android mobile phones (not tested yet!)
 * Common usage: wipe images (left and right to show the previous or next image)
 * 
 * @author Andreas Waltl, netCU Internetagentur (http://www.netcu.de)
 * @version 1.1.1 (9th December 2010) - fix bug (older IE's had problems)
 * @version 1.1 (1st September 2010) - support wipe up and wipe down
 * @version 1.0 (15th July 2010)
 */
(function() {
	
	'use strict';
	
	
  jQuery.fn.touchwipe = function(settings) {
		
		var $target = this,
				config = {
					min_move_x: 20,
					min_move_y: 20,
					wipeLeft: function() { },
					wipeRight: function() { },
					wipeUp: function() { },
					wipeDown: function() { }
				};
    
		
    if (settings) {
			
			jQuery.extend(config, settings);
			
		}
		
    $target.each(function() {
			
			var $elm = jQuery(this),
					startX,
					startY,
					isMoving = false;
			
			
			function cancelTouch() {
				
				$elm.off( 'touchmove' );
				startX = null;
				isMoving = false;
				
			}
			
			function onTouchMove( evt ) {
				
				if ( isMoving ) {
					
					var x = evt.touches[0].pageX,
							y = evt.touches[0].pageY,
							dx = startX - x,
							dy = startY - y;
					
					
					if ( Math.abs(dx) >= config.min_move_x ) {
						
						cancelTouch();
						
						if ( dx > 0 ) {
							
							config.wipeLeft( evt );
							
						} else {
							
							config.wipeRight( evt );
							
						}
						
					} else if ( Math.abs(dy) >= config.min_move_y ) {
						
						cancelTouch();
						
						if ( dy > 0 ) {
							
							config.wipeDown( evt );
							
						} else {
							
							config.wipeUp( evt );
							
						}
						
					}
					
				}
				
			}
			
			function onTouchStart( evt ) {
				
				if ( !evt.touches ) { return; }
				
				if ( evt.touches.length === 1 ) {
					
					startX = evt.touches[0].pageX;
					startY = evt.touches[0].pageY;
					isMoving = true;
					$elm.on( 'touchmove', onTouchMove );
					
				}
				
			}
			
			if ( 'undefined' !== typeof document.documentElement.ontouchstart ) {
				
				$elm.on( 'touchstart', onTouchStart );
				
			}
			
		});
		
		return this;
		
  };
 
}());
