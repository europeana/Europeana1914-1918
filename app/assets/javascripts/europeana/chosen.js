/*global europeana, jQuery */
/*jslint browser: true, white: true */
(function( $ ) {

	'use strict';

	if ( !window.europeana ) {
		window.europeana = {};
	}

	europeana.chosen = {

		/**
		 * @param {Event} arguments[0]
		 * jQuery Event
		 *
		 * @param {object} arguments[1]
		 * @param {string} arguments[1].selected
		 */
		handleChange: function() {
			if (
				arguments[1] === undefined ||
				arguments[1].selected === undefined
			) {
				return;
			}

			var pieces = arguments[1].selected.split('|');

			if ( pieces.length === 2 && pieces[1] === 'searchable' ) {
				window.location.href =
					window.location.protocol + "//" +
					window.location.host + "/" +
					'collection/explore/collection_day/' +
					pieces[0] +
					'?qf[index]=c';
			} else {
				window.location.href =
					window.location.protocol + "//" +
					window.location.host + "/" +
					'collection-days/' +
					arguments[1].selected;
			}
		},

		init: function() {
			$('.chosen-select').chosen().change( this.handleChange );
		}
	};

}( jQuery ));