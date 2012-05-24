/**
 *	@author dan entous <contact@gmtplusone.com>
 *	@version 2012-05-21 09:56 gmt +1
 */
(function() {

	'use strict';	
	
	
	var add_lightbox = ( jQuery(window).width() <= 768 || jQuery(window).height() <= 600 ) ? false : true,
	
	carousels = {
		
		$featured_carousel : null,
		$thumbnail_carousel : null,
		
		$thumbnail_counts : jQuery('#thumbnail-counts'),
		$thumbnail_links : jQuery('#contributions-thumbnails ul a'),		
		
		$contributions_featured_ul : jQuery('#contributions-featured ul'),
		$contributions_thumbnails_ul : jQuery('#contributions-thumbnails ul'),
		
		$pagination_next : jQuery('#contributions-pagination .pagination a[rel=next]').eq(0),
		items_collection_total : jQuery('#attachment-total').text(),
		
		$new_content : null,
		$loading_feedback : null,
		ajax_load_processed : true,
		pagination_checking : false,
		
		
		addImagesToLightbox : function( $new_content ) {
			
			var	$pp_full_res = jQuery('#pp_full_res'),
					$new_links = $new_content.find('#contributions-featured > ul > li > a');
			
			
			if ( $pp_full_res.length < 1 ) {
				
				lightbox.init();
				return;
				
			}
			
			$new_links.each(function() {
				
				var $elm = jQuery(this);
				
				window.pp_images.push( $elm.attr('href') );
				window.pp_descriptions.push( $elm.attr('data-description') );
			
			});
			
		},
		
		
		/**
		 *	ajax methods
		 */
			
			handleContentLoad : function( responseText, textStatus, XMLHttpRequest ) {
				
				var $new_content = this.$new_content.clone();
				
				if ( this.ajax_load_processed ) { return; }
				
				this.$contributions_featured_ul.append( this.$new_content.find('#contributions-featured ul li') );
				this.$featured_carousel.ajaxCarouselSetup();
				
				this.$contributions_thumbnails_ul.append( this.$new_content.find('#contributions-thumbnails ul li') );
				this.$thumbnail_carousel.ajaxCarouselSetup();
				
				this.$pagination_next = this.$new_content.find('#contributions-pagination .pagination a[rel=next]');
				this.$thumbnail_links = jQuery('#contributions-thumbnails ul a');
				
				this.addThumbnailClickHandlers();
				
				this.$thumbnail_carousel
					.$items
					.eq( this.getNewIndex('next') )
					.find('a')
					.trigger('click');
				
				this.pagination_checking = false;
				this.ajax_load_processed = true;
				this.$thumbnail_carousel.loading_content = false;
				
				if ( add_lightbox ) { this.addImagesToLightbox( $new_content ); }
				
			},
			
			
			retrieveContent : function( href ) {
				
				var self = this;
				
				if ( !href || !self.ajax_load_processed ) { return; }
				self.ajax_load_processed = false;
				self.$new_content = jQuery('<div/>');
				
				try {
					
					self.$thumbnail_carousel.loading_content = true;
					self.$thumbnail_carousel.$overlay.fadeIn();
					self.$featured_carousel.$overlay.fadeIn();
					
					self.$new_content.load(
						href,
						null,
						function( responseText, textStatus, XMLHttpRequest ) {
							self.handleContentLoad( responseText, textStatus, XMLHttpRequest );					
						}
					);
					
				} catch(e) {
					
					self.$thumbnail_carousel.loading_content = false;
					
				}
				
			},
			
			
			setupAjaxHandler : function() {
				
				jQuery(document).ajaxError(function( evt, XMLHttpRequest, jqXHR, textStatus ) {
					
					evt.preventDefault();
					// XMLHttpRequest.status == 404
					
				});
				
			},
			
			
			/**
			 *	decide whether or not to try and pull in additional carousel assets
			 *	additional assets are pulled in via the following url schemes
			 *	
			 *		full page comes from next link -> http://localhost:3000/en/contributions/2226?page=2
			 *		partial page -> http://localhost:3000/en/contributions/2226/attachments?carousel=1&page=1&count=2
			 */
			paginationContentCheck : function( dir, carousel ) {
				
				var href,
						next_page_link;
				
				
				if ( 'prev' === dir || this.pagination_checking ) { return; }
				
				if ( 'featured' === carousel
						 && this.$featured_carousel.current_item_index + 1
						    < this.$thumbnail_carousel.items_per_container
								* this.$thumbnail_carousel.page_nr ) { return; }				
				
				if ( this.$thumbnail_carousel.items_per_container
						 * this.$thumbnail_carousel.page_nr
						 < this.$thumbnail_carousel.items_length ) { return; }
				
				this.pagination_checking = true;
				
				next_page_link = this.$pagination_next.attr('href');
				if ( !next_page_link ) { return; }
				
				next_page_link = next_page_link.split('?');
				
				href =
					next_page_link[0] +
					( next_page_link[0].indexOf('/attachments') === -1 ? '/attachments?carousel=true&' : '?' ) +
					next_page_link[1];
				
				this.retrieveContent( href );
				
			},
		
		
		getNewIndex : function( dir ) {
			
			var page_val = this.$thumbnail_carousel.page_nr + ( dir === 'next' ? 1 : 0 ),
					new_index = page_val <= 0
						? 0
						: this.$thumbnail_carousel.items_per_container * page_val - this.$thumbnail_carousel.items_per_container;
			
			return new_index;
			
		},
		
		
		updateTumbnailCarouselPosition : function( selected_index, dir ) {
			
			if ( !this.$thumbnail_carousel ) { return; }
			
			var items_per_container = this.$thumbnail_carousel.get( 'items_per_container' ),
					page_nr = this.$thumbnail_carousel.get('page_nr'),
					min = ( page_nr * items_per_container ) - items_per_container,
					max = ( page_nr * items_per_container ) - 1;
			
			
			// if selected_index is on same page don't move the carousel
			if ( selected_index >= min && selected_index <= max ) {
				return;
			}
			
			if ( dir ) {
				
				if ( 'next' === dir ) {
					
					this.$thumbnail_carousel.$next.trigger('click');
					
				} else if ( 'prev' === dir ) {
					
					this.$thumbnail_carousel.$prev.trigger('click');
					
				}
				
			}
			
		},
		
		
		toggleSelected : function( selected_index ) {
			
			var self = this;
			
			
			self.$thumbnail_links.each(function(index) {
					
					var $elm = jQuery(this);
					
					if ( index === selected_index ) {
						
						if ( !$elm.hasClass('selected') ) {
							
							$elm.addClass('selected');
							
						}
						
					} else {
						
						$elm.removeClass('selected');
						
					}
					
			});
			
		},
		
		
		updateCounts : function() {
			
			this.$thumbnail_counts.html(
				I18n.t('javascripts.thumbnails.item') + ' ' + ( this.$featured_carousel.get('current_item_index') + 1 ) +
				' ' + I18n.t('javascripts.thumbnails.of') + ' ' + this.items_collection_total
			);
			
		},
		
		
		handleThumbnailClick : function( evt ) {
			
			var self = evt.data.self,
					index = evt.data.index,
					dir = index < self.$thumbnail_carousel.current_item_index ? 'prev' : 'next';
			
			evt.preventDefault();
			
			self.toggleSelected( index );
			self.$featured_carousel.current_item_index = index;
			self.$featured_carousel.transition();
			self.$featured_carousel.toggleNav();
			self.updateTumbnailCarouselPosition( index, dir );
			self.updateCounts();
			
		},
		
		
		addThumbnailClickHandlers : function() {
			
			var self = this;
			
			self.$thumbnail_links.each(function(index) {
				
				var $elm = jQuery(this);
				
				if ( !jQuery.data( this, 'thumbnail-handler-added' ) ) {
					
					$elm.on( 'click', { self : self, index : index }, carousels.handleThumbnailClick );
					jQuery.data( this, 'thumbnail-handler-added', true );
					
				}
			
			});
			
		},
		
	
		init : function() {
			
			var self = this;
			
			
			self.$featured_carousel =
				jQuery('#contributions-featured').rCarousel({
					items_collection_total : self.items_collection_total,
					callbacks : {
						before_nav : function( dir ) {
							self.paginationContentCheck( dir, 'featured' );
						},
						after_nav : function( dir ) {
							self.updateCounts();
							self.toggleSelected( self.$featured_carousel.get('current_item_index') );
							self.updateTumbnailCarouselPosition( self.$featured_carousel.get('current_item_index'), dir );
						}
					}
				}).data('rCarousel');
			
			
			jQuery('#contributions-thumbnails').imagesLoaded(function() {
				self.$thumbnail_carousel =
					this.rCarousel({
						listen_to_arrow_keys : false,
						item_width_is_container_width : false,
						nav_button_size : 'small',
						items_collection_total : self.items_collection_total,
						callbacks : {
							before_nav : function( dir ) {
								self.paginationContentCheck( dir, 'thumbnail' );
							},
							after_nav : function( dir ) {
								if (!self.pagination_checking ) {
									
								}
							}
						}
					}).data('rCarousel');
			});
			
			self.addThumbnailClickHandlers();
			self.updateCounts();
			self.toggleSelected( self.$featured_carousel.get('current_item_index') );
			self.setupAjaxHandler();
			
		}
		
	},
	
	
	lightbox = {
		
		$metadata : [],
		current : 0,
		
		
		addMetaDataOverlay : function( $elm ) {
			
			var self = this,
					$metadata,
					$pic_full_res = jQuery('#pp_full_res'),
					$pp_content = jQuery('.pp_content');
			
			
			if ( !self.$metadata[ self.current ]) {
				
				self.$metadata[self.current] = ( jQuery( $elm.attr('href') ) );
				self.$metadata[self.current].data( 'cloned', false );
				
			}
			
			$metadata = self.$metadata[self.current];
			
			if ( !$metadata.data('cloned') ) {
				
				$metadata.data('clone', $metadata.clone() );
				$metadata.data('clone').appendTo( $pp_content );
				
				$metadata.data('clone').css({
					height : $pic_full_res.find('img').height() - parseInt( $metadata.data('clone').css('padding-top'), 10 ) - parseInt( $metadata.data('clone').css('padding-bottom'), 10 )
				});
				
				$pic_full_res.append( $metadata.find('.metadata-license').html() );
				$metadata.data('cloned', true);
				
			}
			
		},
		
		
		handleMetaDataClick : function( evt ) {
			
			var self = evt.data.self;
			
			evt.preventDefault();	
			self.$metadata[self.current].data('clone').slideToggle();
			
		},
		
		
		handlePageChangeNext : function( keyboard ) {
			
			if ( !keyboard ) {
				
				carousels.$featured_carousel.$next.trigger('click');
				
			}
			
		},
		
		
		handlePageChangePrev : function( keyboard ) {
			
			if ( !keyboard ) {
				
				carousels.$featured_carousel.$prev.trigger('click');
				
			}
			
		},
		
		
		/**
		 *	this - refers to the generated lightbox div
		 *	the div is removed each time the lightbox is closed
		 *	so these elements need to be added back to the div
		 *	with each open
		 */
		handlePictureChange : function() {
			
			var self = lightbox,
					$elm = jQuery(this),
					$additional_info_link = $elm.find('.pp_description a').first();			
			
			
			if ( self.$metadata[self.current] ) {
				
				if ( self.$metadata[self.current].data('clone').is(':visible') ) {
					
					self.$metadata[self.current].data('clone').hide();
					
				}
				
				if ( self.$metadata[self.current].data('cloned') ) {
					
					self.$metadata[self.current].data('cloned', false);
					
				}
				
			}
			
			$additional_info_link.on('click', { self : self }, self.handleMetaDataClick );
			self.current = parseInt( $additional_info_link.attr('href').replace('#inline-',''), 10 );
			self.addMetaDataOverlay( $additional_info_link );
			
		},
		
		
		setupPrettyPhoto : function() {
			
			var self = this;
			
			jQuery("a[rel^='prettyPhoto']").prettyPhoto({
				
				description_src : 'data-description',
				overlay_gallery : false,
				changepagenext : self.handlePageChangeNext,
				changepageprev : self.handlePageChangePrev,
				changepicturecallback : self.handlePictureChange,
				show_title : false,
				collection_total : carousels.items_collection_total,
				callback : function() { lightbox.init(); }
				
			});
			
		},
		
		
		init : function() {
			
			if ( add_lightbox ) {
				
				this.setupPrettyPhoto();
				
			} else {
				
				jQuery('#contributions-featured a').each(function() {
					
					var $elm = jQuery(this),
							contents = $elm.contents();
					
					$elm.replaceWith(contents);
					
				});
				
			}
			
		}
		
	},
	
	
	map = {
		
		$map : jQuery('#location-map'),
		$overlay : jQuery('<div/>', { 'class' : 'carousel-overlay' }),
		$story_map : jQuery('<div/>', { id : 'story-map' }),
		$google_map : jQuery('<div/>', { id : "google-map" }),
		placename : jQuery('#location-placename').val(),
		$placename_link : jQuery('<a/>'),
		$story_took_place : jQuery('<b/>'),
		
		
		addMapContainer : function() {
			
			jQuery('#thumbnail-counts')
				.after(
					jQuery( this.$google_map )
						.append( this.$story_took_place )
						.append( this.$story_map )
						.append( this.$overlay )
				);
			
			this.$story_map.css( 'height', jQuery('.one-half-right').width() );
			
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
		
		
		addStoryTookPlace : function() {
			
			var self = this;
			
			if ( self.placename ) {
				
				self.$placename_link
					.attr('href', '/contributions/search?q=' + self.placename.replace(/,/g,'').replace(/ /g,'+') )
					.html( self.placename );
			
				self.$story_took_place
					.append( I18n.t('javascripts.story.took-place') + ' ' )
					.append( self.$placename_link );
				
			}
			
		},
		
		
		init : function() {
			
			this.addStoryTookPlace();
			this.locationMap();
			
		}
		
	},
	
	
	truncate = {
		
		init : function() {
			
			if ( jQuery('#avatar').length < 1 ) { return; }
			
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
		RunCoCo.translation_services.init( jQuery('#story-metadata') );
		carousels.init();
		map.init();
		lightbox.init();
		
	}());
	
	
}());