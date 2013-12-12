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
		current_tab : { id : null, hash : null },
		
		
		handleContentLoad : function( active_tab_id ) {
			
			this.ajax_load_processed = true;
			jQuery(active_tab_id ).attr('data-loaded','true');
			
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
					url = jQuery(active_tab_id ).attr('data-url'),
					content_id = jQuery(active_tab_id).attr('data-content-id');
			
			
			if ( !url || !self.ajax_load_processed || jQuery(active_tab_id ).attr('data-loaded') === 'true' ) { return; }
			self.ajax_load_processed = false;
			
			try {
				
				jQuery( content_id ).load(
					
					url + ' ' + content_id + ' > *',
					null,
					function() { self.handleContentLoad( active_tab_id ); }
					
				);
				
			} catch(e) {}
			
		},
		
		
		setFormAction : function( active_tab_id ) {
			
			var action_url =
					RunCoCo.relativeUrlRoot +
					jQuery(active_tab_id).attr('data-search-action');
			
			jQuery('#search').attr('action', action_url );
			
		},
		
		
		toggleLoaderDiv : function( active_tab_id ) {
			
			this.$tabs.each(function() {
				
				var $elm = jQuery(this);
				
				if ( ( '#' + $elm.attr('id') ) !== active_tab_id ) {
					
					jQuery( $elm.attr('data-content-id') ).fadeOut();
					
				} else {
					
					jQuery( $elm.attr('data-content-id') ).fadeIn('slow');
					
				}
				
			});
			
			jQuery( jQuery(active_tab_id).attr('data-content-id') ).find('.loading-feedback').fadeIn();
			
			jQuery('.stories').masonry({
				itemSelector : 'li',
				columnWidth : 1,
				isFitWidth : true,
				isAnimated : true
			});
			
		},
		
		
		toggleTabs : function( active_tab_id ) {
			
			var self = this;
			
			this.$tabs.each(function(){
				
				var $elm = jQuery(this);
				
				if ( ( '#' + $elm.attr('id') ) !== active_tab_id ) {
					
					$elm.removeClass('active');
					
				} else {
					
					$elm.addClass('active');
					self.current_tab.hash = $elm.attr('data-hash');
					self.current_tab.id = '#' + $elm.attr('id');
					
				}
				
			});
			
		},
		
		
		handleResultsTabClick : function( evt ) {
			
			var self = evt.data.self,
					$elm = jQuery(this),
					active_tab_id = '#' + $elm.attr('id');
			
			self.toggleTabs( active_tab_id );
			self.toggleLoaderDiv( active_tab_id );
			toggleAutoComplete( active_tab_id );
			self.setFormAction( active_tab_id );
			self.retrieveContent( active_tab_id );
			
		},
		
		
		checkTabState : function() {
			
			var hash = window.location.hash,
					$active_content = jQuery( jQuery( this.current_tab.id ).attr('data-content-id') );
			
			
			if ( hash.length > 0 && hash !== this.current_tab.hash ) {
				
				this.$tabs.each(function() {
					
					var $elm = jQuery(this);
					
					if ( hash == $elm.attr('data-hash') ) {
						
						$elm.trigger('click');
						
					}
					
				});
				
			} else {
				
				if ( $active_content.is(':hidden') ) {
					
					$active_content.fadeIn();
					
				}
				
			}
			
		},
		
		
		tabListener : function() {
			
			var self = this;
			
			self.checkTabState();
			setInterval( function() { self.checkTabState(); }, 200 );
			
		},
		
		
		setupTabs : function() {
			
			var self = this;
			
			self.$tabs.each(function() {
				
				var $elm = jQuery(this),
						content_id = $elm.attr('data-content-id');
				
				/**
				 *	modify tab links
				 *	data-url : url to be used for ajax load of tab content
				 *	data-loaded : string indicating whether or not section content has been loaded
				 *	active css class : indicating whether or not the tab is active
				 *	data-url : populate with existing href attrib if it is not a hash tag and replace the href with hash tag
				 *	from the data-hash that will be used to maintain tab state for emailing url or going back in browser history
				 */
					
					if ( $elm.attr('href').substring(0,1) !== '#' ) {
						
						$elm.attr( 'data-url', $elm.attr('href') );
						$elm.attr( 'href', $elm.attr('data-hash') );
						$elm.attr( 'data-loaded', 'false' );
						
					} else {
						
						$elm.attr( 'data-loaded', 'true' );
						$elm.addClass('active');
						self.current_tab.hash = $elm.attr('data-hash');
						self.current_tab.id = '#' + $elm.attr('id');
						
					}
				
				
				/**
				 *	add loading div to empty tabs
				 */
					
					if ( jQuery( content_id ).html() === '' ) {
						
						jQuery( content_id ).append( self.loading_feedback );
						
					}
				
				
				/**
				 *	add onclick handler
				 */
					
					$elm.on( 'click', { self : self }, self.handleResultsTabClick );
				
			});
			
		},
		
		
		init : function() {
			
			this.setupTabs();
			this.tabListener();
			
		}
		
	};
	
	function toggleAutoComplete ( active_tab_id ) {
		
		jQuery('#q').autocomplete({
			minLength : 3,
			source : document.location.protocol + '//' + document.location.host + '/suggest.json',
			select: function(event, ui) { 
				var self = this; 
				setTimeout( function() { 
					var field = jQuery('<input type="hidden" name="field" />').attr('value', ui.item.field);
					jQuery(self).after(field).closest('form').submit(); 
				}, 100 ); 
			},
			disabled: ( ( typeof(active_tab_id) !== 'undefined') && (active_tab_id != '#results-tab-contributions') )
		});
	
	}
	
	
	function init() {
		
		var $container = jQuery('.stories');
		
		if ($container.length > 0) {
			$container.imagesLoaded(function() {
				$container.masonry({
					itemSelector : 'li',
					columnWidth : 1,
					isFitWidth : true,
					isAnimated : true
				});
			});
		}
		
		resultTabs.init();
		toggleAutoComplete();
		
	}
	
	init();
	
}());
