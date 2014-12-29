/*global js */
/*jslint browser: true, white: true */
(function() {

	'use strict';
	if ( !window.js ) { window.js = {}; }


	js.utils = {
		/**
		 * @param {object} $elm
		 * jQuery object representing the DOM element that needs to be highlighted
		 *
		 * @param {string} start_color
		 * a hexadecimal color code including the #; e.g., #ffff00
		 *
		 * @param {string} end_color
		 * a hexadecimal color code including the #; e.g., #f3f3f3
		 *
		 * @param {int} duration
		 */
		flashHighlight: function( $elm, start_color, end_color, duration ) {
			$elm.css( 'background-color', start_color );

			setTimeout(
				function() {
					$elm.css('background-color', end_color );
				},
				parseInt( duration, 10 )
			);
		}
	};

}( js ));
