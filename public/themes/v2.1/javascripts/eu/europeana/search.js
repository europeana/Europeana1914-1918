/*global jQuery */
/*jslint browser: true, regexp: true, white: true */
(function() {

	'use strict';

    var addMasonry = function(msg){

    	if(typeof jQuery('.body').masonry=='undefined'){
    		return;
    	}

    	console.log('add masonry[' + msg + '], ' + jQuery('.stories:visible').length + ', has class? ' + jQuery('.stories:visible').hasClass('masonry')   );


		jQuery('.stories:visible').imagesLoaded(function() {
						
			if( jQuery('.stories li').length > 2 ){
				jQuery('.stories:visible').masonry({
					itemSelector : 'li:not(.result-count)',
					isFitWidth : true,
					isAnimated : true,
					gutterWidth: 21
				});				
			}
			hideSpinner();
		});
    };

	var addCollapsibility = function(){
		var headingSelector		= "h3 a";

		var doIt = function(){

			var openers = [];

			$("#facets>li").not('.filter-section').each(function(i, ob){
				ob = $(ob);
				ob.Collapsible({
						"headingSelector"	: headingSelector,
						"bodySelector"		: "ul"
				});

				if(ob.find('input[type=checkbox]:checked').length || ob.find('input[type=radio]:checked').length){
					openers.push(ob.find(headingSelector));
				}
			});

			$.each(openers, function(i, opener){
				opener.click();
			});

		}
		if(typeof $('body').Collapsible == 'undefined'){
			js.loader.loadScripts([{
        	   file : 'EuCollapsibility.js',
        	   path : themePath + "javascripts/eu/europeana/",
        	   name : 'collapsibility',
        	   callback : doIt
           }]);
		}
		else{
			doIt();
		}
	};

    var showSpinner = function(){
    	$('#results').append('<div class="ajax-overlay"></div>');
        $('#results').addClass('loading');
    };

    var hideSpinner = function(){
    	$('.ajax-overlay').remove();
        $('#results').removeClass('loading');
    };

	var doAfterLoad = function(){

		addMasonry();
		addCollapsibility();

        // kill firefox cache
        $(":checkbox").attr("autocomplete", "off");
        $(":radio").attr("autocomplete", "off");

        // fix capitalised facets
		var capitalise = function(str){
			return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
		}

		$([
		 '#facets a[data-value="&qf[]=TYPE:TEXT"]',
		 '#facets a[data-value="&qf[]=TYPE:IMAGE"]',
		 '#facets a[data-value="&qf[]=TYPE:VIDEO"]',
		 '#facets a[data-value="&qf[]=TYPE:SOUND"]']).each(function(){

			 $(this).each(function(){
				 if($(this).closest('.filter-section').length){
					 return;
				 }
				 var label = $(this).html();
				 if(label){
					 var innerLabel = $(this).find('label');
					 if( innerLabel.length ){
						 label = innerLabel.html();
						 innerLabel.html(capitalise(label));
					 }
					 else{
						 $(this).html(capitalise(label));
					 }
				 }

			 });
		 })

		 $(['.filters a[data-value="&qf[]=TYPE:TEXT"]',
		    '.filters a[data-value="&qf[]=TYPE:IMAGE"]',
		    '.filters a[data-value="&qf[]=TYPE:VIDEO"]',
		    '.filters a[data-value="&qf[]=TYPE:SOUND"]']).each(function(){
		    	var label = $(this).prev('a');
		    	if(label && label.length){
		    		var text = label.html().split(' ');
		    		text = text[0] + ' ' + capitalise(text[1]);
		    		label.html(text);
		    	}
		    })

		$('#facets input[type="checkbox"]').click(function(){
			$(this).closest('form').submit();
		});
		$('#facets input[type="radio"]').click(function(){
			$(this).closest('form').submit();
		});

		// back links

		var activeHash = $('#results-tabs li a.active').attr('data-hash').replace('#', '');
		if(activeHash != 'collection'){
			$.each( $('.stories').find('li').not('.result-count').find('a'), function(i, link){
				link = $(link);
				var param = link.attr('href').indexOf('?') > 0 ? '&' : '?';
				link.attr('href', link.attr('href') + param + 'anchor=' + activeHash);
			});
		}


	};


	var resultTabs = {

		$tabs : jQuery('#results-tabs a'),
		loading_feedback : '<div class="loading-feedback"></div>',
		ajax_load_processed : true,
		current_tab : { id : null, hash : null },


		handleContentLoad : function( active_tab_id ) {

			this.ajax_load_processed = true;
			jQuery(active_tab_id ).attr('data-loaded','true');


			doAfterLoad();
		},


		retrieveContent : function( active_tab_id ) {

			var self = this,
					url = jQuery(active_tab_id ).attr('data-url'),
					content_id = jQuery(active_tab_id).attr('data-content-id');


			if ( !url || !self.ajax_load_processed || jQuery(active_tab_id ).attr('data-loaded') === 'true' ) {
				doAfterLoad();
				return;
			}
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

			console.log('toggle: active_tab_id = ' + active_tab_id );

			this.$tabs.each(function() {
				var $elm = jQuery(this);
				if( ( '#' + $elm.attr('id') ) !== active_tab_id ){
					jQuery( $elm.attr('data-content-id') ).fadeOut();
				}
				else {
					jQuery( $elm.attr('data-content-id') ).fadeIn('slow');
				}
			});

			jQuery( jQuery(active_tab_id).attr('data-content-id') ).find('.loading-feedback').fadeIn();

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

			showSpinner();

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

				 // add loading div to empty tabs


				if ( jQuery( content_id ).html() === '' ) {
					jQuery( content_id ).append( self.loading_feedback );
				}

				//	add onclick handler

				$elm.on( 'click', { self : self }, self.handleResultsTabClick );

			});

		},

		init : function(callback) {
			this.setupTabs();
			this.tabListener();
			if(typeof callback != undefined){
				callback();
			}
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
			disabled: ( ( typeof(active_tab_id) !== 'undefined') && ((active_tab_id != '#results-tab-contributions') || (active_tab_id != '#results-tab-collection')) )
		});

	}


	function init() {


		resultTabs.init(function(){
//			toggleAutoComplete();
		});

		if(window.location.href.indexOf('#')==-1){
			doAfterLoad();
			//addMasonry('init');
			//addCollapsibility();
		}

	}

	init();

}());
