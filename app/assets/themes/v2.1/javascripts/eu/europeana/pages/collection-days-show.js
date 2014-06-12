// http://www.abeautifulsite.net/blog/2012/12/feature-detection-for-css-transitions-via-jquery-support/
jQuery.support.transition = (function(){
	var thisBody = document.body || document.documentElement,
		thisStyle = thisBody.style,
		support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;
	return support;
})();

(function( $ ) {

	'use strict';

	var leaflet = {

		$get_directions: $('#get-directions'),
		map: {},
		$map_container: $('#map-container'),
		routing_ctrl: undefined,


		addGetDirectionsListener: function addGetDirectionsListener() {
			this.$get_directions.on('click', this.handleGetDirectionsClick);
		},

		addLeafletMap: function addLeafletMap() {
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

			this.map = europeana.leaflet.init({
				add_routing: true,
				map_options: map_options,
				markers: markers
			});
		},

		addMapContainerListener: function addMapContainerListener() {
			this.$map_container.on(
				'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',
				this.mapComtainerTransitionHandler
			);
		},

		addRouting: function addRouting() {
			this.routing_ctrl = L.Routing.control({
				waypoints: [
					'',
					L.latLng(
						RunCoCo.leaflet.markers[0].latlng[0],
						RunCoCo.leaflet.markers[0].latlng[1]
					)
				],
				geocoder: L.Control.Geocoder.nominatim(),
				lineOptions: {
					styles: [
						// Shadow
						{color: 'black', opacity: 0.8, weight: 11},
						// Outline
						{color: 'green', opacity: 0.8, weight: 8},
						// Center
						{color: 'orange', opacity: 1, weight: 4}
					]
				}
			});

			this.routing_ctrl.addTo(this.map);
			this.$routing_ctrl = $(this.routing_ctrl._container);
		},

		addRoutingAndResize: function addRoutingAndResize() {
			leaflet.invalidateSize();
			leaflet.addRouting();
		},

		/**
		 *
		 * @param {Event} evt
		 * jQuery Event
		 */
		handleGetDirectionsClick: function handleGetDirectionsClick( evt ) {
			evt.preventDefault();

			if ( leaflet.$map_container.hasClass('expand') ) {
				leaflet.$map_container.removeClass('expand');
				leaflet.$get_directions.text( I18n.t( 'javascripts.collection-days.get-directions' ) );
				leaflet.$routing_ctrl.fadeOut();
			} else {
				leaflet.$map_container.addClass('expand');
				leaflet.$get_directions.text( I18n.t( 'javascripts.collection-days.close-directions' ) );

				if ( leaflet.routing_ctrl !== undefined ) {
					leaflet.$routing_ctrl.fadeIn();
				} else if ( !$.support.transition ) {
					console.log('here');
					setTimeout(
						leaflet.addRoutingAndResize,
						500
					);
				}
			}
		},

		init: function init() {
			this.addLeafletMap();
			this.addGetDirectionsListener();
			this.addMapContainerListener();
		},

		invalidateSize: function invalidateSize() {
			this.map.invalidateSize({
				animate: true,
				pan: false
			});
		},

		mapComtainerTransitionHandler: function mapComtainerTransitionHandler( evt ) {
			if ( evt.target === evt.currentTarget ) {
				leaflet.addRoutingAndResize();
				leaflet.$map_container.off(
					'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd'
				);
			}
		}
	};

	leaflet.init();

}( jQuery ));
