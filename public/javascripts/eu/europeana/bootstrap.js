(function() {

	'use strict';
	
	
	/**
	 *	dynamic variables
	 */
		if ( 'undefined' === typeof window.js ) { window.js = {}; }	
		if ( 'undefined' === typeof window.eu ) { window.eu = {}; }
		if ( 'undefined' === typeof eu.europeana ) { eu.europeana = {}; }
		if ( 'undefined' === typeof eu.europeana.vars ) { eu.europeana.vars = {}; }
		
		eu.europeana.vars.rtl = jQuery('html').hasClass('rtl');
		eu.europeana.vars.language_code = jQuery('html').attr('lang');
		
	
	/**
	 *	js.console
	 *	a small utility that displays console output only when js.debug = true
	 *	and sets the log, error and info methods to empty functions when the browser
	 *  has no console
	 */
	
		if ( 'undefined' === typeof js.console ) {
			
			jQuery.ajax({url:'/javascripts/js/console.js',dataType:"script"});
			
		}
		
		
	/**
	 *	js.utils
	 *	utility methods for component loading
	 */
		
		if ( 'undefined' === typeof js.utils ) {
		
			jQuery.ajax({url:'/javascripts/js/utils.js',dataType:"script"});
			
		}
		
		
	/**
	 *	load page specifc scripts
	 */
		
		switch ( eu.europeana.vars.page_name ) {
			
			case 'x':
				break;
			
			
			default :
				jQuery.ajax({url:'/javascripts/eu/europeana/wwi.js',dataType:"script"});		
				break;
				
		}
	
	
}());