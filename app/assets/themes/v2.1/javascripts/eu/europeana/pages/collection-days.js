/*global europeana, jQuery */
/*jslint browser: true, white: true */
(function($ ) {

	'use strict';

	$('.chosen-select').chosen();

	europeana.leaflet.init({
		europeana_ctrls: false,
		google_layer: false,
		minimap: false
	});

}( jQuery ));