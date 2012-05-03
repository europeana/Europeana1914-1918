(function( undefined ) {

	'use strict';	
	
	
	var carousels = {
		
		$featured : null,
		$thumbnail : null,
		$thumbnail_counts : jQuery('#thumbnail-counts'),
		
		handleThumbnailClick : function( evt ) {
			
			var index = evt.data.index;
			
			evt.preventDefault();
			carousels.$featured.data( 'rCarousel' ).goToIndex(index);
			
		},
	
		init : function() {
			
			this.$featured =
				jQuery('#contributions-featured').rCarousel();
			
			this.$thumbnail =
				jQuery('#contributions-thumbnails').imagesLoaded(function() {
					this.rCarousel({
						listen_to_arrows : false,
						item_width_is_container_width : false,
						nav_button_size : 'small'
					});
				});
			
			this.$thumbnail_counts.html(
				I18n.t('javascripts.thumbnails.item') + ' ' + carousels.$featured.data( 'rCarousel' ).getCurrent() +
				' ' + I18n.t('javascripts.thumbnails.of') + ' ' + carousels.$featured.data( 'rCarousel' ).getTotal()
			);
			
			jQuery('#contributions-thumbnails ul a')
				.each(function(index) {
					jQuery(this).on( 'click', { index : index }, carousels.handleThumbnailClick );
				});
			
		}
		
	};
	
	
	var map = {
		
		$map : jQuery('#location-map'),
		
		addMapContainer : function() {
			
			//jQuery('#story-info')
			jQuery('#footer')
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
		
		$metadata : [],
		current : 0,
		
		
		handleMetaDataClick : function( evt ) {
			
			var self = evt.data.self,
					$metadata,
					$clone,
					$elm = jQuery(this),
					$pic_holder = jQuery('#pp_full_res'),
					$pp_content = jQuery('.pp_content'),
					position = $pp_content.position();
			
			evt.preventDefault();
			
			
			if ( !self.$metadata[ self.current ]) {
				
				self.$metadata[self.current] = ( jQuery( $elm.attr('href') ) );
				self.$metadata[self.current].data( 'cloned', false );
				
			}
			
			$metadata = self.$metadata[self.current];
			
			if ( !$metadata.data('cloned') ) {
				
				$metadata.data('clone', $metadata.clone() );
				$metadata.data('clone').appendTo( $pp_content );
				
				$metadata.data('clone').css({
					height : $pic_holder.find('img').height() - parseInt( $metadata.data('clone').css('padding-top'), 10 ) - parseInt( $metadata.data('clone').css('padding-bottom'), 10 )
				});
				
				$metadata.data('cloned', true);
				
			}
			
			$metadata.data('clone').slideToggle();
			
		},
		
		
		/**
		 *	this - refers to the generated lightbox div
		 *	the div is removed each time the lightbox is closed
		 *	so these elements need to be added back to the div
		 *	with each open
		 */
		handlePictureChange : function() {
			
			var $elm = jQuery(this),
					$additional_info_link = $elm.find('.pp_description a').first();			
			
			
			if ( lightbox.$metadata[lightbox.current] ) {
				
				if ( lightbox.$metadata[lightbox.current].data('clone').is(':visible') ) {
					
					lightbox.$metadata[lightbox.current].data('clone').hide();
					
				}
				
				if ( lightbox.$metadata[lightbox.current].data('cloned') ) {
					
					lightbox.$metadata[lightbox.current].data('cloned', false);
					
				}
				
			}
			
			$additional_info_link.on('click', { self : lightbox }, lightbox.handleMetaDataClick );
			lightbox.current = parseInt( $additional_info_link.attr('href').replace('#inline-',''), 10 );
			
		},
		
		
		setupPrettyPhoto : function() {
			
			var self = this;
			
			jQuery("a[rel^='prettyPhoto']").prettyPhoto({
				
				description_src : 'data-description',
				changepicturecallback : this.handlePictureChange
				
			});
			
		},
		
		init : function() {
			
			this.setupPrettyPhoto();
			
		}
		
	};
	
	
	var truncate = {
		
		init : function() {
			
			jQuery('#story-metadata').truncate({
				limit : { pixels : 400 },
				toggle_html : {
					more : I18n.t('javascripts.truncate.show-more'),
					less : I18n.t('javascripts.truncate.show-less')
				}
			});
			
		}
		
	};	
	
	
	(function() {
		
		truncate.init();
		carousels.init();
		//map.init();
		lightbox.init();
		RunCoCo.translation_services.init( jQuery('.truncate-toggle') );
		
	}());
	
	
}());