/*global europeana, jQuery */
/*jslint browser: true, white: true */
(function( $ ) {

	'use strict';

	var
	mobile_context = false;

	if ( !window.europeana ) {
		window.europeana = {};
	}

	europeana.chosen = {

		/**
		 * @param {Event} arguments[0]
		 * jQuery Event
		 *
		 * @param {Event} evt
		 * a jQuery Event object
		 *
		 * @param {object} chosen
		 * a chosen object that contains:
		 *  - a selected attribute with the value of any items in the dropdown
		 *    selected, separated by a |
		 *  - a deselected attribute with the value of any items in the dropdown
		 *    deselected, separated by a |
		 *
		 */
		handleChange: function( evt, chosen ) {
			if (
				chosen === undefined ||
				chosen.selected === undefined
			) {
				return;
			}

			var
			pieces = chosen.selected.split('|');

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
					chosen.selected;
			}
		},

		init: function() {
			if ( mobile_context ) {
				$('#collection-day-selector').hide();
			} else {
				$('.chosen-select').chosen().change( this.handleChange );
			}
		}
	};

	if ( ( $(window).width() <= 768 || $(window).height() <= 500 ) ) {
		mobile_context = true;
	}

}( jQuery ));