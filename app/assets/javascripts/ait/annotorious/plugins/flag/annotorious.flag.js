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
		annotator.popup.addField( Flag.addFlagIcon );
	};

	annotorious.plugin.Flag.prototype.addFlagIcon = function( annotation ) {
		var $flag_icon =
			$('<a>')
			.attr( 'title','Flag' )
			.attr( 'href','#' )
			.text( 'FLAG' )
			.on( 'click', { annotation: annotation }, Flag.handleFlagClick );

		if ( !annotation.flaggable ) {
			$flag_icon
				.attr( 'class','annotorious-popup-button annotorious-popup-flag-red' );
		} else {
			$flag_icon
				.attr( 'class','annotorious-popup-button annotorious-popup-flag-gray' );
		}

		return $flag_icon[0];
	};

	annotorious.plugin.Flag.prototype.handleFlagClick = function( evt ) {
		var $elm = $(this),
		annotation = evt.data.annotation;

		evt.preventDefault();
		$elm.off('click');

		if ( annotation.flaggable ) {
			if ( !annotation.flagged ) {
				Flag.flagAnnotation( annotation, $elm );
			}
		}
	};

  annotorious.plugin.Flag.prototype._preserveCSRFToken = function(xhr) {
    xhr.setRequestHeader(
      "X-CSRF-Token",
      $('meta[name="csrf-token"]').attr('content')
    );
  };

  annotorious.plugin.Flag.prototype.flagAnnotation = function( annotation, $elm ) {

    $.ajax({
      type: "POST",
      url: Flag._BASE_URL + "/" + annotation.id + "/flag",
      beforeSend: Flag._preserveCSRFToken,
			data: { '_method': 'put' },
			success: function() { annotation.flaggable = false; Flag.toggleFlagIcon( $elm ); }
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
