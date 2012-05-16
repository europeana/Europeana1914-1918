(function() {
	
	'use strict';
	
	var $navigation_mobile = jQuery('#navigation-mobile'),
			$navigation_user = jQuery('#navigation-user'),
			$navigation_user_menu = jQuery('#navigation-user-menu'),
			$navigation_main = jQuery('#navigation-main'),
			resizeTimer;
	
	
	$.fn.fadeSlideToggle = function(speed, fn) {
		
		return $(this).animate({
			'height': 'toggle',
			'opacity': 'toggle'
		}, speed || 400, function() {
			$.isFunction(fn) && fn.call(this);
		});
		
	};
	
	function handleWindowResize() {
		
		if ( jQuery(window).width() >= 768 ) {
			
			if ( !$navigation_user.is(':visible') ) {
				
				$navigation_user.add( $navigation_main ).add( $navigation_user_menu ).fadeSlideToggle(500);
				
			}
			
		}
		
	}	
	
	function handleClick( evt ) {
		
		evt.stopPropagation();
		
		if ( jQuery(window).width() >= 768 ) {
			
			return;
			
		}
		
		if ( this.id === 'navigation-mobile' ) {
			
			if ( !$navigation_user.is(':visible') ) {
				
				$navigation_user.add( $navigation_main ).add( $navigation_user_menu ).fadeSlideToggle(500);
				$navigation_mobile.fadeToggle();
				
			}
			
		} else {
			
			if ( $navigation_user.is(':visible') ) {
				
				$navigation_user.add( $navigation_main ).add( $navigation_user_menu ).fadeSlideToggle(500);
				$navigation_mobile.fadeToggle();
				
			}
			
		}
		
	}
	
	$navigation_mobile.add(document).on('click', handleClick);
	
	if ( $navigation_user_menu.length === 1 ) {
		$navigation_main.css('top','258px');
	}
	
	jQuery(window).on('resize', function() {
		
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout( function() { handleWindowResize(); }, 100 );
		
	});
	
}());