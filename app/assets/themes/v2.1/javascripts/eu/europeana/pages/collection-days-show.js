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

		addLeafletMap: function addLeafletMap( add_routing ) {
			this.map = europeana.leaflet.init({
				routing: add_routing
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
				//L.latLng(48.8588,2.3469),
				//L.latLng(52.3546,4.9039)
				],
				geocoder: L.Control.Geocoder.nominatim()
			});

			this.routing_ctrl.addTo(this.map);
			this.$routing_ctrl = $(this.routing_ctrl._container);
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
				leaflet.$routing_ctrl.fadeOut();
			} else {
				leaflet.$map_container.addClass('expand');

				if ( leaflet.routing_ctrl !== undefined ) {
					leaflet.$routing_ctrl.fadeIn();
				}
			}
		},

		init: function init() {
			if ( !$.support.transition ) {
				this.addLeafletMap( false );
				this.$get_directions.hide();
			} else {
				this.addLeafletMap( true );
				this.addGetDirectionsListener();
				this.addMapContainerListener();
			}
		},

		invalidateSize: function invalidateSize() {;
			this.map.invalidateSize({
				animate: true,
				pan: false
			});
		},

		mapComtainerTransitionHandler: function mapComtainerTransitionHandler( evt ) {
			if ( evt.target === evt.currentTarget ) {
				leaflet.invalidateSize();
				leaflet.addRouting();
				leaflet.$map_container.off(
					'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd'
				);
			}
		}
	};

	leaflet.init();

}( jQuery ));
