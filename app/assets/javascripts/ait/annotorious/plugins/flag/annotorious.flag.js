/*global annotorious, jQuery */
/*jslint browser: true, nomen: true, regexp: true, white: true */
(function ( annotorious, $ ) {
	'use strict';

	var Flag = {};

	annotorious.plugin.Flag = function( config ) {
		this._BASE_URL = config.base_url;
		Flag = this;
	};

	annotorious.plugin.Flag.prototype.onInitAnnotator = function( annotator ) {
		annotator.popup.addField( Flag.addField );
	};

	annotorious.plugin.Flag.prototype.addField = function( annotation ) {
		var $field = '';

		if ( annotation.flaggable ) {
			$field = $('<a>')
				.attr( 'class','annotorious-popup-button annotorious-popup-flag-gray' )
				.attr( 'title','Flag' )
				.attr( 'href','#' )
				.text( 'FLAG' )
				.on( 'click', { annotation: annotation }, Flag.handleFlagClick )[0];
		}

		return $field;
	};

	annotorious.plugin.Flag.prototype.handleFlagClick = function( evt ) {
		var $elm = $(this),
		annotation = evt.data.annotation;

		evt.preventDefault();

		if ( annotation.flaggable ) {
			Flag.flagAnnotation( annotation, $elm );
		}
	};

  annotorious.plugin.Flag.prototype._preserveCSRFToken = function(xhr) {
    xhr.setRequestHeader(
      "X-CSRF-Token",
      $('meta[name="csrf-token"]').attr('content')
    );
  };

  annotorious.plugin.Flag.prototype.flagAnnotation = function( annotation, $elm ) {
    if ( !annotation.id ) {
      return;
    }

    $.ajax({
      type: "POST",
      url: Flag._BASE_URL + "/" + annotation.id + "/flag",
      beforeSend: Flag._preserveCSRFToken,
			data: { '_method': 'put' },
			success: Flag.toggleFlagIcon( $elm )
    });
  };

	annotorious.plugin.Flag.prototype.toggleFlagIcon = function( $elm ) {
		if ( $elm.hasClass( 'annotorious-popup-flag-gray' ) ) {
			$elm
				.removeClass( 'annotorious-popup-flag-gray' )
				.addClass( 'annotorious-popup-flag-red' );
		} else {
			$elm
				.removeClass( 'annotorious-popup-flag-red' )
				.addClass( 'annotorious-popup-flag-gray' );
		}
	};

}( annotorious, jQuery ));
