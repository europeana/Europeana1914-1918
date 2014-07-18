/*global embedly, europeana, jQuery */
/*jslint browser: true, white: true */
(function( $ ) {

	'use strict';

	if ( !window.europeana ) {
		window.europeana = {};
	}


	europeana.embedly = {
		addEmbedButtonListener: function() {
			$('.embedly-button').on('click', function() {
				embedly.modal();
				return false;
			});
		},

		init: function() {
			this.addEmbedButtonListener();
		}
	};

}( jQuery ));