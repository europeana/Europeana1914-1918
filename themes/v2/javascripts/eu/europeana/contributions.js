(function(){

	'use strict';
	
	
	function lightBoxIt( $elm, data ) {
		$elm.before( '<div class="item-metadata">' + JSON.stringify(data) + '</div>' );
	}
	
	function handleImageViewerImageClicks( evt ) {
		
		evt.preventDefault();
		var $elm = jQuery(this),
			json_url = '/' + I18n.locale + '/contributions/' + $elm.attr('data-contribution-id') + '/attachments/' + $elm.attr('data-attachment-id') + '.json';
		
		jQuery.ajax({
			url : json_url,
			success : function( data, textStatus, jqXHR ) { lightBoxIt( $elm, data ) },
			error : function() {},
			complete : function() {},
			timeout : function() {},
			dataType : 'json'
		});
		
	}
	
	
	if ( jQuery('#location-map').length > 0 ) {
		
		jQuery('#location-map').hide();
		// setTimeout( function() { RunCoCo.GMap.Display.init('story-map'); }, 1000 );
		
	} else {
		
		jQuery('#location-map').hide();
		
	}
	
	jQuery('#image-viewer').elastislide({
		imageW : jQuery('#image-viewer div > ul').eq(0).outerWidth(true) - 4,
		border : 0,
		margin : 0,
		onClick : function( $item ) { return true; },
		complete : function() { setTimeout( function() { jQuery('#image-viewer div.es-carousel').removeClass('opacity-0'); }, 1000); }
	});
	
	
	jQuery('#thumbnail-viewer').elastislide({
		imageW : jQuery('#thumbnail-viewer li').eq(0).outerWidth(true),
		border : 0,
		margin : 5,
		onClick : function( $item ) { return true; },
		complete : function() { console.log('my callback'); }
	});
	
	jQuery('#image-viewer ul a').each(function(){
		jQuery(this).bind('click', handleImageViewerImageClicks);
	});
	
}());