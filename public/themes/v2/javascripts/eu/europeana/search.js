/**
 *	@author dan entous <contact@gmtplusone.com>
 *	@version 2012-09-07 10:36 gmt +1
 */
(function() {
	
	'use strict';
	
	
	var resultTabs = {
		
		$tabs : jQuery('#results-tabs a'),
		loading_feedback : '<div class="loading-feedback"></div>',
		ajax_load_processed : true,
		
		
		handleContentLoad : function( active_tab_id ) {
			
			this.ajax_load_processed = true;
			jQuery( '#' + active_tab_id ).attr('data-loaded','true');
			
			jQuery('.stories').imagesLoaded(function() {
				jQuery('.stories').masonry({
					itemSelector : 'li',
					columnWidth : 1,
					isFitWidth : true,
					isAnimated : true
				});
			});
			
		},
		
		
		retrieveContent : function( active_tab_id ) {
			
			var self = this,
					url = jQuery('#' + active_tab_id ).attr('data-url');
			
			
			if ( !url || !self.ajax_load_processed || jQuery('#' + active_tab_id ).attr('data-loaded') === 'true' ) { return; }
			self.ajax_load_processed = false;
			
			try {
				
				jQuery(jQuery('#' + active_tab_id ).attr('href')).load(
					url + ' ' + jQuery('#' + active_tab_id ).attr('href'),
					null,
					function() { self.handleContentLoad( active_tab_id ); }				
				);
				
			} catch(e) {}
			
		},
		
		
		setFormAction : function( active_tab_id ) {
			
			var action_url =
					RunCoCo.relativeUrlRoot +
					'/' + I18n.currentLocale() +
					jQuery('#' + active_tab_id).attr('data-search');
			
			jQuery('#search').attr('action', action_url );
			
		},
		
		
		toggleLoaderDiv : function( active_tab_id ) {
			
			this.$tabs.each(function() {
				
				var $elm = jQuery(this);
				
				if ( active_tab_id !== $elm.attr('id') ) {
					
					jQuery( $elm.attr('href') ).fadeOut();
					
				} else {
					
					jQuery( $elm.attr('href') ).fadeIn();
					
				}
				
			});
			
			jQuery( jQuery('#' + active_tab_id).attr('href') ).find('.loading-feedback').fadeIn();
			
				jQuery('.stories').masonry({
					itemSelector : 'li',
					columnWidth : 1,
					isFitWidth : true,
					isAnimated : true
				});
			
		},
		
		
		toggleTabs : function( active_tab_id ) {
			
			this.$tabs.each(function(){
				
				var $elm = jQuery(this);
				
				if ( $elm.attr('id') !== active_tab_id ) {
					
					$elm.removeClass('active');
					
				} else {
					
					$elm.addClass('active');
					
				}
				
			});
			
		},
		
		
		handleResultsTabClick : function( evt ) {
			
			var self = evt.data.self,
					$elm = jQuery(this),
					active_tab_id = $elm.attr('id');
			
			evt.preventDefault();
			self.toggleTabs( active_tab_id );
			self.toggleLoaderDiv( active_tab_id );
			self.setFormAction( active_tab_id );
			self.retrieveContent( active_tab_id );
			
		},
		
		
		setupTabs : function() {
			
			var self = this;
			
			self.$tabs.each(function() {
				
				var $elm = jQuery(this);
				
				/**
				 *	modify tab links
				 *	add data-url, data-loaded, active class
				 *	modify href
				 */
					
					if ( $elm.attr('href').substring(0,1) !== '#' ) {
						
						$elm.attr( 'data-url', $elm.attr('href') );
						$elm.attr( 'href', '#' + $elm.attr('id').replace('-tab','') );
						$elm.attr( 'data-loaded', 'false' );
						
					} else {
						
						$elm.attr( 'data-loaded', 'true' );
						$elm.addClass('active');
						
					}
				
				
				/**
				 *	add loading div to empty tabs
				 */
					
					if ( jQuery( $elm.attr('href') ).html() === '' ) {
						
						jQuery( $elm.attr('href') ).append( self.loading_feedback );
						
					}
				
				
				/**
				 *	add onclick handler
				 */
					
					$elm.on( 'click', { self : self }, self.handleResultsTabClick );
				
			});
			
		},
		
		
		init : function() {
			
			this.setupTabs();
			
		}
		
	};
	
	
	function init() {
		
		var $container = jQuery('.stories');
		
		$container.imagesLoaded(function() {
			$container.masonry({
				itemSelector : 'li',
				columnWidth : 1,
				isFitWidth : true,
				isAnimated : true
			});
		});
		
		jQuery('#q').autocomplete({
			minLength : 3,
			source : document.location.protocol + '//' + document.location.host + '/suggest.json',
			select: function(event, ui) { var self = this; setTimeout( function() { jQuery(self).closest('form').submit(); }, 100 ); }
		});
		
		resultTabs.init();
		
	}
	
	init();
	
}());
