/*global I18n, anno, jQuery, mejs, RunCoCo */
/*jslint browser: true, white: true */
(function( I18n, anno, $, RunCoCo ) {

	'use strict';

	var
	pdf_viewer = true,
	add_lightbox = true,


	carousels = {
		$featured_carousel : null,
		$pagination_counts : $('#pagination-counts'),
		nav_initial_delay: 3000,
		pagination_total : $('#pagination-total').text(),
		photogallery_hash_check: false,

		/**
		 * make sure each new rel=prettyPhoto item gets
		 * added to the opened lightbox
		 *
		 * @param {object}
		 * a jQuery object representing the new content
		 *
		 * @returns {bool}
		 */
		addImagesToOpenedLightbox : function( $new_content ) {
			// if lightbox is not open return
			if ( $('.pp_pic_holder').length < 1 ) {
				return false;
			}

			$new_content.find("#contributions-featured a[rel^='prettyPhoto']").each(function() {
				var $elm = $(this);
				window.pp_images.push( $elm.attr('href') );
				window.pp_descriptions.push( $elm.attr('data-description') );
			});

			return true;
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
				var $elm = $(this);

				// decided to use $elm.data instead of $(element).data('events')
				// see http://blog.jquery.com/2012/08/09/jquery-1-8-released/ What's been removed
				if ( !$elm.data( 'carousel-events-added' ) ) {
					$elm
						.on( 'mouseenter', carousels.navArrowReveal )
						.on( 'mouseleave', carousels.navArrowHide )
						.on( 'touchstart', carousels.navArrowReveal )
						.on( 'touchend', carousels.navArrowHide );

					$elm.data( 'carousel-events-added', true );
				}
			});
		},

		/**
		 * @param {int} index
		 */
		goToIndex: function( index ) {
			index = parseInt( index, 10 );

			if ( ( index + 1 ) > this.$featured_carousel.items_length ) {
				index = this.$featured_carousel.items_length - 1;
			} else if ( index < 0 ) {
				index = 0;
			}
		},

		init: function() {
			var self = this;

			$('#contributions-featured').imagesLoaded( function() {
				self.$featured_carousel =
					$('#contributions-featured').rCarousel({
						hide_overlay: false,
						item_width_is_container_width : true,
						items_collection_total : parseInt( self.pagination_total, 10 ),
						callbacks : {
							after_nav: function() {
								carousels.updatePaginationCount();
							},
							before_nav: function( dir ) {
								carousels.replaceItemPlaceholderCheck( dir );
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
		 * @param {int} new_carousel_index
		 *
		 * @param {object} $elm_plcaeholder
		 * jQuery object representing a placeholder item
		 */
		replaceItemPlaceholder: function( new_carousel_index, $elm_placeholder ) {
			var $a = $elm_placeholder.find('a').eq(0),
			$img = $elm_placeholder.find('img').eq(0);

			$img
				.attr( 'src', '/assets/v2.1/images/icons/loading-animation.gif' )
				.attr( 'src', $a.attr( 'data-attachment-preview-url' ) )
				.attr( 'alt', $a.attr( 'data-attachment-title' ) );

			$elm_placeholder.removeClass( 'item-placeholder' );

			if ( this.photogallery_hash_check ) {
				this.$featured_carousel.goToIndex( new_carousel_index );
				this.updatePaginationCount();
				this.photogallery_hash_check = false;
			}
		},

		/**
		 * decide whether or not to pull in additional carousel items
		 *
		 * @param {string|int} dir
		 * expected string next|prev
		 */
		replaceItemPlaceholderCheck: function( dir ) {
			var $elm_placeholder,
			new_carousel_index = 0,
			current_carousel_index = this.$featured_carousel.get('current_item_index');

			if ( dir === 'next' ) {
				new_carousel_index = current_carousel_index + 1;
			} else if ( dir === 'prev' ) {
				new_carousel_index = current_carousel_index - 1;
			} else {
				new_carousel_index = parseInt( dir, 10 );
			}

			$elm_placeholder = this.$featured_carousel.$items.eq( new_carousel_index );

			if (
				new_carousel_index === -1
				|| ( new_carousel_index + 1 ) > this.$featured_carousel.items_length
				|| !$elm_placeholder.hasClass('item-placeholder')
			) {
				return;
			}

			// replace item-placeholder
			this.replaceItemPlaceholder( new_carousel_index, $elm_placeholder );
		},

		updatePaginationCount : function() {
			if ( this.pagination_total < 2 ) {
				return;
			}

			this.$pagination_counts.html(
				I18n.t('javascripts.thumbnails.item') + ' ' +
				( this.$featured_carousel.get('current_item_index') + 1 ) +	' ' +
				I18n.t('javascripts.thumbnails.of') + ' ' +
				this.pagination_total
			);
		}
	},


	lightbox = {
		$metadata : [],
		current : 0,
		annotorious_setup: false,
		ppOptions : {},

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

		hideLightboxContent: function() {
			var $pp_pic_holder = $('.pp_pic_holder');
			$pp_pic_holder.find('#pp_full_res object,#pp_full_res embed').css('visibility','hidden');
			$pp_pic_holder.find('.pp_fade').fadeOut('fast',function(){
				$('.pp_loaderIcon').show();
			});
		},

		init : function() {
			if ( add_lightbox ) {
				this.setupPrettyPhoto();
				this.setupAnnotorious();
			} else {
				this.removeLightboxLinks();
			}
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

		removeMediaElementPlayers : function() {
			var i;

			if ( window.mejs === undefined ) {
				return;
			}

			for ( i in mejs.players ) {
				if ( mejs.players.hasOwnProperty(i) ) {
					mejs.players[i].remove();
				}
			}

			mejs.mepIndex = 0;
		},

		setupAnnotorious : function() {
			if ( this.annotorious_setup ) {
				return;
			}

			anno.addPlugin( 'RunCoCo_Attachment', { } );
			anno.addPlugin( 'RunCoCo', { base_url : RunCoCo.siteUrl + "/" + RunCoCo.locale + "/annotations" } );
			anno.addPlugin( 'Flag', { base_url : RunCoCo.siteUrl + "/" + RunCoCo.locale + "/annotations" } );
			this.annotorious_setup = true;
		},

		setupPrettyPhoto : function() {
			lightbox.ppOptions.callback = function() {
				lightbox.removeMediaElementPlayers();
				// this insures that additional content that was loaded while
				// in lightbox is lightbox enabled if the lightbox is closed
				lightbox.init();
			};

			lightbox.ppOptions.changepagenext = lightbox.handlePageChangeNext;
			lightbox.ppOptions.changepageprev = lightbox.handlePageChangePrev;
			lightbox.ppOptions.changepicturecallback = lightbox.handlePictureChange;
			lightbox.ppOptions.collection_total = carousels.pagination_total;
			lightbox.ppOptions.description_src = 'data-description';
			lightbox.ppOptions.image_markup = '<img id="fullResImage" src="{path}" class="annotatable">';
			lightbox.ppOptions.overlay_gallery = false;
			lightbox.ppOptions.show_title = false;
			lightbox.ppOptions.social_tools = false;
			lightbox.ppOptions.open_callback = function() { alert('open sesame!'); }

			$("#contributions-featured a[rel^='prettyPhoto']").prettyPhoto( lightbox.ppOptions );
		}
	},


	map = {

		$map : $('#location-map'),
		$overlay : $('<div>', { 'class' : 'carousel-overlay' }),
		$story_map : $('<div>', { id : 'story-map' }),
		$google_map : $('<div>', { id : "google-map" }),
		placename : $('#location-placename').val(),
		$placename_link : $('<a>'),
		$story_took_place : $('<b>').text( I18n.t( 'javascripts.story.took-place' ) ),

		addMapContainer : function() {
			$('#story-info')
				.after(
					$( this.$google_map )
						.append( this.$story_took_place )
						.append( this.$story_map )
						.append( this.$overlay )
				);
			$('#google-map').addClass( 'col-cell' );
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
					.append( self.$placename_link );
			}
		},


		init : function() {
			this.addStoryTookPlace();
			this.locationMap();
		}
	},

	pdf = {
		handleClick : function() {
			var $elm = $(this),
				destination_url;

			destination_url = '/contributions/' + $elm.data('contribution-id') + '/attachments/' + $elm.data('attachment-id') + '?layout=0';
			$elm.attr( 'href', destination_url );
		},

		init : function () {
			if ( !pdf_viewer ) {
				return;
			}

			$('#contributions-featured').on( 'click', '.pdf', pdf.handleClick );
		}
	},

	// http://localhost:3000/en/contributions/1#prettyPhoto[gallery]/3/
	photoGallery = {
		items_per_page: 1,

		checkHash: function() {
			var
			hash = window.location.hash.substring(1),
			requested_index = 0,
			requested_item = 1,
			total_items = parseInt( $('#pagination-total').text(), 10 );

			if ( hash.indexOf('/') < 0 ) {
				return;
			}

			hash = hash.split('/');

			if ( hash.length !== 3 ) {
				return;
			}

			requested_index = parseInt( hash[1], 10 );
			requested_item = requested_index + 1;
			//requested_page = Math.ceil( requested_item / this.items_per_page );

			if (
				requested_item < 1
				|| requested_item > total_items
			) {
				return;
			}

			carousels.photogallery_hash_check = true;
			carousels.replaceItemPlaceholderCheck( requested_index );
		},

		init: function() {
			if ( carousels.$featured_carousel !== null ) {
				photoGallery.checkHash();
				carousels.$featured_carousel.hideOverlay();
			} else {
				setTimeout(
					photoGallery.init,
					100
				);
			}
		}
	};

	if (
		( $(window).width() <= 768 || $(window).height() <= 500 )
		&& !( /iPad/.test( navigator.platform ) )
		&& navigator.userAgent.indexOf( "AppleWebKit" ) > -1
	) {
		pdf_viewer = add_lightbox = false;
	}

	RunCoCo.translation_services.init( $('.translate-area') );
	carousels.init();
	//map.init();
	lightbox.init();
	pdf.init();
	photoGallery.init();
	europeana.leaflet.init();

}( I18n, anno, jQuery, RunCoCo ));
