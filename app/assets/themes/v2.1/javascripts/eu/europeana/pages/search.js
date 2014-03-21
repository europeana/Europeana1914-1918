/*global jQuery, I18n */
/*jslint browser: true, regexp: true, white: true */
(function( $, I18n ) {
	'use strict';

	var
	$facet_section_h3s = $('.facet-section h3'),
	$facet_section_links = $('.facet-section a'),
	$filter_section_links = $('.filter-section a'),
	$results_items = $('#results-items'),
	$results_items_overlay = $('.results-items-overlay'),
	$results_tabs = $('#results-tabs a'),
	$facet_form = $('#results-facets').find('form'),
	$search_form = $('#search'),
	spinner_msgs = [
		{
			msg: I18n.t( 'javascripts.search.10seconds' ),
			timer: 0,
			timeout: 10000
		},
		{
			msg: I18n.t( 'javascripts.search.30seconds' ),
			timer: 0,
			timeout: 30000
		},
		{
			msg: I18n.t( 'javascripts.search.60seconds' ),
			timer: 0,
			timeout: 60000
		}
	],

	/**
	 * @param {string} msg
	 */
	addResultsSpinnerMsg = function( msg ) {
		var $msg = $('#results-spinner-msg');

		$msg.fadeOut(function() {
			$msg.html( msg ).fadeIn();
		});
	},

	cancelSpinnerTimers = function() {
		var i,
		ii = spinner_msgs.length;

		for ( i = 0; i < ii; i += 1 ) {
			clearTimeout( spinner_msgs[i].timer );
		}
	},

	/**
	 * @param {int} i
	 */
	addResultsSpinnerTimer = function( i ) {
		spinner_msgs[i].timer = setTimeout(
			function() {
				addResultsSpinnerMsg( spinner_msgs[i].msg );
			},
			spinner_msgs[i].timeout
		);
	},

	addResultsSpinnerListener = function() {
		var i,
		ii = spinner_msgs.length;

		for ( i = 0; i < ii; i += 1 ) {
			addResultsSpinnerTimer( i );
		}
	},

	/**
	 * @param {function} callback
	 */
	scrollToTop = function( callback ) {
		$('body').animate(
			{scrollTop:0},
			500,
			'swing',
			function() {
				if ( typeof callback === 'function' ) {
					callback();
				}
			}
		);
	},

	/**
	 * @param {object} evt jQuery Event object
	 */
	closeResultItems = function( evt ) {
		var $elm = $(this);

		evt.preventDefault();
		scrollToTop();

		$results_items.slideToggle( function() {
			$results_items
				.html('<div class="results-items-spinner"></div><p id="results-spinner-msg"></p>')
				.fadeIn( function() {
					switch ( evt.type ) {
						case 'click':
							window.location = $elm.attr('href');
							break;
						case 'submit':
							$elm.off('submit');
							$elm.submit();
							break;
					}

					addResultsSpinnerListener();
				});
		});
	},

	handleFacetSectionClick = function() {
		var $elm = $(this),
			$target = $elm.next();

		$target.slideToggle(function() {
			if ( $target.is(':visible') ) {
				$elm.removeClass('icon-arrow-6').addClass('icon-arrow-7');
			} else {
				$elm.removeClass('icon-arrow-7').addClass('icon-arrow-6');
			}
		});
	},

	addFacetSectionsListener = function() {
		$facet_section_h3s.each(function() {
			$(this).on('click', handleFacetSectionClick );
		});
	},

	/**
	 * @param {object} evt jQuery Event object
	 */
	handleFacetLinkClick = function ( evt ) {
		$(this).closest('ul').prev().trigger('click');
		closeResultItems.call( this, evt );
	},

	addFacetLinksListener = function() {
		$facet_section_links.each(function() {
			var $elm = $(this);
			$elm.on('click', handleFacetLinkClick );

			if ( $elm.hasClass('checked-checkbox') || $elm.hasClass('checked-radiobutton') ) {
				$(this).closest('ul').prev().trigger('click');
			}
		});
	},

	/**
	 * @param {object} evt jQuery Event object
	 */
	handleFilterLinkClick = function( evt ) {
		$(this).closest('ul').slideToggle();
		closeResultItems.call( this, evt );
	},

	addFilterLinksListener = function() {
		$filter_section_links.each( function() {
			$(this).on('click', handleFilterLinkClick );
		});
	},

	addResultsTabsListener = function() {
		$results_tabs.each( function() {
			$(this).on('click', closeResultItems );
		});
	},

	/**
	 * assumes there is only one input field with the name qf[q][]
	 * used to add keywords
	 *
	 * @param {object} evt jQuery Event object
	 */
	handleFacetFormListener = function( evt ) {
		$facet_form.find('input[name="qf[q][]"]').closest('ul').prev().trigger('click');
		closeResultItems.call( this, evt );
	},

	addFacetFormListener = function() {
		$facet_form.on('submit', handleFacetFormListener);
	},

	handleSearchFormListener = function( evt ) {
		closeResultItems.call( this, evt );
	},

	addSearchFormListener = function() {
		$search_form.on('submit', handleSearchFormListener);
	},

	/**
	 * @param {object} evt jQuery Event object
	 */
	handleResultItemClick = function( evt ) {
		var self = this;
		evt.preventDefault();

		scrollToTop(function() {
			closeResultItems.call( self, evt );
		});
	},

	addResultItemsListener = function() {
		$results_items.find('a').each( function() {
			$(this).on('click', handleResultItemClick);
		});
	},

	removeLoadingOverlay = function() {
		$results_items_overlay.fadeOut();
		$results_items.removeClass('with-overlay');
		cancelSpinnerTimers();
	},

	addMasonry = function() {
		$('.stories').imagesLoaded( function() {
			$('.stories').masonry({
				itemSelector : 'li:not(.result-count)',
				isFitWidth : true,
				isAnimated : true,
				gutterWidth: 21
			});

			addResultItemsListener();
			removeLoadingOverlay();
		});
	},

	init = function() {
		addResultsSpinnerListener();
		addFacetSectionsListener();
		addFacetLinksListener();
		addFilterLinksListener();
		addResultsTabsListener();
		addSearchFormListener();
		addFacetFormListener();
		scrollToTop();
		addMasonry();
	};

	init();




	/**
	 * this file needs a lot of clean-up.
	 * keeping this code commented out in order to re-factor it as necessary
	 */
	//var addMasonry = function() {
	//	if ( jQuery('.body').masonry === undefined ){
	//		console.log( 'returning' );
	//		return;
	//	}
	//
	//	//console.log('add masonry[' + msg + '], ' + jQuery('.stories:visible').length + ', has class? ' + jQuery('.stories:visible').hasClass('masonry')   );
	//
	//	jQuery('.stories:visible').imagesLoaded(function() {
	//
	//		if( jQuery('.stories li').length > 2 ){
	//			jQuery('.stories:visible').masonry({
	//				itemSelector : 'li:not(.result-count)',
	//				isFitWidth : true,
	//				isAnimated : true,
	//				gutterWidth: 21
	//			});
	//		}
	//		hideSpinner();
	//	});
	//};
	//
	//var showSpinner = function(){
	//	$('#results')
	//		.addClass('loading')
	//		.append('<div class="ajax-overlay"></div>');
	//};
	//
	//var hideSpinner = function(){
	//	$('#results').removeClass('loading');
	//	$('.ajax-overlay').remove();
	//};
	//
	//var doAfterLoad = function(){
	//
	//	addMasonry();
	//	addCollapsibility();
	//
	//	// back links
	//
	//	var activeHash = $('#results-tabs li a.active').attr('data-hash').replace('#', '');
	//	if(activeHash != 'collection'){
	//		$.each( $('.stories').find('li').not('.result-count').find('a'), function(i, link){
	//			link = $(link);
	//			var param = link.attr('href').indexOf('?') > 0 ? '&' : '?';
	//			link.attr('href', link.attr('href') + param + 'anchor=' + activeHash);
	//		});
	//	}
	//
	//
	//};

	//var resultTabs = {
	//
	//	$tabs : jQuery('#results-tabs a'),
	//	loading_feedback : '<div class="loading-feedback"></div>',
	//	ajax_load_processed : true,
	//	current_tab : { id : null, hash : null },
	//
	//	handleContentLoad : function( active_tab_id ) {
	//		this.ajax_load_processed = true;
	//		jQuery(active_tab_id ).attr('data-loaded','true');
	//
	//		doAfterLoad();
	//	},
	//
	//	retrieveContent : function( active_tab_id ) {
	//		var self = this,
	//				url = jQuery(active_tab_id ).attr('data-url'),
	//				content_id = jQuery(active_tab_id).attr('data-content-id');
	//
	//		if ( !url || !self.ajax_load_processed || jQuery(active_tab_id ).attr('data-loaded') === 'true' ) {
	//			doAfterLoad();
	//			return;
	//		}
	//		self.ajax_load_processed = false;
	//
	//		try {
	//			jQuery( content_id ).load(
	//				url + ' ' + content_id + ' > *',
	//				null,
	//				function() { self.handleContentLoad( active_tab_id ); }
	//			);
	//		} catch(e) {}
	//	},
	//
	//	setFormAction : function( active_tab_id ) {
	//		var action_url =
	//				RunCoCo.relativeUrlRoot +
	//				jQuery(active_tab_id).attr('data-search-action');
	//
	//		jQuery('#search').attr('action', action_url );
	//	},
	//
	//	toggleLoaderDiv : function( active_tab_id ) {
	//		//console.log('toggle: active_tab_id = ' + active_tab_id );
	//
	//		this.$tabs.each(function() {
	//			var $elm = jQuery(this);
	//			if( ( '#' + $elm.attr('id') ) !== active_tab_id ){
	//				jQuery( $elm.attr('data-content-id') ).fadeOut();
	//			}
	//			else {
	//				jQuery( $elm.attr('data-content-id') ).fadeIn('slow');
	//			}
	//		});
	//
	//		jQuery( jQuery(active_tab_id).attr('data-content-id') ).find('.loading-feedback').fadeIn();
	//	},
	//
	//	toggleTabs : function( active_tab_id ) {
	//		var self = this;
	//
	//		this.$tabs.each(function() {
	//			var $elm = jQuery(this);
	//			if ( ( '#' + $elm.attr('id') ) !== active_tab_id ) {
	//				$elm.removeClass('active');
	//			} else {
	//				$elm.addClass('active');
	//				self.current_tab.hash = $elm.attr('data-hash');
	//				self.current_tab.id = '#' + $elm.attr('id');
	//			}
	//		});
	//	},
	//
	//	handleResultsTabClick : function( evt ) {
	//		showSpinner();
	//
	//		var self = evt.data.self,
	//				$elm = jQuery(this),
	//				active_tab_id = '#' + $elm.attr('id');
	//
	//		self.toggleTabs( active_tab_id );
	//		self.toggleLoaderDiv( active_tab_id );
	//		toggleAutoComplete( active_tab_id );
	//		self.setFormAction( active_tab_id );
	//		self.retrieveContent( active_tab_id );
	//	},
	//
	//	checkTabState : function() {
	//		var hash = window.location.hash,
	//				$active_content = jQuery( jQuery( this.current_tab.id ).attr('data-content-id') );
	//
	//		if ( hash.length > 0 && hash !== this.current_tab.hash ) {
	//			this.$tabs.each(function() {
	//				var $elm = jQuery(this);
	//
	//				if ( hash == $elm.attr('data-hash') ) {
	//					$elm.trigger('click');
	//				}
	//			});
	//		} else {
	//			if ( $active_content.is(':hidden') ) {
	//				$active_content.fadeIn();
	//			}
	//		}
	//	},
	//
	//	tabListener : function() {
	//		var self = this;
	//
	//		self.checkTabState();
	//		setInterval( function() { self.checkTabState(); }, 200 );
	//	},
	//
	//	setupTabs : function() {
	//		var self = this;
	//
	//		self.$tabs.each(function() {
	//			var $elm = jQuery(this),
	//					content_id = $elm.attr('data-content-id');
	//
	//			//	modify tab links
	//			//	data-url : url to be used for ajax load of tab content
	//			//	data-loaded : string indicating whether or not section content has been loaded
	//			//	active css class : indicating whether or not the tab is active
	//			//	data-url : populate with existing href attrib if it is not a hash tag and replace the href with hash tag
	//			//	from the data-hash that will be used to maintain tab state for emailing url or going back in browser history
	//
	//			if ( $elm.attr('href').substring(0,1) !== '#' ) {
	//				$elm.attr( 'data-url', $elm.attr('href') );
	//				$elm.attr( 'href', $elm.attr('data-hash') );
	//				$elm.attr( 'data-loaded', 'false' );
	//			} else {
	//				$elm.attr( 'data-loaded', 'true' );
	//				$elm.addClass('active');
	//				self.current_tab.hash = $elm.attr('data-hash');
	//				self.current_tab.id = '#' + $elm.attr('id');
	//			}
	//
	//			 // add loading div to empty tabs
	//			if ( jQuery( content_id ).html() === '' ) {
	//				jQuery( content_id ).append( self.loading_feedback );
	//			}
	//
	//			//	add onclick handler
	//			$elm.on( 'click', { self : self }, self.handleResultsTabClick );
	//		});
	//	},
	//
	//	init : function(callback) {
	//		this.setupTabs();
	//		this.tabListener();
	//		if(typeof callback != undefined){
	//			callback();
	//		}
	//	}
	//};
  //
	//function toggleAutoComplete ( active_tab_id ) {
	//	jQuery('#q').autocomplete({
	//		minLength : 3,
	//		source : document.location.protocol + '//' + document.location.host + '/suggest.json',
	//		select: function(event, ui) {
	//			var self = this;
	//			setTimeout( function() {
	//				var field = jQuery('<input type="hidden" name="field" />').attr('value', ui.item.field);
	//				jQuery(self).after(field).closest('form').submit();
	//			}, 100 );
	//		},
	//		disabled: ( ( typeof(active_tab_id) !== 'undefined') && ((active_tab_id != '#results-tab-contributions') || (active_tab_id != '#results-tab-collection')) )
	//	});
	//}
	//
	//function init() {
	//	resultTabs.init(function(){
	//		//toggleAutoComplete();
	//	});
	//
	//	if(window.location.href.indexOf('#')==-1){
	//		doAfterLoad();
	//		//addMasonry('init');
	//		//addCollapsibility();
	//	}
	//}

}( jQuery, I18n ));
