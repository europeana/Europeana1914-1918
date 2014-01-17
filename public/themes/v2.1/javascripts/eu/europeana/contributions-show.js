/**
 *	@author dan entous <contact@gmtplusone.com>
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
		previous_thumbnail_length : 0,
		thumb_nav_by : 3,

		nrItemsInCurrentContainer : function() {
			var total_items_in_previous_pgs = ( this.$thumbnail_carousel.page_nr - 1 ) * this.$thumbnail_carousel.items_per_container;
			return this.$thumbnail_carousel.items_length - total_items_in_previous_pgs;
		},

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

			if ( this.ajax_load_processed ) {
				return;
			}

			this.$contributions_featured_ul.append( this.$new_content.find('#contributions-featured ul li') );
			this.$featured_carousel.ajaxCarouselSetup();

			this.$contributions_thumbnails_ul.append( this.$new_content.find('#contributions-thumbnails ul li') );
			this.$thumbnail_carousel.ajaxCarouselSetup();

			this.$pagination_next = this.$new_content.find('#contributions-pagination .pagination a[rel=next]');
			this.$thumbnail_links = jQuery('#contributions-thumbnails ul a');

			this.addThumbnailClickHandlers();

			this.$thumbnail_carousel
				.$items
				.eq( this.previous_thumbnail_length )
				.find('a')
				.trigger('click');

			this.$thumbnail_carousel.toggleNav();
			this.pagination_checking = false;
			this.ajax_load_processed = true;
			this.$thumbnail_carousel.loading_content = false;

			this.$featured_carousel.hideOverlay();
			this.$thumbnail_carousel.hideOverlay();

			if ( add_lightbox ) {
				this.addImagesToLightbox( $new_content );
			} else {
				lightbox.removeLightboxLinks();
			}
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
		paginationContentCheck : function() {
			var href,
					next_page_link;

			this.pagination_checking = true;
			next_page_link = this.$pagination_next.attr('href');
			if ( !next_page_link ) {
				return;
			}

			next_page_link = next_page_link.split('?');
			this.previous_thumbnail_length = this.$thumbnail_carousel.items_length;

			href =
				next_page_link[0] +
				( next_page_link[0].indexOf('/attachments') === -1 ? '/attachments?carousel=true&' : '?' ) +
				next_page_link[1];

			this.retrieveContent( href );
		},

		updateTumbnailCarouselPosition : function( dir ) {
			if ( !this.$thumbnail_carousel || !dir ) {
				return;
			}
			this.$thumbnail_carousel.transition();
		},

		toggleSelected : function( selected_index ) {
			var self = this;

			self.$thumbnail_links.each(function(index) {
					var $elm = jQuery(this);

					if ( index === selected_index ) {
						if ( !$elm.hasClass('selected') ) {
							$elm.addClass('selected');
						}

						if ( self.$thumbnail_carousel ) {
							self.$thumbnail_carousel.current_item_index = selected_index;
						}
					} else {
						$elm.removeClass('selected');
					}
			});
		},

		updateCounts : function() {
			this.$thumbnail_counts.html(
				I18n.t('javascripts.thumbnails.item') + ' ' +
				( this.$featured_carousel.get('current_item_index') + 1 ) +
				' ' + I18n.t('javascripts.thumbnails.of') + ' ' +
				this.items_collection_total
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
			self.updateTumbnailCarouselPosition( dir );
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

		navThumbnail : function( dir ) {
			var $thumbnail = this.$thumbnail_carousel,
					pos = dir === 'next' ? this.thumb_nav_by : -this.thumb_nav_by,
					items_length = $thumbnail.options.items_collection_total > 0
						? $thumbnail.options.items_collection_total
						: $thumbnail.items_length;

			$thumbnail.options.cancel_nav = true;

			if ( $thumbnail.current_item_index + pos >= items_length ) {
				pos = items_length - 1;
			} else if ( $thumbnail.current_item_index + pos < 0 ) {
				pos = 0;
			} else {
				pos = $thumbnail.current_item_index + pos;
			}

			if ( pos <= items_length - 1 ) {
				if ( pos >= this.$thumbnail_carousel.items_length ) {
					this.paginationContentCheck();
				} else if ( $thumbnail.current_item_index !== pos )  {
					this.$thumbnail_carousel
						.$items
						.eq( pos )
						.find('a')
						.trigger('click');

					this.$thumbnail_carousel.toggleNav();
				}
			}
		},

		navFeatured : function( dir ) {
			var $featured = this.$featured_carousel,
					pos = dir === 'next' ? 1 : -1,
					items_length = $featured.options.items_collection_total > 0
						? $featured.options.items_collection_total
						: $featured.items_length;

			$featured.options.cancel_nav = true;

			if ( $featured.current_item_index + pos >= items_length ) {
				pos = items_length - 1;
			} else if ( $featured.current_item_index + pos < 0 ) {
				pos = 0;
			} else {
				pos = $featured.current_item_index + pos;
			}

			if ( pos <= items_length - 1 ) {
				if ( pos >= this.$thumbnail_carousel.items_length ) {
					this.paginationContentCheck();
				} else if ( $featured.current_item_index !== pos )  {
					this.$thumbnail_carousel
						.$items
						.eq( pos )
						.find('a')
						.trigger('click');

					this.$thumbnail_carousel.toggleNav();
				}
			}
		},

		init : function() {
			var self = this;

				self.$featured_carousel =
				jQuery('#contributions-featured').rCarousel({
					items_collection_total : parseInt( self.items_collection_total, 10 ),
					callbacks : {
						before_nav : function( dir ) {
							self.navFeatured( dir );
						}
					}
				}).data('rCarousel');

			jQuery('#contributions-thumbnails').imagesLoaded(function() {
				self.$thumbnail_carousel =
					this.rCarousel({
						items_collection_total : parseInt( self.items_collection_total, 10 ),
						listen_to_arrow_keys : false,
						item_width_is_container_width : false,
						nav_button_size : 'small',
						navigation_style : 'one-way-by',
						nav_by : this.thumb_nav_by,
						callbacks : {
							before_nav : function( dir ) {
								self.navThumbnail( dir );
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

			$('#institution-featured .view-item').each(function() {
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
		$story_took_place : jQuery('<b/>'),

		addMapContainer : function() {
			//jQuery('#thumbnail-counts')
			//jQuery('.metadata.show-on-item-collapsed')
			jQuery('#story-info')
				.after(
					jQuery( this.$google_map )
						.append( translated_map_contribution_heading )
						.append( this.$story_map )
						.append( this.$overlay )
				);

			//this.$story_map.css( 'height', jQuery('.one-half-right').width() );
			//this.$story_map.addClass( 'col-cell' );
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
					.append( I18n.t('javascripts.story.took-place') + ' ' )
					.append( self.$placename_link );
			}
		},


		init : function() {
			this.addStoryTookPlace();
			this.locationMap();
		}
	},

/*
	map = {

		init:function(){
			if(typeof latLong != 'undefined' && latLong.length == 2){
				var mapLatitude  = parseFloat(latLong[0]);
				var mapLongitude = parseFloat(latLong[1]);
				var mapZoom      = typeof mapZoom != 'undefined' && mapZoom.length && parseInt(mapZoom).length ? parseInt(mapZoom) : 8;

				var rootJsUrl    = themePath + 'javascripts/com/leaflet/';
				var rootCssUrl   = themePath + 'stylesheets/com/leaflet/';
				var dependencies = [
				    'http://maps.googleapis.com/maps/api/js?sensor=false&amp;libraries=places&amp;key=AIzaSyARYUuCXOrUv11afTLg72TqBN2n-o4XmCI',
    				'leaflet.js',
   					'Leaflet-MiniMap-master/src/Control.MiniMap.js',
   					'Leaflet-Pan/L.Control.Pan.js',
   					'leaflet-plugins-master/layer/tile/Google.js',
   					'leaflet.min.css',
   					'leaflet.ie.css',
   					'Leaflet-MiniMap-master/src/Control.MiniMap.css'
   				];

            	var recursiveLoad = function(index){
            		index = index ? index : 0;
            		if(dependencies.length > index){
    					if( dependencies[index].split('.').pop() == 'css'){
    						$('head').append('<link rel="stylesheet" href="' + rootCssUrl + dependencies[index] + '" type="text/css"/>');
        					recursiveLoad(index + 1);
    					}
    					else{
    	          			$.ajax({
                				"url": dependencies[index].indexOf('http') == 0 ? dependencies[index] :  rootJsUrl + dependencies[index],
                				"dataType": "script",
                				"success": function(){
                					recursiveLoad(index + 1);
                				},
                	            "contentType" :	"application/x-www-form-urlencoded;charset=UTF-8"
                			});
    					}
            		}
            		else{
            			var mqTilesAttr = 'Tiles &copy; <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" />';

            			// map quest
            			var mq = new L.TileLayer(
            				'http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.png',
            				{
            					minZoom: 4,
            					maxZoom: 18,
            					attribution: mqTilesAttr,
            					subdomains: '1234',
            					type: 'osm'
            				}
            			);

            			var map = L.map('map', {
            			    center: new L.LatLng(mapLatitude, mapLongitude),
            			    zoomControl: false,
            			    zoom: mapZoom
            			});

            			L.Icon.Default.imagePath = rootCssUrl + 'images/';
        				L.marker([mapLatitude, mapLongitude]).addTo(map);

            			var europeanaCtrls = jQuery('<div id="europeana-ctrls">').prependTo('#map-container');

            			var EuropeanaLayerControl = function(map, ops){

            				var self = this;

            				self.ops = ops;
            				self.map = map;
            				self.grp = null;

            				self._setLayer = function(index){
            					var layer = self.ops[index].layer;
            					self.grp.clearLayers();
            					self.grp.addLayer(layer);

            					jQuery(self.cmp.find("span")).removeClass('active');
            					jQuery(self.cmp.find("span").get(index)).addClass('active');
            				};

            				var html	= '';
            				var layers	= [];

            				jQuery.each(self.ops, function(i, ob){
            					html += '<a href="#' + ob.title + '"><span class="' + i + '">' + ob.title + '</span></a>';
            					layers[layers.length] = ob.layer;
            				});


            				self.cmp = jQuery('<div id="layer-ctrl">' + html + '</div>');

            				self.cmp.find("span").each(function(){
            					jQuery(this).click(function(){
            						self._setLayer(parseInt(jQuery(this).attr('class')));
            					});
            				});

            				self.grp = L.layerGroup(layers);
            				self.grp.addTo(self.map);
            				self._setLayer(0);

            				return {
            					getCmp : function(index){
            						return self.cmp;
            					}
            				}
            			};

            			var ggl = new L.Google();
            			map.addLayer(ggl);

            			var ctrlLayer = new EuropeanaLayerControl(map,
            				[
            					{
            					    "title":	"Map",
            					    "layer":	mq
            				    },
            				    {
            					    "title":	"Satellite",
            					    "layer":	ggl
            				    }
            			    ]
            			);

            			europeanaCtrls.append(ctrlLayer.getCmp());

            			// Overview map - requires duplicate layer
            			//var osm2 = new L.TileLayer(osmUrl, {minZoom: 0, maxZoom: 13, attribution: osmAttrib });
            			new L.Control.MiniMap(
            				new L.TileLayer(
            					'http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.png',
            					{
            						minZoom: 0,
            						maxZoom: 13,
            						attribution: mqTilesAttr,
            						subdomains: '1234',
            						type: 'osm'
            					}),
            				{toggleDisplay: true }
            			).addTo(map);
            			L.control.zoom().addTo(map);

            		}
            	}
            	recursiveLoad();
			}

		}
	},

*/
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
	},


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


	(function() {
		truncate.init();
		
		/* For moblie / desktop layouts we need the translate services to be in two different places.
		 * Unfortunately since the js for these services is not object oriented (no use of the "new" operator)
		 * and since the container name is hard-coded into the js the strategy is now to move the existing 
		 * instance of the translate services on window resize.
		 * */
		RunCoCo.translation_services.init( $('.translate-area') );

		carousels.init();
		map.init();
		lightbox.init();
		pdf.init();

		// fire fake resize event to trigger euRsz (in case window was loaded within mobile breakpoints)
		setTimeout(function(){ $(window).trigger('resize'); }, 100);

	}());

}());
