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
	};

