/*global jQuery */
/*jslint browser: true, regexp: true, white: true */
(function( $ ) {

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

			$new_content.find("#institution-featured a[rel^='prettyPhoto']").each(function() {
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

			if ( ( index + 1 ) > items_length ) {
				index = carousels.$featured_carousel.items.length - 1;
			} else if ( index < 0 ) {
				index = 0;
			}
		},

		init: function() {
			var self = this;

			$('#institution-featured').imagesLoaded( function() {
				self.$featured_carousel =
					$('#institution-featured').rCarousel({
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
			href,
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
		ppOptions : {},

		setupPrettyPhoto : function() {
			lightbox.ppOptions.callback = function() {
				// this insures that additional content that was loaded while
				// in lightbox is lightbox enabled if the lightbox is closed
				lightbox.init();
			};

			lightbox.ppOptions.changepagenext = lightbox.handlePageChangeNext;
			lightbox.ppOptions.changepageprev = lightbox.handlePageChangePrev;
			lightbox.ppOptions.changepicturecallback = lightbox.handlePictureChange;
			lightbox.ppOptions.collection_total = carousels.pagination_total;
			lightbox.ppOptions.description_src = 'data-description';
			lightbox.ppOptions.overlay_gallery = false;
			lightbox.ppOptions.show_title = false;
			lightbox.ppOptions.social_tools = false;

			$("#institution-featured a[rel^='prettyPhoto']").prettyPhoto( lightbox.ppOptions );
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

		hideLightboxContent: function() {
			var $pp_pic_holder = $('.pp_pic_holder');
			$pp_pic_holder.find('#pp_full_res object,#pp_full_res embed').css('visibility','hidden');
			$pp_pic_holder.find('.pp_fade').fadeOut('fast',function(){
				$('.pp_loaderIcon').show();
			});
		},

		removeLightboxLinks : function() {
			$('#institution-featured a').each(function() {
				var $elm = jQuery(this),
						contents = $elm.contents();

				if ( !$elm.hasClass('pdf') && !$elm.hasClass('original-context') ) {
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
		}
	},

	map = {

	    cancel:function(){
	    	$("#map-container").remove();
	    },
		init:function(){

			if(typeof latLong == 'undefined'){
				map.cancel();
				return;
			}

			if(typeof latLong[0] =='string'  || latLong.length != 2){
				map.cancel();
				return;
			}

			// this test could happen on the back end too

			var regex = /^\s*-?\d+\.\d+\,\s?-?\d+\.\d+\s*$/

			if( ! latLong.join(',').match(regex) ){
				map.cancel();
				return;
			}

			var mapLatitude  = parseFloat(latLong[0]);
			var mapLongitude = parseFloat(latLong[1]);
			var mapZoom      = typeof mapZoom != 'undefined' && mapZoom.length && parseInt(mapZoom).length ? parseInt(mapZoom) : 8;

			var dependencies = [
				'http://maps.googleapis.com/maps/api/js?sensor=false&amp;libraries=places&amp;key=AIzaSyARYUuCXOrUv11afTLg72TqBN2n-o4XmCI',
				themePath + 'leaflet.js',
				themePath + 'leaflet.css'
			];

			console.log(JSON.stringify(dependencies));


        	var recursiveLoad = function(index){
        		index = index ? index : 0;
        		if(dependencies.length > index){
					if( dependencies[index].split('.').pop() == 'css'){
						$('head').append('<link rel="stylesheet" href="' + dependencies[index] + '" type="text/css"/>');
    					recursiveLoad(index + 1);
					}
					else{
	          			$.ajax({
            				"url": dependencies[index],
            				"dataType": "script",
            				"success": function(){
            					recursiveLoad(index + 1);
            				},
            				"fail":function(e){console.log('fail: ' + e);},
            				"error":function(e){console.log('error: ' + e);},
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
        					    "title":	I18n.t('javascripts.leaflet.label.map_view'),
        					    "layer":	mq
        				    },
        				    {
        					    "title":	I18n.t('javascripts.leaflet.label.satellite_view'),
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
	},


	tags = {
		init : function() {

			var form     = $('#add_tags_form');
			var tagInput = $('#tags');
			var token    = $('input[name=authenticity_token]').val();


			var writeTags = function(){

				tagInput.val('');

				// update tags display
				var pageUrl = window.location.href;
				pageUrl = pageUrl.indexOf('?') > -1 ? pageUrl.substr(0, pageUrl.indexOf('?')) : pageUrl;
					console.log('pageUrl: ' + pageUrl)
				$.ajax({
					url:  pageUrl + '/tags.json?ajax=true'
				}).done(function(res) {
					var panel = $('.tags-panel ul');
					if(!panel.length){
						$('#add_tags_form').before('<div class="panel tags-panel"><ul class="tags clearfix"></ul></div>');
						var panel = $('.tags-panel ul');
						console.log("CREATED a tags panel");
					}
					else{
						console.log("we have a tags panel");
					}
					console.log(JSON.stringify(res));
					panel.empty();
					$.each(res.tags, function(i, ob){
						console.log("prepare to append... " + JSON.stringify(ob)  );
						panel.append(	'<li>'
									+		'<a href="/' + I18n.locale + '/collection/search?tag=' + ob + '">' + ob + '</a>'
									+		'<div class="action-links">'
									+			'<ul>'
									+				'<li>'
									+					'<a href="' + res.contrib_path + '/tags/' + ob + '/delete" data-confirm="' + res.tDelete + '" data-mathod="put" class="delete">' + res.tConfirm + '</a>'
									+				'</li>'
									+			'</ul>'
									+		'</div>'
									+	'</li>');
						console.log("done append" + i);
					});
				});
			}


			if (form.length) {
				// form submission
				form.submit(function(){

					$.ajax({
						type: "POST",
						url:  form.attr('action'),
						data: {"tags": tagInput.val(), "authenticity_token" : token }
					}).done(function() {
						writeTags();
					});
					return false;
				});

				// delete links

				$( ".tags-panel" ).on("click", "a.delete",
					function( e ) {
						e.stopPropagation();
						e.preventDefault();
						e = $(e.target);
						var tagName = e.closest('.action-links').prev('a').html();
						if( confirm( e.attr('data-confirm') )){
							$.ajax({
								type: "POST",
								url:  form.attr('action') + '/' + tagName,
								data: { "authenticity_token" : token, "_method" : "delete" }
							}).done(function() {
								writeTags();
							})

						}
				} );

			}
		}
	},


	mimetype = {
		carousel_reveal_count: 0,
		carousel_reveal_max_count: 100,
		carousel_reveal_wait: 100,
		$items: $('#institution-featured a'),
		itemsHandled: 0,
		itemsTotal: 0,

		ajax: {
			/**
			 * retrieve the HTTP headers of a given URL
			 * when proveded by the $elm’s data-record attribute
			 *
			 * @param {object} $elm
			 */
			get: function( $elm ) {
				if ( $elm.attr('data-record') === undefined ) {
					mimetype.incrementItemsHandled();
					return;
				}

				$.ajax({
					complete: mimetype.incrementItemsHandled,
					error: function() {
						mimetype.removeLightbox( $elm );
					},
					success: function( data ) {
						if ( data['content-type']
							&& data['content-type'][0]
						) {
							if ( data['content-type'][0].indexOf( 'text/html' ) !== -1 ) {
								mimetype.removeLightbox( $elm );
							} else if (
								data['content-type'][0] === 'application/pdf'
								|| data['content-type'][0] === 'pdf'
							) {
								mimetype.replaceWithPdfLink( $elm );
							}
						}
					},
					timeout: 5000,
					type: 'GET',
					url: $elm.attr('data-record') + '/headers.json'
				});
			}
		},

		incrementItemsHandled: function() {
			mimetype.itemsHandled += 1;

			if ( mimetype.itemsHandled === mimetype.itemsTotal ) {
				lightbox.init();
				mimetype.revealCarousel();
			} else if ( mimetype.itemsHandled === 1 ) {
				mimetype.ajax.get( mimetype.$items.eq( mimetype.itemsHandled ) );
			} else {
				mimetype.ajax.get( mimetype.$items.eq( mimetype.itemsHandled ) );
			}
		},

		init: function() {
			mimetype.itemsTotal = mimetype.$items.length;

			if ( mimetype.itemsTotal < 1 ) {
				mimetype.revealCarousel();
				return;
			}

			mimetype.ajax.get( mimetype.$items.eq( mimetype.itemsHandled ) );
		},

		removeLightbox: function( $elm ) {
			var img = $elm.find('img').clone(),
			$parent = $elm.parent();
			$elm.remove();
			$parent.append( img );
		},

		replaceWithPdfLink: function( $elm ) {
			$elm
				.removeAttr( 'rel' )
				.attr( 'href', $elm.attr( 'data-record' ) + '?edmpdf=true' )
				.attr( 'target', '_blank' );
		},

		revealCarousel: function() {
			if ( carousels.$featured_carousel !== null ) {
				carousels.$featured_carousel.hideOverlay();
			} else {
				mimetype.carousel_reveal_count += 1;

				if ( mimetype.carousel_reveal_count >= mimetype.carousel_reveal_max_count ) {
					return;
				}

				setTimeout(
					function() {
						mimetype.revealCarousel();
					},
					mimetype.carousel_reveal_wait
				);
			}
		}
	},

	photoGallery = {
		items_per_page: 1,

		checkHash: function() {
			var $elm,
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

	truncate.init();
	RunCoCo.translation_services.init( jQuery('.translate-area') );
	carousels.init();
	map.init();
	mimetype.init(); // lightbox is now initialized within this object
	photoGallery.init();

}( jQuery ));
