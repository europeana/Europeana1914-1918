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

		handleMetaDataClick : function( evt ) {
			var self = evt.data.self;
			evt.preventDefault();
			self.$metadata[self.current].data('clone').slideToggle();
		},

		handlePageChangeNext : function( keyboard ) {
			if ( !keyboard ) {
				carousel.$featured_carousel.$nav_next.trigger('click');
			}
		},

		handlePageChangePrev : function( keyboard ) {
			if ( !keyboard ) {
				carousel.$featured_carousel.$nav_prev.trigger('click');
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
			europeana.sharethis.manageShareThis( $('#inline-' + self.current ), $additional_info_link, self.current );
			//europeana.embedly.manageEmbedly( $('#inline-' + self.current ), $additional_info_link, self.current );
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
		}

	},


	leaflet = {
		addLeafletMap: function() {
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
				add_layer_toggle_ctrl: true,
				add_minimap: true,
				map_options: map_options,
				markers: markers
			});
		},

		init: function() {
			if ( RunCoCo.leaflet === undefined ) {
				return;
			}

			this.addLeafletMap();
		}
	},


	more_like_this = {
		$carousel: {},
		node_id: '',

		init: function( node_id ) {
			var self = this;

			this.node_id = node_id;

			$('#' + this.node_id).imagesLoaded( function() {
				self.$carousel =
					$('#' + self.node_id).rCarousel({
						item_width_is_container_width : false,
						listen_to_arrow_keys: false,
						$nav_next : $('<input>', {
							'type' : 'image',
							'class' : 'medium',
							'alt' : 'next',
							'src' : '/assets/jquery/plugins/rcarousel/images/carousel-arrow-right.png',
							'style' : 'display: none;',
							'data-dir' : 'next'
						}),
						$nav_prev : $('<input>', {
							'type' : 'image',
							'class' : 'medium',
							'alt' : 'previous',
							'src' : '/assets/jquery/plugins/rcarousel/images/carousel-arrow-left.png',
							'style' : 'display: none;',
							'data-dir' : 'prev'
						})
					}).data('rCarousel');
			});
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
	europeana.embedly.init();
	europeana.carousel.init('contributions-featured');
	more_like_this.init('more-like-this');
	lightbox.init();
	pdf.init();
	photoGallery.init();
	leaflet.init();

}( jQuery ));
