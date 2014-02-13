/**
 *  console.js
 *
 *  @package	js
 *  @author		dan entous <contact@gmtplusone.com>
 *  @created	2011-03-30 16:13 gmt +1
 *  @version	2012-04-27 08:31 gmt +1
 */

/**
 *  @package	js
 *  @author		dan entous <contact@gmtplusone.com>
 */
(function() {
	
	'use strict';
	if ( !window.js ) { window.js = {}; }
	
	
	var empty_console	= {
		
		log		: function() {},
		error	: function() {},
		info	: function() {}
		
	};
	
	js.console = { debug : true }	
	
	if ( !window.console ) {
		
		window.console = empty_console;
		js.console = empty_console;
		
	} else {
		
		js.console = js.console.debug ? window.console : empty_console;
		
	}
	
}());