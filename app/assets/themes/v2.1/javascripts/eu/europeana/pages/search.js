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
      timeout: 3000
    },
    {
      msg: I18n.t( 'javascripts.search.30seconds' ),
      timer: 0,
      timeout: 8000
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

  bindGa = function() {

    $('.facet-section a').on('click', function(e){

      var facetRoot   = $(e.target).closest('.facet-section').find('h3');
      var facetAction = facetRoot.data('filter-name');

      if(typeof facetAction == 'undefined'){
        facetAction = facetRoot.text();
      }

      console.log('facetAction = ' + facetAction);

      ga('send', {
        hitType: 'event',
        eventCategory: 'Facets',
        eventAction: facetAction,
        eventLabel: 'Facet selection'
      });


      e.preventDefault();
      e.stopPropagation();

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
    bindGa();
  };

  init();

}( jQuery, I18n ));
