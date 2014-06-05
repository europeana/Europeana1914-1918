/*global europeana, I18n, jQuery */
/*jslint browser: true, white: true */
(function($ ) {

	'use strict';

	$('.chosen-select').chosen();

	var
	legend_content =
		'<h2>' + I18n.t( 'javascripts.collection-days.legend' ) + '</h2>' +
		'<div class="marker-icon marker-icon-green">' + I18n.t( 'javascripts.collection-days.upcoming' ) + '</div>' +
		'<div class="marker-icon marker-icon-red">' + I18n.t( 'javascripts.collection-days.past-entered' ) + '</div>' +
		'<div class="marker-icon marker-icon-purple">' + I18n.t( 'javascripts.collection-days.past-not-entered' ) + '</div>' +
		'<label><input type="checkbox" /> ' + I18n.t( 'javascripts.collection-days.show-past' ) + '</label>' +
		'<a href="#what-is-it">' + I18n.t( 'javascripts.collection-days.what-is-it' ) + '</a>';

	europeana.leaflet.init({
		europeana_ctrls: false,
		google_layer: false,
		legend: {
			display: true,
			content: legend_content
		},
		minimap: false
	});

}( jQuery ));