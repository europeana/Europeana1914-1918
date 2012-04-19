(function( undefined ) {

	'use strict';	
	
	var carousels = {
	
		init : function() {
			
			jQuery('#contributions-featured').rCarousel();
			jQuery('#contributions-thumbnails').rCarousel();
			
			//setTimeout( function() {
			//jQuery('#contributions-thumbnails').rCarousel();
			//}, 10000);
			
		}
		
		/*
		elastislide : function() {
			
			jQuery('#image-viewer').elastislide({
				imageW : jQuery('#image-viewer div > ul').eq(0).outerWidth(true) - 4,
				border : 0,
				margin : 0,
				onClick : function( $item ) { return true; },
				complete : function() { setTimeout( function() { jQuery('#image-viewer div.es-carousel').removeClass('opacity-0'); }, 1000); }
			});
			
		},
		
		thumbnails : function() {
			
			jQuery('#thumbnail-viewer').elastislide({
				imageW : jQuery('#thumbnail-viewer li').eq(0).outerWidth(true),
				border : 0,
				margin : 5,
				onClick : function( $item ) { return true; },
				complete : function() { console.log('my callback'); }
			});
			
		},
		
		*/
		
	};
	
	
	var map = {
		
		$map : jQuery('#location-map'),
		
		addMapContainer : function() {
			
			jQuery('#story-info')
				.append( jQuery('<div/>', { id : 'story-map', class : 'responsive-box' } ) );
			
		},
		
		
		locationMap : function() {
			
			if ( this.$map.length === 1 ) {
				
				this.addMapContainer();
				setTimeout( function() { RunCoCo.GMap.Display.init('story-map'); }, 1000 );
				
			} else {
				
				this.$map.hide();
				
			}
			
		},
		
		init : function() {
			
			this.locationMap();
			
		}
		
	};
	
	
	var lightbox = {
		
		$metadata : undefined,
		
		handleMetaDataClick : function( evt ) {
			
			var self = evt.data.self,
					$elm = jQuery(this),
					$pic_holder = jQuery('#pp_full_res'),
					position = $pic_holder.position();
			
			evt.preventDefault();
			self.$metadata = jQuery( $elm.attr('href') );
			
			if ( !self.$metadata.data.cloned ) {
				
				self.$metadata.data.cloned = self.$metadata.clone().appendTo($pic_holder);
				self.$metadata.data.cloned.css({
					height : $pic_holder.find('img').height() - parseInt( self.$metadata.css('padding-top'), 10 ) - parseInt( self.$metadata.css('padding-bottom'), 10 )
				});
				
			}
			
			self.$metadata.data.cloned.slideToggle();
			
		},
		
		addLightBoxDescriptionClickHandler : function() {
			
			/**
			 *	this - refers to the generated lightbox div
			 *	the div is removed each time the lightbox is closed
			 *	so these elements need to be added back to the div
			 *	with each open
			 */
			jQuery(this)
				.find('.pp_description a').first()
				.on('click', { self : lightbox }, lightbox.handleMetaDataClick );
			
		},
	
		setupPrettyPhoto : function() {
			
			var self = this;
			
			jQuery("a[rel^='prettyPhoto']").prettyPhoto({
				
				description_src : 'data-description',
				changepicturecallback : this.addLightBoxDescriptionClickHandler,
				callback : function() { self.$metadata.data.cloned = false; }
				
			});
			
		},
		
		init : function() {
			
			this.setupPrettyPhoto();
			
		}
		
	}
	
	
	function init() {
		
		//jQuery('#story-metadata').truncate({
		//	limit : { pixels : carousels.$featured.height() }
		//});
		
		carousels.init();
		map.init();
		lightbox.init();
		
	}
	
	
	init();
	
	
}());