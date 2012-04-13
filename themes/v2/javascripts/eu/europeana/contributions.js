(function(){

	'use strict';
	
	function buildMetaDataDiv( data ) {
		
		var i,
				html = '<div class="lightbox-metadata">',
				elements = [
					'title',
					'cover_image',
					'page_number',
					'object_side',
					'creator_given_name',
					'creator_family_name',
					'attachment_description',
					'lang',
					'lang_other',
					'content',
					'subject',
					'date',
					'date_from',
					'date_to',
					'location_placename',
					'location_map',
					'location_zoom',
					'keywords',
					'theatres',
					'forces',
					'source',
					'format',
					'page_total',
					'notes',
					'full_type',
					'license',
					'creator'
				];
		
		for ( i in elements ) {
			
			if ( elements.hasOwnProperty(i) ) {
				
				html += elements[i] + ' : ' + data.i + '<br/>';
				
			}
			
		}
		
		html += '<div>';
		
		return html;
		
	}
	
	
	function lightBoxIt( $elm, data ) {
		
		var image_width = parseInt( jQuery(document).width() * .5, 10 ) ,
				image_height = parseInt( jQuery(window).height() * .5, 10 ) ,
				//image_div = '<img src="' + $elm.attr('href') + '" width="' + image_width + '" class="lightbox-image" />',
				image_div = '<img src="' + $elm.attr('href') + '" height="' + image_height + '" class="lightbox-image" />';
		
		jQuery.colorbox({
			html : '<div style="width : 100%; min-width: 500px;">' + image_div + buildMetaDataDiv(data) + '</div>'
		});
		
	}
	
	function handleImageViewerImageClicks( evt ) {
		
		//evt.preventDefault();
		//var $elm = jQuery(this),
		//		json_url =	'/' + I18n.locale +
		//								'/contributions/' + $elm.attr('data-contribution-id') +
		//								'/attachments/' + $elm.attr('data-attachment-id') + '.json';
		//
		//jQuery.ajax({
		//	url : json_url,
		//	success : function( data, textStatus, jqXHR ) { lightBoxIt( $elm, data ) },
		//	error : function() {},
		//	complete : function() {},
		//	timeout : function() {},
		//	dataType : 'json'
		//});
		
	}
	
	
	if ( jQuery('#location-map').length > 0 ) {
		
		jQuery('#location-map').hide();
		setTimeout( function() { RunCoCo.GMap.Display.init('story-map'); }, 1000 );
		
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
	
	
	// http://stackoverflow.com/questions/2382994/how-to-check-if-any-javascript-event-listeners-handlers-attached-to-an-element-d
	// http://james.padolsey.com/javascript/debug-jquery-events-with-listhandlers/
	// http://stackoverflow.com/questions/446892/how-to-find-event-listeners-on-a-dom-node
	
	
	
	function handleMetaDataClick( evt ) {
		
		var $elm = jQuery(this),
				$metadata = jQuery( $elm.attr('href') ),
				$pic_holder = jQuery('#pp_full_res');
		
		
		evt.preventDefault();		
		var position = $pic_holder.position();
		
		$metadata.css({
			position : 'absolute',
			top : 0,
			left : 13,
			right : 18,
			height : $pic_holder.find('img').height(),
			padding : '30px 10px 10px 10px',
			background : 'rgba(255,255,255,.7)'
		});
		
		$metadata.appendTo($pic_holder).slideToggle();
		
		
	}
	
	
	jQuery("a[rel^='prettyPhoto']").prettyPhoto({
		
		description_src : 'data-description',
		changepicturecallback : function() {
			
			jQuery(this)
				.find('.pp_description a').first()
				.on('click', handleMetaDataClick );
			
		}
		
	});
	
}());