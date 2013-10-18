/**
 *	@author dan entous <contact@gmtplusone.com>
 *	@todo: add method for handling window re-size so that pdf viewer
 *	can be re-determined. also handle portrait/landscape issues
 */
(function() {

	'use strict';
	var pdf_viewer =
		( jQuery(window).width() <= 768 || jQuery(window).height() <= 500 )
		&& ( !( /iPad/.test( navigator.platform ) && navigator.userAgent.indexOf( "AppleWebKit" ) > -1 ) )
		? false
		: true,
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

			if ( jQuery('#contributions-featured').length < 1 ) {
				return;
			}

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


	fitvids = {
		init : function() {
			console.log($('#contributions-featured li'));
			$('#contributions-featured li').fitVids({
				customSelector: "iframe[src^='//localhost']"
			})
		}
	},


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

		/*
		$map : jQuery('#location-map'),
		$overlay : jQuery('<div/>', { 'class' : 'carousel-overlay' }),
		$story_map : jQuery('<div/>', { id : 'story-map' }),
		$google_map : jQuery('<div/>', { id : "google-map" }),
		placename : jQuery('#location-placename').val(),
		$placename_link : jQuery('<a/>'),
		$story_took_place : jQuery('<b/>'),

		addMapContainer : function() {
			jQuery('.add-tags')
				.before(
					jQuery( this.$google_map )
						.append( this.$story_took_place )
						.append( this.$story_map )
						.append( this.$overlay )
				);

			this.$story_map.css( 'height', jQuery('.one-half-right').width() );
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
		},

		locationMap : function() {
			if ( this.$map.length === 1 ) {
				this.addMapContainer();
				RunCoCo.GMap.Display.init('story-map', this.removeOverlay );
			}
		},

		removeOverlay : function() {
			if ( map.$overlay.is(':visible') ) {
				setTimeout( function() { map.$overlay.fadeOut(); }, 200 );
			}
		}
		*/
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
					alert(pageUrl)
				$.ajax({
					url:  pageUrl + '/tags.json?ajax=true'
				}).done(function(res) {
					var panel = $('.tags-panel ul');
					if(!panel.length){
						$('#add_tags_form').before('<div class="panel tags-panel"><ul class="tags clearfix"></ul></div>');
						var panel = $('.tags-panel ul');
						alert("we have CREATED a tags panel");
					}
					else{
						alert("we have a tags panel");
					}
					alert(JSON.stringify(res));
					panel.empty();
					$.each(res.tags, function(i, ob){
						console.log("prepare to append... " + JSON.stringify(ob)  );
						alert("prepare to append... " + JSON.stringify(ob)  );
						panel.append(	'<li>'
									+		'<a href="' + res.contrib_path.replace(/[0-9]/g, '') + 'tagged/' + ob + '">' + ob + '</a>'
									+		'<div class="action-links">'
									+			'<ul>'
									+				'<li>'
									+					'<a href="' + res.contrib_path + '/tags/' + ob + '/delete" data-confirm="' + res.tDelete + '" data-mathod="put" class="delete">' + res.tConfirm + '</a>'
									+				'</li>'
									+			'</ul>'
									+		'</div>'
									+	'<li>');
						console.log("done append" + i);
						alert("done append" + i);

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

	};


	(function() {
		truncate.init();
		RunCoCo.translation_services.init( jQuery('.nav-top') );
		carousels.init();
		//fitvids.init();
		map.init();
		//pdf.init();
		tags.init();
		js.utils.initSearch();

		js.loader.loadScripts([{
			file : 'accordion-tabs.js',
			path : themePath + "javascripts/eu/europeana/",
			callback : function(){
				new AccordionTabs( $('#explore-further'),
					function(){
						console.log("tab change event");
					}
				);
			}
		}]);
	}());

}());
