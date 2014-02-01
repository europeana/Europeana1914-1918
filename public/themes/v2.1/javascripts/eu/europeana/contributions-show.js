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
		$contributions_featured_ul : $('#contributions-featured ul'),
		$featured_carousel : null,
		$pagination_counts : $('#pagination-counts'),
		$pagination_next : $('#carousel-pagination .pagination a[rel=next]').eq(0),
		ajax_load_processed : true,
		pagination_total : $('#pagination-total').text(),
		nav_initial_delay: 3000,

		addImagesToLightbox : function( $new_content ) {
			var	$pp_full_res = jQuery('#pp_full_res'),
					$new_links = $new_content.find('#contributions-featured > ul > li > a');

			if ( $pp_full_res.length < 1 ) {
				return;
			}

			$new_links.each(function() {
				var $elm = jQuery(this);
				window.pp_images.push( $elm.attr('href') );
				window.pp_descriptions.push( $elm.attr('data-description') );
			});
		},

		addNavArrowHandling: function() {
			if ( !carousels.$featured_carousel
				|| !carousels.$featured_carousel.$items
				|| carousels.$featured_carousel.$items.length < 2
			) {
				return;
			}

			setTimeout(
				function() {
					carousels.$featured_carousel.$next.addClass('initial');
					carousels.$featured_carousel.$prev.addClass('initial');
				},
				carousels.nav_initial_delay
			);

			carousels.$featured_carousel.$items.each( function() {
				var $elm = $(this).find('a').eq(0);

				// decided to use $elm.data instead of $(element).data('events')
				// see http://blog.jquery.com/2012/08/09/jquery-1-8-released/ What's been removed
				if ( !$elm.data( 'carousel-events-added' ) ) {
					$elm
						.on( 'mouseenter', carousels.navArrowReveal )
						.on( 'mouseleave', carousels.navArrowHide )
						.on( 'focus', carousels.navArrowReveal )
						.on( 'blur', carousels.navArrowHide );

					$elm.data( 'carousel-events-added', true );
				}
			});
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
							after_nav : function() {
								carousels.updatePaginationCount();
							},
							before_nav: function( dir ) {
								carousels.paginationContentCheck( dir );
							},
							init_complete: function() {
								carousels.addNavArrowHandling();
							}
						}
					}).data('rCarousel');

				carousels.updatePaginationCount();
			});
		},

		navArrowHide: function() {
			carousels.$featured_carousel.$next.removeClass('focus');
			carousels.$featured_carousel.$prev.removeClass('focus');
		},

		navArrowReveal: function() {
			carousels.$featured_carousel.$next.addClass('focus');
			carousels.$featured_carousel.$prev.addClass('focus');
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
			if ( this.pagination_total < 2) {
				return;
			}

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
						callback : function() {
							self.removeMediaElementPlayers();
							lightbox.init(); // this insures that additional content that was loaded while in lightbox is lightbox enabled if the lightbox is closed
						},
						changepagenext : self.handlePageChangeNext,
						changepageprev : self.handlePageChangePrev,
						changepicturecallback : self.handlePictureChange,
						collection_total : carousels.pagination_total,
						description_src : 'data-description',
						overlay_gallery : false,
						show_title : false,
						social_tools: false
					};

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
