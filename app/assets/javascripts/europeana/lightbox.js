/*global anno, embedly, europeana, jQuery, mejs, RunCoCo */
/*jslint browser: true, white: true */
(function( $ ) {

  'use strict';

  if ( !window.europeana ) {
    window.europeana = {};
  }


  europeana.lightbox = {

    annotorious_setup: false,
    current : 0,
    $metadata : [],
    options: {
      add_embedly: false,
      add_lightbox: false,
      add_metadata: false,
      add_sharethis: false,
      carousel: {},
      contribution_page: false,
      edm_page: false
    },
    ppOptions : {},


    /**
     * @param {object} $elm
     * jQuery object
     */
    addMetaDataOverlay : function( $elm ) {
      var
      self = this,
      $pic_full_res = jQuery('#pp_full_res'),
      $pp_content = jQuery('.pp_content');

      if ( !self.$metadata[self.current] ) {
        self.$metadata[self.current] = ( jQuery( $elm.attr('href') ) );
        self.$metadata[ self.current ].data('clone', self.$metadata[ self.current ].clone() );
      }

      self.$metadata[ self.current ].data('clone').appendTo( $pp_content );

      self.$metadata[ self.current ].data('clone').css({
        height :
          $pic_full_res.find('img').height() -
          parseInt( self.$metadata[ self.current ].data('clone').css('padding-top'), 10 ) -
          parseInt( self.$metadata[ self.current ].data('clone').css('padding-bottom'), 10 )
      });

      $pic_full_res.append( self.$metadata[ self.current ].find('.metadata-license').html() );
    },

    handleMetaDataClick : function( evt ) {
      var self = evt.data.self;
      evt.preventDefault();
      self.$metadata[self.current].data('clone').slideToggle();
    },

    handlePageChangeNext : function( keyboard ) {
      if ( !keyboard ) {
        europeana.lightbox.options.carousel.$featured_carousel.$nav_next.trigger('click');
      }
    },

    handlePageChangePrev : function( keyboard ) {
      if ( !keyboard ) {
        europeana.lightbox.options.carousel.$featured_carousel.$nav_prev.trigger('click');
      }
    },

    /**
     *	this - refers to the generated lightbox div
     *	the div is removed each time the lightbox is closed
     *	so these elements need to be added back to the div
     *	with each open
     */
    handlePictureChange : function() {
      var self = europeana.lightbox,
      $elm = jQuery(this),
      $lightbox_description = $elm.find('.pp_description'),
      $additional_info_link = $lightbox_description.find('a.lightbox-info').first();

      anno.reset();
      anno.hideSelectionWidget();

      if ( self.options.add_metadata ) {
        if ( self.$metadata[self.current] ) {
          if ( self.$metadata[self.current].data('clone').is(':visible') ) {
            self.$metadata[self.current].data('clone').hide();
          }

          if ( self.$metadata[self.current].data('cloned') ) {
            self.$metadata[self.current].data('cloned', false);
          }
        }

        $additional_info_link.on('click', { self : self }, self.handleMetaDataClick );
        self.current = parseInt( $additional_info_link.attr('href').replace('#inline-',''), 10 );
        self.addMetaDataOverlay( $additional_info_link );
      }

      if ( self.options.add_sharethis ) {
        europeana.sharethis.manageShareThis( $('#inline-' + self.current ), $lightbox_description, self.current );
      }

      if ( self.options.add_embedly ) {
        europeana.embedly.manageEmbedly( $('#inline-' + self.current ), $lightbox_description, self.current );
      }

      var userLoggedIn = $('#navigation-user .username').length > 0;
      if(!userLoggedIn){
        $('.annotorious-annotationlayer').append(
          '<span id="login-to-annotate" style="position: absolute; top:0.25em; border-radius:0.25em; left:0.25em; padding: 0.25em 0.75em 1em 0; background-color: rgba(0,0,0,0.45); color: white;">'
          + '<span class="annotorious-hint-icon" style="width: auto; position: relative; padding-left: 1.25em; left: 3px;">'
          +   'Log in to annotate'
          + '</span>'
          + '</span>'
        );
      }

      anno.addHandler('onMouseOverItem', function(annotation){
        var userLoggedIn = $('#navigation-user .username').length > 0;
        console.log('mouse over...');
        if(userLoggedIn){
          $('#login-to-annotate').remove();
        }
      });

    },

    hideLightboxContent: function() {
      var $pp_pic_holder = $('.pp_pic_holder');
      $pp_pic_holder.find('#pp_full_res object,#pp_full_res embed').css('visibility','hidden');
      $pp_pic_holder.find('.pp_fade').fadeOut('fast',function(){
        $('.pp_loaderIcon').show();
      });
    },

    /**
     * @param {bool} options
     */
    init : function( options ) {
      this.options = $.extend( true, {}, this.options, options );

      if ( this.options.add_lightbox ) {
        this.setupPrettyPhoto();
        this.setupAnnotorious();
      } else {
        this.removeLightboxLinks();
      }
    },

    removeLightboxLinks : function() {
      this.options.$elm.find('a').each(function() {
        var $elm = jQuery(this),
            contents = $elm.contents();

        if ( !$elm.hasClass('pdf') && !$elm.hasClass('original-context') ) {
          $elm.replaceWith(contents);
        }
      });

      this.options.$elm.find('.view-item').each(function() {
        jQuery(this).remove();
      });
    },

    removeMediaElementPlayers : function() {
      var i;

      if ( window.mejs === undefined ) {
        return;
      }

      for ( i in mejs.players ) {
        if ( mejs.players.hasOwnProperty(i) ) {
          mejs.players[i].remove();
        }
      }

      mejs.mepIndex = 0;
    },

    setupAnnotorious : function() {
      if ( this.annotorious_setup ) {
        return;
      }

      if ( this.options.contribution_page ) {
        anno.addPlugin( 'RunCoCo_Attachment', {} );
      }

      if ( this.options.edm_page ) {
        anno.addPlugin( 'RunCoCo_EDM', {} );
      }

      anno.addPlugin(
        'RunCoCo',
        {
          base_url :
            window.location.protocol + "//" +
            window.location.host + "/" +
            RunCoCo.locale +
            "/annotations"
        }
      );

      anno.addPlugin(
        'Flag',
        {
          base_url :
            window.location.protocol + "//" +
            window.location.host + "/" +
              RunCoCo.locale + "/annotations"
        }
      );

      this.annotorious_setup = true;
    },

    setupPrettyPhoto : function() {
      var self = this;

      // called when the lightbox closes
      self.ppOptions.callback = function() {
        self.removeMediaElementPlayers();

        // re-init of the lightbox insures that any additional content that
        // was loaded while the lightbox was displayed is lightbox enabled
        // when the lightbox is closed
        self.init();
      };

      self.ppOptions.changepagenext = self.handlePageChangeNext;
      self.ppOptions.changepageprev = self.handlePageChangePrev;
      self.ppOptions.changepicturecallback = self.handlePictureChange;
      self.ppOptions.collection_total = self.options.carousel.pagination_total;
      self.ppOptions.description_src = 'data-description';
      self.ppOptions.image_markup = '<img id="fullResImage" src="{path}" class="annotatable">';
      self.ppOptions.overlay_gallery = false;
      self.ppOptions.show_title = false;
      self.ppOptions.social_tools = false;

      self.options.$elm.find("a[rel^='prettyPhoto']").prettyPhoto( self.ppOptions );
    }

  };

}( jQuery ));