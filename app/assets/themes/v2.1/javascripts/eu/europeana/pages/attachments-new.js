/*global I18n */
/*jslint browser: true, white: true */
(function( ) {

  'use strict';

  jQuery("fieldset.collapsible").collapse();
  jQuery("fieldset.collapsed").collapse( { closed: true } );

  RunCoCo.languageOther.init();
  RunCoCo.fieldsetButtons.init();
  RunCoCo.uploadify.init();

  var pendingUploads = jQuery("table.attachments td.pending");
  if (pendingUploads.length > 0) {
    jQuery("form[id^='edit_contribution'] > fieldset > ol > *").hide();
    jQuery("form[id^='edit_contribution'] > fieldset > ol").append(jQuery('<li id="contribution_uploads_pending"><p>' + I18n.t('javascripts.attachments.uploading') + '</p></li>'));
  }
  
  pendingUploads.each(function() {
    var thumnailTableCell = this;
    var spinner = jQuery('<img src="/assets/europeana-theme/progress_bar/loading_animation.gif" height="32" width="32" alt="" />');
    jQuery(this).text('').append(spinner);
    var contributionId = jQuery(this).data('contribution-id');
    var attachmentId = jQuery(this).data('attachment-id');
    var url = RunCoCo.relativeUrlRoot + '/contributions/' + contributionId + '/attachments/' + attachmentId + '/uploaded.json';

    function runCheck() {
      jQuery.ajax({
        type: "GET",
        url: url,
        beforeSend: function(xhr) {
          xhr.setRequestHeader("X-CSRF-Token", jQuery('meta[name="csrf-token"]').attr('content'));
        },
        success: function(response) {
          if (response.uploaded === true) {
            var thumbnailLink = jQuery(response.thumbnailLink).hide();
            jQuery(thumnailTableCell).append(thumbnailLink);
            var downloadLink = jQuery(response.downloadLink).hide();
            jQuery(thumnailTableCell).siblings(':eq(4)').append(downloadLink);

            jQuery(spinner).fadeOut(400, function() {
              thumbnailLink.slideDown(400, function() {
                downloadLink.fadeIn();
              });
            }).remove();
            
            jQuery(thumnailTableCell).removeClass('pending');
            if (jQuery("table.attachments td.pending").length === 0) {
              jQuery('#contribution_uploads_pending').fadeOut().remove();
              jQuery("form[id^='edit_contribution'] > fieldset > ol > *").fadeIn();
              jQuery("form[id^='edit_contribution'] input[type='submit']").removeAttr('disabled');
              jQuery(".portlet-msg-success").fadeOut().remove();
            }
          } else {
            window.setTimeout(runCheck, 5000);
          }
        }
      });
    }

    runCheck();
  });

}());

(function() {

	'use strict';

	var $fieldsets = jQuery('form > fieldset'),
        $attachment_help_links = jQuery('#attachment-help a'),
		$single_file = jQuery('#attachment_file_input'),
		$multiple_file = jQuery('#uploadify_upload');


	function hideSingleFile() {

		if ( $single_file.is(':visible') ) {

			$single_file.toggle('height');

		}

		if ( $multiple_file.is(':hidden') ) {

			$multiple_file.toggle('height');

		}

	}


	function hideMultipleFile() {

		if ( $single_file.is(':hidden') ) {

			$single_file.toggle('height');

		}

		if ( $multiple_file.is(':visible') ) {

			$multiple_file.toggle('height');

		}

	}


	/**
	 *	opens a collapsed fieldset
	 *
	 *	@param {jQuery Object} $elm
	 *	represents the fieldset that needs to be un-collapased
	 */
	function openFieldset( $elm ) {

		if ( $elm.hasClass( 'collapsed' ) ) {

			$elm.find('legend').eq(0).trigger('click');

		}

	}


	/**
	 *	closes a collapsed fieldset
	 *
	 *	@param {jQuery Object} $elm
	 *	represents the fieldset that needs to be collapased
	 */
	function closeFieldset( $elm ) {

		if ( $elm.hasClass( 'collapsible' ) ) {

			$elm.find('legend').eq(0).trigger('click');

		}

	}


	/**
	 *	@param {jQuery Object} $elm
	 *	jQuery Object representing the fieldset that should be opened
	 */
	function showFieldset( $elm ) {

		if ( $elm.is(':hidden') ) {

			$elm.toggle('height');

		}

		if ( RunCoCo.cataloguer ) {

			openFieldset( $elm );

		}

	}


	/**
	 *	@param {jQuery Object} $elm
	 *	jQuery Object representing the fieldset that should be closed
	 */
	function hideFieldset( $elm ) {

		if ( $elm.is(':visible') ) {

			$elm.toggle('height');

		}

	}


	/**
	 *	@param {String} except_id
	 *	the id of the fieldset that should stay open
	 *
	 *	@param {Enum hide|show} other_fieldsets
	 *	whether to hide or show the other fieldsets
	 */
	function toggleFieldsets( except_id, other_fieldsets ) {

		var $elm;

		$fieldsets.each(function() {

			$elm = jQuery(this);

			if ( except_id === $elm.attr('id') ) {

				if ( 'submit' === $elm.attr('id') ) {

					openFieldset( $elm );

				}

				if ( 'attachment_upload' === $elm.attr('id') ) {

					openFieldset( $elm );

				}

				showFieldset( $elm );

			} else {

				switch ( other_fieldsets ) {

					case 'hide' :

						closeFieldset( $elm );
						hideFieldset( $elm );
						break;

					case 'show' :

						if (
							'attachment_upload' === $elm.attr('id') &&
							( 'single-item' === except_id || 'multiple-item' === except_id )
						) {

							openFieldset( $elm );

						} else {

							closeFieldset( $elm );

						}

						if (
							'submit' === $elm.attr('id') &&
							( 'single-item' === except_id || 'attachment_upload' === except_id )
						) {

							hideFieldset( $elm );

						} else {

							showFieldset( $elm );

						}

						break;

				}

			}

		});

		if ( 'single-item' == except_id ) {

			hideMultipleFile();

		} else if ( 'attachment_upload' == except_id ) {

			hideSingleFile();

		}

	}


	function highlightOption( id ) {

      $attachment_help_links.each( function() {

        var $elm = jQuery(this);

        if ( id === $elm.attr('id') ) {

          $elm.addClass('highlighted-option');

        } else {

          $elm.removeClass('highlighted-option');

        }

      });

    }


	function singleItemHandler( evt ) {

		evt.preventDefault();
		highlightOption('single-item');
		toggleFieldsets( 'single-item', 'show' );
		window.scrollTo( 0, 0 );

	}


	function multipleItemHandler( evt ) {

		evt.preventDefault();
		highlightOption('multiple-items');
		toggleFieldsets( 'attachment_upload', 'show' );
		window.scrollTo( 0, 0 );

	}

	function submitStoryHandler( evt ) {

		evt.preventDefault();
		highlightOption('submit-story');
		toggleFieldsets( 'submit', 'hide' );
		window.scrollTo( 0, 0 );

	}


	function init() {

		jQuery('#single-item').on( 'click', singleItemHandler );
		jQuery('#multiple-items').on( 'click', multipleItemHandler );
		jQuery('#submit-story').on( 'click', submitStoryHandler );

		jQuery('#add-another-attachment').on( 'click', singleItemHandler );
		jQuery('#submit-your-story').on( 'click', submitStoryHandler );

		if ( RunCoCo.cataloguer ) {

			if ( RunCoCo.ready_for_submit ) {

				jQuery('#submit-your-story').trigger('click');

			} else {

				jQuery('#multiple-items').trigger('click');

			}

		}

	}


	init();


}( ));
