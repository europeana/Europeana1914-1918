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
			select: function(event, ui) { var self = this; setTimeout( function() { jQuery(self).closest('form').submit(); }, 100 ); }
		});
		
		jQuery('#results-tabs').tabs({ 
		  ajaxOptions: { data: 'layout=0' }, 
		  selected: RunCoCo.uiTabSelected,
		  select: function(event, ui) { 
		    if (ui.index == 1) {
		      var searchFormAction = RunCoCo.relativeUrlRoot + '/' + I18n.currentLocale() + '/europeana/search';
		    } else {
		      var searchFormAction = RunCoCo.relativeUrlRoot + '/' + I18n.currentLocale() + '/search';
		    }
		    jQuery('#search').attr('action', searchFormAction);
	    },
	  });
	}
	
	init();
	
}());
