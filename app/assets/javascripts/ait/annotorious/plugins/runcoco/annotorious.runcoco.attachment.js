/*global annotorious, jQuery */
/*jslint browser: true, nomen: true, regexp: true, white: true */
/**
 * Attachment glue for RunCoCo storage plugin
 */
(function( annotorious, $ ) {
	'use strict';

	annotorious.plugin.RunCoCo_Attachment = function( config ) { };

	/**
	 * @param {object} annotator
	 */
	annotorious.plugin.RunCoCo_Attachment.prototype.onInitAnnotator = function( annotator ) {
		var img = $(annotator.getItem().element);
		var src = img.attr('src');
		var link = $('a[href="' + src + '"]');
		img.data('annotatable-id', link.data('attachment-id'));
		img.data('annotatable-type', link.data('annotatable-type'));
	};
	
	
}( annotorious, jQuery ));
