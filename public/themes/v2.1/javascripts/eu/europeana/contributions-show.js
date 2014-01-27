/*global jQuery */
/*jslint browser: true, regexp: true, white: true */
/**
 *	@todo: add method for handling window re-size so that lightbox & pdf viewer
 *	can be re-determined. also handle portrait/landscape issues
 */
(function() {
	'use strict';
	var add_lightbox =
		( jQuery(window).width() <= 768 || jQuery(window).height() <= 500 )
		&& ( !( /iPad/.test( navigator.platform ) && navigator.userAgent.indexOf( "AppleWebKit" ) > -1 ) )
		? false
		: true,
		pdf_viewer = add_lightbox,
		$contributions_featured = jQuery('#contributions-featured'),


	carousels = {
		ajax_load_processed : true,
		$featured_carousel : null,
		$pagination_counts : $('#pagination-counts'),
		pagination_total : $('#pagination-total').text(),
		$pagination_next : jQuery('#carousel-pagination .pagination a[rel=next]').eq(0),
		$contributions_featured_ul : jQuery('#contributions-featured ul'),

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

			$.prettyPhoto.changePage('next');
		},

		/**
		 *	ajax methods
		 */
		handleContentLoad : function( responseText, textStatus, XMLHttpRequest ) {
			var $new_content = this.$new_content.clone();

			if ( this.ajax_load_processed ) {
				return;
			}

			this.$contributions_featured_ul.append( this.$new_content.find('#contributions-featured ul li') );
			this.$featured_carousel.ajaxCarouselSetup();
			this.$pagination_next = this.$new_content.find('#carousel-pagination .pagination a[rel=next]');
			this.ajax_load_processed = true;

			if ( add_lightbox ) {
				this.addImagesToLightbox( $new_content );
			} else {
				lightbox.removeLightboxLinks();
			}

			this.$featured_carousel.$next.trigger('click');
			this.$featured_carousel.hideOverlay();
		},

		init: function() {
			var self = this;

			$('#contributions-featured').imagesLoaded( function() {
				self.$featured_carousel =
					$('#contributions-featured').rCarousel({
						item_width_is_container_width : true,
						items_collection_total : parseInt( self.pagination_total, 10 ),
						callbacks : {
							before_nav: function( dir ) {
								carousels.paginationContentCheck( dir );
							},
							after_nav : function() {
								carousels.updatePaginationCount();
							}
						}
					}).data('rCarousel');

				carousels.updatePaginationCount();
			});
		},

		/**
		 *	decide whether or not to try and pull in additional carousel assets
		 *	additional assets are pulled in via the following url schemes
		 *
		 *		full page comes from next link -> http://localhost:3000/en/contributions/2226?page=2
		 *		partial page, default count -> http://localhost:3000/en/contributions/2226/attachments?carousel=true&page=2
		 *    partial page, custom count -> http://localhost:3000/en/contributions/2226/attachments?carousel=true&page=2&count=2
		 */
		paginationContentCheck : function( dir ) {
			var href,
					next_page_link,
					next_carousel_item = 0,
					current_carousel_count = this.$featured_carousel.items_length,
					current_carousel_item = this.$featured_carousel.get('current_item_index') + 1;

			this.$featured_carousel.options.cancel_nav = true;
			next_page_link = this.$pagination_next.attr('href');

			if ( dir === 'next' ) {
				next_carousel_item = current_carousel_item + 1;
			} else if ( current_carousel_item > 1 )  {
				next_carousel_item = current_carousel_item - 1;
			} else {
				next_carousel_item = 1;
			}

			if ( !next_page_link || next_carousel_item <= current_carousel_count  ) {
				this.$featured_carousel.options.cancel_nav = false;
				return;
			}

			next_page_link = next_page_link.split('?');

			href =
				next_page_link[0] +
				( next_page_link[0].indexOf('/attachments') === -1 ? '/attachments?carousel=true&' : '?' ) +
				next_page_link[1];

			this.retrieveContent( href );
		},

		retrieveContent : function( href ) {
			var self = this;

			if ( !href || !self.ajax_load_processed ) { return; }
			self.ajax_load_processed = false;
			self.$new_content = jQuery('<div/>');

			try {
				self.$featured_carousel.$overlay.fadeIn();

				self.$new_content.load(
					href,
					null,
					function( responseText, textStatus, XMLHttpRequest ) {
						self.handleContentLoad( responseText, textStatus, XMLHttpRequest );
					}
				);

			} catch(e) {
				console.log(e);
			}
		},

		updatePaginationCount : function() {
			this.$pagination_counts.html(
				I18n.t('javascripts.thumbnails.item') + ' ' +	( this.$featured_carousel.get('current_item_index') + 1 ) +	' ' + I18n.t('javascripts.thumbnails.of') + ' ' + this.pagination_total
			);
		}
	},


	lightbox = {
		$metadata : [],
		current : 0,

		addMetaDataOverlay : function( $elm ) {
			var self = this,
					$pic_full_res = jQuery('#pp_full_res'),
					$pp_content = jQuery('.pp_content');

			if ( !self.$metadata[self.current] ) {
				self.$metadata[self.current] = ( jQuery( $elm.attr('href') ) );
				self.$metadata[ self.current ].data('clone', self.$metadata[ self.current ].clone() );
			}

			self.$metadata[ self.current ].data('clone').appendTo( $pp_content );

			self.$metadata[ self.current ].data('clone').css({
				height : $pic_full_res.find('img').height()
					- parseInt( self.$metadata[ self.current ].data('clone').css('padding-top'), 10 )
					- parseInt( self.$metadata[ self.current ].data('clone').css('padding-bottom'), 10 )
			});

			$pic_full_res.append( self.$metadata[ self.current ].find('.metadata-license').html() );
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

			anno.reset();
			anno.hideSelectionWidget();

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

		removeMediaElementPlayers : function() {
			if ( !window.mejs ) {
				return;
			}

			for ( var i in mejs.players ) {
				mejs.players[i].remove();
			}

			mejs.mepIndex = 0;
		},

		setupAnnotorious : function() {
			anno.addPlugin( 'RunCoCo', { base_url : RunCoCo.siteUrl + "/" + RunCoCo.locale + "/annotations" } ) ;
		},

		setupPrettyPhoto : function() {
			var self = this,
					ppOptions = {
						description_src : 'data-description',
						overlay_gallery : false,
						changepagenext : self.handlePageChangeNext,
						changepageprev : self.handlePageChangePrev,
						changepicturecallback : self.handlePictureChange,
						show_title : false,
						social_tools: false,
						collection_total : carousels.items_collection_total,
						callback : function() {
							//lightbox.init(); // Why is this run as a callback when pp is closed?
							self.removeMediaElementPlayers();
						}
					};

			//jQuery("a[rel^='prettyPhoto']").prettyPhoto({
			//	description_src : 'data-description',
			//	overlay_gallery : false,
			//	changepagenext : self.handlePageChangeNext,
			//	changepageprev : self.handlePageChangePrev,
			//	changepicturecallback : self.handlePictureChange,
			//	show_title : false,
			//	collection_total : carousels.items_collection_total,
			//	callback : function() { lightbox.init(); }
			//});
			//jQuery("a[rel^='prettyPhoto'].video").each(function() {
			//	// Videos are played by MediaElement.js, using prettyPhoto's inline
			//	// content handler. MediaElements.js will not work if the video element
			//	// is copied into prettyPhoto's container, the <video> element and
			//	// MediaElement.js attachment to the <video> element needs to happen
			//	// once the prettyPhoto container has been created.
			//	// @see self.handlerPictureChange
			//	var ppVideoOptions = ppOptions;
			//	var video_link = jQuery(this);
			//
			//	ppVideoOptions.default_width = video_link.data('video-width');
			//	ppVideoOptions.default_height = video_link.data('video-height');
			//	jQuery(this).prettyPhoto(ppVideoOptions);
			//});
			//
			//jQuery("a[rel^='prettyPhoto'].audio").each(function() {
			//	var ppAudioOptions = ppOptions;
			//	var audio_link = jQuery(this);
			//
			//	ppAudioOptions.default_width = audio_link.data('audio-width');
			//	ppAudioOptions.default_height = audio_link.data('audio-height');
			//	jQuery(this).prettyPhoto(ppAudioOptions);
			//});
			//
			//jQuery("a[rel^='prettyPhoto']").not('.video,.audio').each(function() {
			//	var ppImageOptions = ppOptions;
			//	ppImageOptions.image_markup = '<img id="fullResImage" src="{path}" class="annotatable">';
			//	jQuery(this).prettyPhoto(ppImageOptions);
			//});

			// the above entries create isolated prettyPhoto groupings that are not connected to one another
			// a different solution needs to be found so that no matter which media type is present
			// they can all be part of the same prettyPhoto group
			// for now, the following can be used for annotating images
			ppOptions.image_markup = '<img id="fullResImage" src="{path}" class="annotatable">';
			jQuery("#contributions-featured a[rel^='prettyPhoto']").prettyPhoto( ppOptions );
		},

		removeLightboxLinks : function() {
			jQuery('#contributions-featured a').each(function() {
				var $elm = jQuery(this),
						contents = $elm.contents();

				if ( !$elm.hasClass('pdf') ) {
					$elm.replaceWith(contents);
				}
			});

			$('#contributions-featured .view-item').each(function() {
				jQuery(this).remove();
			});
		},

		init : function() {
			if ( add_lightbox ) {
				this.setupPrettyPhoto();
			} else {
				this.removeLightboxLinks();
			}
			this.setupAnnotorious();
		}
	},


	map = {

		$map : jQuery('#location-map'),
		$overlay : jQuery('<div/>', { 'class' : 'carousel-overlay' }),
		$story_map : jQuery('<div/>', { id : 'story-map' }),
		$google_map : jQuery('<div/>', { id : "google-map" }),
		placename : jQuery('#location-placename').val(),
		$placename_link : jQuery('<a/>'),
		$story_took_place : jQuery('<b>' + translated_map_contribution_heading + ' </b>'),

		addMapContainer : function() {
			jQuery('#story-info')
				.after(
					jQuery( this.$google_map )
						.append( this.$story_took_place )
						.append( this.$story_map )
						.append( this.$overlay )
				)
			jQuery('#google-map').addClass( 'col-cell' );
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
					//.append( I18n.t('javascripts.story.took-place') + ' ' )
					.append( self.$placename_link );
			}
		},


		init : function() {
			this.addStoryTookPlace();
			this.locationMap();
		}
	},

	pdf = {
		handleClick : function( evt ) {
			var $elm = jQuery(this),
				destination_url;

			destination_url = '/contributions/' + $elm.data('contribution-id') + '/attachments/' + $elm.data('attachment-id') + '?layout=0';
			$elm.attr( 'href', destination_url );
		},

		init : function () {
			if ( !pdf_viewer ) {
				return;
			}

			$contributions_featured.on( 'click', '.pdf', pdf.handleClick );
		}
	};


	/*
	truncate = {
		init : function() {
			if ( jQuery('#avatar').length < 1 ) {
				return;
			}

			jQuery('#story-metadata').truncate({
				limit : { pixels : 400 },
				toggle_html : {
					more : I18n.t('javascripts.truncate.show-more'),
					less : I18n.t('javascripts.truncate.show-less')
				}
			});
		}
	};
	*/


	(function() {
		//truncate.init();
		RunCoCo.translation_services.init( $('.translate-area') );
		carousels.init();
		map.init();
		lightbox.init();
		pdf.init();
	}());

}());
