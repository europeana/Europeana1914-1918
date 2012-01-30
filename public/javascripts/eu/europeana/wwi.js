/**
 *	@fileOverview
 *	container for specific js functionality in the europeana 1914-1918 project
 *
 *	@author dan entous &lt;contact@pennlinepublishing.com&gt;
 *	@version 2012-01-24 14:48 gmt +1
 */
(function() {

	'use strict';
	
	eu.europeana.wwi = {
		
		
		toggleCollapsibleSection : function() {
			
			jQuery(this).parent().find('ol').toggle('height');
			
		},
		
		
		/**
		 *	collapses sections based on class="collapse"
		 *	assumes that legend is present and will become the clickable trigger
		 */
		setupCollapsibleSections : function() {
			
			var self = this;
			
			jQuery('.collapsible').each(function() {
			
				var $elm = jQuery(this);
				$elm.find('legend').eq(0).bind( 'click', { self : self }, self.toggleCollapsibleSection );
				
			});
			
			
		},
		
		
		showSubmission : function( evt ) {
			
			var $target = jQuery( jQuery(this).attr('href') );
			
			evt.preventDefault();
			
			jQuery('body').animate({
				
				scrollTop : 0,
				duration : 800
				
			});
			
			if ( $target.is(':hidden') ) {
				
				$target.toggle('height');
				
			}
			
		},
		
		
		setupShowSubmission : function() {
			
			var self = this;
			
			jQuery('a[href="#continue-to-submission"]').each(function() {
			
				jQuery(this).bind( 'click', self.showSubmission );
				
			});
			
		},
		
		
		init : function() {
			
			// this.setupCollapsibleSections();
			this.setupShowSubmission();
			
		}
		
	};
	
	
	eu.europeana.wwi.init();
	
}( jQuery, eu ));