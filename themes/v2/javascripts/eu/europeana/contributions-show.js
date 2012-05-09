/**
 *	@author dan entous <contact@gmtplusone.com>
 *	@version 2012-05-08 10:47 gmt +1
 */
(function() {

	'use strict';	
	
	
	var carousels = {
		
		$featured : null,
		$thumbnail : null,
		$thumbnail_counts : jQuery('#thumbnail-counts'),
		$thumbnail_links : jQuery('#contributions-thumbnails ul a'),
		
		
		toggleSelected : function( selected_index ) {
			
			this.$thumbnail_links.each(function(index) {
					
					var $elm = jQuery(this);
					
					if ( index === selected_index && !$elm.hasClass('selected') ) {
						
						$elm.addClass('selected');
						
					} else {
						
						$elm.removeClass('selected');
						
					}
					
			});
			
		},
		
		
		//updateTumbnailCarouselPosition : function() {
		//	
		//	var current_index = carousels.$featured.data( 'rCarousel' ).get('current_item_index'),
		//			items_per_container = carousels.$thumbnail.data( 'rCarousel' ).get('items_per_container'),
		//			page_info = carousels.$featured.data( 'rCarousel' ).determinePage( current_index, items_per_container );
		//	
		//	carousels.$thumbnail.data( 'rCarousel' ).goToIndex( page_info.page_first_item_index );
		//	
		//},
		
		
		updateCounts : function() {
			
			this.$thumbnail_counts.html(
				I18n.t('javascripts.thumbnails.item') + ' ' + ( carousels.$featured.data( 'rCarousel' ).get('current_item_index') + 1 ) +
				' ' + I18n.t('javascripts.thumbnails.of') + ' ' + carousels.$featured.data( 'rCarousel' ).get('items_length')
			);
			
		},
		
		
		handleThumbnailClick : function( evt ) {
			
			var self = evt.data.self,
					index = evt.data.index,
					$elm = jQuery(this);
			
			
			evt.preventDefault();
			
			self.toggleSelected(index);
			carousels.$featured.data( 'rCarousel' ).goToIndex(index);
			self.updateCounts();
			
		},
		
		
		addThumbnailClickHandlers : function() {
			
			var self = this;
			
			self.$thumbnail_links.each(function(index) {
					
					var $elm = jQuery(this);
					$elm.on( 'click', { self : self, index : index }, carousels.handleThumbnailClick );
					
			});
			
		},
		
	
		init : function() {
			
			var self = this;
			
			
			this.$featured =
				jQuery('#contributions-featured').rCarousel({
					nav_callback : function() { self.updateCounts(); /* self.updateTumbnailCarouselPosition(); */ }
				});
			
			this.$thumbnail =
				jQuery('#contributions-thumbnails').imagesLoaded(function() {
					this.rCarousel({
						listen_to_arrow_keys : false,
						item_width_is_container_width : false,
						nav_button_size : 'small'
					});
				});
			
			this.addThumbnailClickHandlers();
			this.updateCounts();
			this.toggleSelected( this.$featured.data( 'rCarousel' ).get('current_item_index') );
			
		}
		
	};
	
	
	var map = {
		
		$map : jQuery('#location-map'),
		$overlay : jQuery('<div/>', { 'class' : 'carousel-overlay' }),
		$story_map : jQuery('<div/>', { id : 'story-map' }),
		$google_map : jQuery('<div/>', { id : "google-map" }),
		
		
		addMapContainer : function() {
			
			jQuery('#thumbnail-counts')
				.after(
					jQuery( this.$google_map )
						.append( jQuery('#location-took-place').val() )
						.append( this.$story_map )
						.append( this.$overlay )
				);
			
		},
		
		
		removeOverlay : function() {
			
			if ( map.$overlay.is(':visible') ) {
				
				setTimeout( function() { map.$overlay.fadeOut(); }, 200 );
				
			}
			
		},
		
		
		locationMap : function() {
			
			if ( this.$map.length === 1 ) {
				
				this.addMapContainer();
				RunCoCo.GMap.Display.init('story-map', this.removeOverlay );
				
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
		map.init();
		if ( jQuery(window).width() >= 768 ) { lightbox.init(); }
		RunCoCo.translation_services.init( jQuery('#story-metadata') );
		
	}());
	
	
}());