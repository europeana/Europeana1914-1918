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

		init: function() {
			var self = this;

			$('#institution-featured, #institution-thumbnails').imagesLoaded( function() {
				self.$featured_carousel =
					jQuery('#institution-featured').rCarousel({
						item_width_is_container_width : true,
					}).data('rCarousel');

				self.$thumbnail_carousel =
					jQuery('#institution-thumbnails').rCarousel({
						listen_to_arrow_keys : false,
						item_width_is_container_width : false,
						nav_button_size : 'small',
						navigation_style : 'one-way-by',
						nav_by : self.thumb_nav_by
					}).data('rCarousel');
			});
		}
	},

	map = {

	    cancel:function(){
	    	$("#map-container").remove();
	    },
		init:function(){

			if(typeof latLong == 'undefined' || latLong.length != 2){
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

			console.log(JSON.stringify(dependencies));


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
						//alert("done append" + i);
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
		RunCoCo.translation_services.init( jQuery('.translate-area') );
		carousels.init();
		map.init();
		tags.init();
//		js.utils.initSearch();

		js.loader.loadScripts([{
			file : 'EuAccordionTabs.js',
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
