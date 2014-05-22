/*global annotorious, jQuery */
/*jslint browser: true, nomen: true, regexp: true, white: true */
/**
 * EDM glue for RunCoCo storage plugin
 */
(function( annotorious, $ ) {
	'use strict';

	annotorious.plugin.RunCoCo_EDM = function( config ) { };

	/**
	 * @param {object} annotator
	 */
	annotorious.plugin.RunCoCo_EDM.prototype.onInitAnnotator = function( annotator ) {
		var img = $(annotator.getItem().element);
		var src = img.attr('src');
		var link = $('a[href="' + src + '"]');
		img.data('annotatable-id', link.data('annotatable-id'));
		img.data('annotatable-type', link.data('annotatable-type'));
	};
	
	
}( annotorious, jQuery ));
