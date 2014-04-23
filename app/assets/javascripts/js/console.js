/*global js */
/*jslint browser: true, white: true */
(function( js ) {

	'use strict';

	if ( js === undefined ) {
		window.js = {};
	}

	var empty_console	= {
		error : function() {
			return;
		},
		info : function() {
			return;
		},
		log : function() {
			return;
		},
		warn: function() {
			return;
		}
	};

	js.console = {
		debug : true
	};

	if ( !window.console ) {
		window.console = empty_console;
		js.console = empty_console;
	} else {
		js.console =
			js.console.debug
			? window.console
			: empty_console;
	}

}( js ));
