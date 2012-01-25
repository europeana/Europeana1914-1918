/**
 *	@fileOverview
 *	a small utility that displays console output only when js.debug = true
 *	and sets the log, error and info methods to empty functions when the browser
 *  has no console
 *
 *	@author dan entous &lt;contact@pennlinepublishing.com&gt;
 *	@version 2011-11-18 14:14 gmt +1
 */
(function() {
	
	'use strict';
	
	if ( !window.js ) {
	
		window.js = {};
		
	}
	
	js.has_own_console = true;
	
	js.empty_console = {
		
		log : function() {},
		error : function() {},
		info : function() {}
		
	};
	
	js.console = js.empty_console;
	
	if ( !window.console ) {
		
		window.console = js.console;
		js.has_own_console = false;
		
	}
	
	if ( js.debug ) {
		
		js.console = window.console;
		
	}
	
}());