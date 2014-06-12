/*global anno, I18n, europeana, jQuery, mejs, RunCoCo */
/*jslint browser: true, white: true */
(function( $ ) {

	'use strict';

	var
	pdf_viewer = true,
	add_lightbox = true,
	carousel = europeana.carousel,


	lightbox = {
		$metadata : [],
		annotorious_setup: false,
		current : 0,
		ppOptions : {},
		Shareable: {},
		$sharethis_elm: {},

		/**
		 * @param {object} $elm
		 * jQuery object
		 */
		addMetaDataOverlay : function( $elm ) {
			var
			self = this,
			$pic_full_res = jQuery('#pp_full_res'),
			$pp_content = jQuery('.pp_content');

			if ( !self.$metadata[self.current] ) {
				self.$metadata[self.current] = ( jQuery( $elm.attr('href') ) );
				self.$metadata[ self.current ].data('clone', self.$metadata[ self.current ].clone() );
			}

			self.$metadata[ self.current ].data('clone').appendTo( $pp_content );

			self.$metadata[ self.current ].data('clone').css({
				height :
					$pic_full_res.find('img').height() -
					parseInt( self.$metadata[ self.current ].data('clone').css('padding-top'), 10 ) -
					parseInt( self.$metadata[ self.current ].data('clone').css('padding-bottom'), 10 )
			});

			$pic_full_res.append( self.$metadata[ self.current ].find('.metadata-license').html() );
		},

		/**
		 * @see http://support.sharethis.com/customer/portal/articles/475260-examples
		 * @see http://support.sharethis.com/customer/portal/articles/475079-share-properties-and-sharing-custom-information#Dynamic_Specification_through_JavaScript
		 *
		 * @param {object} $metadata
		 * jQuery object
		 *
		 * @param {object} $additional_info_link
		 * jQuery object
		 *
		 * @param {int} current
		 * the current item index
		 */
		addShareThis: function( $metadata, $additional_info_link, current ) {
			var
			$target = $('<span>').attr('id', 'lightbox-share-this' ),
			prettyfragement = '#prettyPhoto[gallery]/' + current + '/',
			options = {
				"service":"sharethis",
				"element": $target[0],
				"url": $metadata.attr('data-url') ? $metadata.attr('data-url') + prettyfragement : '',
				"title": $metadata.attr('data-title') ? $metadata.attr('data-title') : '',
				"type": "large",
				"image": $metadata.attr('data-image') ? $metadata.attr('data-image') : '',
				"summary": $metadata.attr('data-summary') ? $metadata.attr('data-summary') : ''
			};

			this.Shareable = stWidget.addEntry( options );
			this.$sharethis_elm = $target;
			$additional_info_link.before( this.$sharethis_elm );
		},

		handleMetaDataClick : function( evt ) {
			var self = evt.data.self;
			evt.preventDefault();
			self.$metadata[self.current].data('clone').slideToggle();
		},

		handlePageChangeNext : function( keyboard ) {
			if ( !keyboard ) {
				carousel.$featured_carousel.$next.trigger('click');
			}
		},

		handlePageChangePrev : function( keyboard ) {
			if ( !keyboard ) {
				carousel.$featured_carousel.$prev.trigger('click');
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
			//self.manageShareThis( $('#inline-' + self.current ), $additional_info_link, self.current );
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

		/**
		 * @param {object} $metadata
		 * jQuery object
		 *
		 * @param {object} $additional_info_link
		 * jQuery object
		 *
		 * @param {int} current
		 * the current item index
		 */
		manageShareThis: function( $metadata, $additional_info_link, current ) {
			if ( $.isEmptyObject( this.Shareable ) ) {
				this.addShareThis( $metadata, $additional_info_link, current );
			} else {
				this.updateShareThis( $metadata, $additional_info_link, current );
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

			anno.addPlugin(
				'RunCoCo_Attachment',
				{}
			);
			anno.addPlugin(
				'RunCoCo',
				{
					base_url :
						window.location.protocol + "//" +
						window.location.host + "/" +
						RunCoCo.locale +
						"/annotations"
				}
			);
			anno.addPlugin(
				'Flag',
				{
					base_url :
						window.location.protocol + "//" +
						window.location.host + "/" +
							RunCoCo.locale + "/annotations"
				}
			);
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
			lightbox.ppOptions.collection_total = carousel.pagination_total;
			lightbox.ppOptions.description_src = 'data-description';
			lightbox.ppOptions.image_markup = '<img id="fullResImage" src="{path}" class="annotatable">';
			lightbox.ppOptions.overlay_gallery = false;
			lightbox.ppOptions.show_title = false;
			lightbox.ppOptions.social_tools = false;

			$("#contributions-featured a[rel^='prettyPhoto']").prettyPhoto( lightbox.ppOptions );
		},

		/**
		 * @param {object} $metadata
		 * jQuery object
		 *
		 * @param {object} $additional_info_link
		 * jQuery object
		 *
		 * @param {int} current
		 * the current item index
		 */
		updateShareThis: function( $metadata, $additional_info_link, current ) {
			var prettyfragement = '#prettyPhoto[gallery]/' + current + '/';
			this.Shareable.url = $metadata.attr('data-url') ? $metadata.attr('data-url') + prettyfragement : '';
			this.Shareable.title = $metadata.attr('data-title') ? $metadata.attr('data-title') : '';
			this.Shareable.image = $metadata.attr('data-image') ? $metadata.attr('data-image') : '';
			this.Shareable.summary = $metadata.attr('data-summary') ? $metadata.attr('data-summary') : '';
			$additional_info_link.before( this.$sharethis_elm );
		}
	},


	leaflet = {
		init: function() {
			var
			map_options,
			markers;

			if (
				RunCoCo.leaflet.markers !== undefined &&
				$.isArray( RunCoCo.leaflet.markers )
			) {
				markers = RunCoCo.leaflet.markers;
			}

			if ( RunCoCo.leaflet.map_options !== undefined ) {
				map_options = RunCoCo.leaflet.map_options;
			}

			europeana.leaflet.init({
				add_europeana_ctrl: true,
				add_minimap: true,
				map_options: map_options,
				markers: markers
			});
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
					.attr(
						'href',
						'/contributions/search?q=' +
						self.placename.replace(/,/g,'').replace(/ /g,'+')
					)
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
			var
			$elm = $(this),
			destination_url =
				'/contributions/' +
				$elm.data('contribution-id') +
				'/attachments/' +
				$elm.data('attachment-id') +
				'?layout=0';

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
				requested_item < 1 ||
				requested_item > total_items
			) {
				return;
			}

			carousel.photogallery_hash_check = true;
			carousel.replaceItemPlaceholderCheck( requested_index );
		},

		init: function() {
			if ( carousel.$featured_carousel !== null ) {
				photoGallery.checkHash();
				carousel.$featured_carousel.hideOverlay();
			} else {
				setTimeout(
					photoGallery.init,
					100
				);
			}
		}
	};

	if (
		( $(window).width() <= 768 || $(window).height() <= 500 ) &&
		!( /iPad/.test( navigator.platform ) ) &&
		navigator.userAgent.indexOf( "AppleWebKit" ) > -1
	) {
		pdf_viewer = add_lightbox = false;
	}

	RunCoCo.translation_services.init( $('.translate-area') );
	europeana.carousel.init('contributions-featured');
	lightbox.init();
	pdf.init();
	photoGallery.init();
	leaflet.init();

}( jQuery ));
