/**
 *	@author dan entous <contact@gmtplusone.com>
 *	@version 2012-09-07 10:36 gmt +1
 */
(function() {
	
	'use strict';
	
	/*
	var resultTabs = {
		
		$tabs : jQuery('#results-tabs a'),
		loading_feedback : '<div class="loading-feedback"></div>',
		ajax_load_processed : true,
		current_tab : { id : null, hash : null },
		
		
		handleContentLoad : function( active_tab_id ) {
			
			this.ajax_load_processed = true;
			jQuery(active_tab_id ).attr('data-loaded','true');
			
			jQuery('.stories').imagesLoaded(function() {
				initMasonry(jQuery('.stories'));
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
					'/' + I18n.currentLocale() +
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
			
			initMasonry(jQuery('.stories'));
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
			}
			else{
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
				
				
				 	//	modify tab links
				 	//	data-url : url to be used for ajax load of tab content
				 	//	data-loaded : string indicating whether or not section content has been loaded
				 	//	active css class : indicating whether or not the tab is active
				 	//	data-url : populate with existing href attrib if it is not a hash tag and replace the href with hash tag
				 	//	from the data-hash that will be used to maintain tab state for emailing url or going back in browser history
				 
					
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
				
				
				
					//	add loading div to empty tabs
					
					if ( jQuery( content_id ).html() === '' ) {
						
						jQuery( content_id ).append( self.loading_feedback );
						
					}
				
				
				
					// add onclick handler
				 
					
					$elm.on( 'click', { self : self }, self.handleResultsTabClick );
				
			});
			
		},
		// andy
		
		
		setupFacets : function(){
			
			// make facet sections collapsible
			$("#facets>li").each(function(i, ob){

				var headingSelector		= "h3 a";
				var headingSelected		= $(ob).find(headingSelector);
				var fnGetItems			= function(){
					
					// function to get the tabbable items
					if( headingSelected.parent().next('form').length ){
						// Add keywords
						return headingSelected.parent().next('form').find('input[type!="hidden"]');
					}
					else{
						// Other facets
						return headingSelected.parent().next('ul').first().find('a');
					}							
				};
				
				var accessibility =  new EuAccessibility(
					headingSelected,
					fnGetItems
				);
				
				if($(ob).hasClass('ugc-li')){
					$(ob).bind('keypress', accessibility.keyPress);
				}
				else{
					$(ob).Collapsible(
						{
							"headingSelector"	: "h3 a",
							"bodySelector"		: "ul",
							"keyHandler"		: accessibility
						}
					);				
				}
			});
			
			// make facet checkboxes clickable
			//$("#filter-search li input[type='checkbox']").click(function(){
			//	var label = $("#filter-search li label[for='" + $(this).attr('id') + "']");
			//	window.location = label.closest("a").attr("href");
			//});

			
		},
		
		init : function() {
			
			var self = this;
			
			self.setupTabs();
			self.tabListener();
			
		}
		
	};
	*/
	
	
	function initMasonry($container){
		$container.masonry({
			itemSelector : 'li',
			columnWidth : function( containerWidth ) {
				return parseInt(containerWidth / 3) - parseInt((4 * 8) / 3);	// (container-w / noCols) - (( (noCols -1 + 2 (edges)) * gutterWidth ) / noCols)
			},
			gutterWidth:	8,
			isAnimated :	true
		});		
	}
	
	function initFacets(){
		// ANDY: can't get loader dependencies working so nesting dynamic loads
		
		js.loader.loadScripts([{
			file : 'EuCollapsibility.js',
			path : themePath + "javascripts/eu/europeana/",
			callback : function(){
				js.loader.loadScripts([{
					file : 'EuAccessibility.js',
					path : themePath + "javascripts/eu/europeana/",
					callback : function(){
						//self.setupFacets();		// set up facets
						
						
						// make facet sections collapsible
						$("#facets>li").each(function(i, ob){

							var headingSelector		= "h3 a";
							var headingSelected		= $(ob).find(headingSelector);
							var fnGetItems			= function(){
								
								// function to get the tabbable items
								if( headingSelected.parent().next('form').length ){
									// Add keywords
									return headingSelected.parent().next('form').find('input[type!="hidden"]');
								}
								else{
									// Other facets
									return headingSelected.parent().next('ul').first().find('a');
								}							
							};
							
							var accessibility =  new EuAccessibility(
								headingSelected,
								fnGetItems
							);
							
							if($(ob).hasClass('ugc-li')){
								$(ob).bind('keypress', accessibility.keyPress);
							}
							else{
								$(ob).Collapsible(
									{
										"headingSelector"	: "h3 a",
										"bodySelector"		: "ul",
										"keyHandler"		: accessibility
									}
								);				
							}
						});
						
						// make facet checkboxes clickable
						//$("#filter-search li input[type='checkbox']").click(function(){
						//	var label = $("#filter-search li label[for='" + $(this).attr('id') + "']");
						//	window.location = label.closest("a").attr("href");
						//});

						
						
						
						js.loader.loadScripts([{
							file : 'EuMenu.js',
							path : themePath + "javascripts/eu/europeana/",
							callback : function(){

								
								var config = {
									"fn_init": function(self){
										//self.setActive( $("#query-search input[name=rows]").val() );
										alert("initialised menu");
									},
									"fn_item":function(self, selected){
										//window.location.href = eu.europeana.search.urlAlterParam("rows", selected);
										alert("selected item");
									}
								};
								
								var menuTop		= new EuMenu( $(".nav-top		.eu-menu"), config);
								var menuBottom	= new EuMenu( $(".nav-bottom	.eu-menu"), config);
							}
						}]);					
						
					}
				}]);					
			}
		}]);
	}
	
	
	function init() {
		
		js.utils.initSearch();
		
		var $container = jQuery('.stories');
		$container.imagesLoaded(function() {
			initMasonry($container);
		});
		
		jQuery('#q').autocomplete({
			minLength : 3,
			source : document.location.protocol + '//' + document.location.host + '/suggest.json',
			select: function(event, ui) { var self = this; setTimeout( function() { jQuery(self).closest('form').submit(); }, 100 ); }
		});
		
		//resultTabs.init();
		initFacets();
	}
	
	init();
	
}());
