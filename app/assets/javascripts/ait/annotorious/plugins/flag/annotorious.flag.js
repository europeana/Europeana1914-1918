/*global annotorious, I18n, jQuery */
/*jslint browser: true, nomen: true, regexp: true, white: true */
/**
 * flag plugin for annotorious developed for europeana 1914-1918
 */
(function ( annotorious, I18n, $ ) {
	'use strict';

	var Flag = {};

	/**
	 * @param {object} config
	 */
	annotorious.plugin.Flag = function( config ) {
		this._BASE_URL = config.base_url;
		Flag = this;
	};

	/**
	 * @param {object} annotator
	 */
	annotorious.plugin.Flag.prototype.onInitAnnotator = function( annotator ) {
		Flag.preloadImages();
		annotator.popup.addField( Flag.addFlagIcon );
	};

	annotorious.plugin.Flag.prototype.preloadImages = function() {
		var image = [];

		image[0] = new Image();
		image[1] = new Image();
		image[0].src = '/assets/ait/annotorious/plugins/flag/flag-gray.png';
		image[1].src = '/assets/ait/annotorious/plugins/flag/flag-red.png';
	};

	/**
	 * @param {object} annotation
	 * @returns {object} jQuery object representing the flag icon
	 */
	annotorious.plugin.Flag.prototype.addFlagIcon = function( annotation ) {
		if ( !annotation.flaggable ) {
			return;
		}

		var $flag_icon =
			$('<a>')
			.attr( 'href','#' )
			.on( 'click', { annotation: annotation }, Flag.handleFlagClick );

		if ( annotation.flagged ) {
			$flag_icon
				.attr( 'class','annotorious-popup-button annotorious-popup-flag-red' )
				.attr( 'title', I18n.t('javascripts.annotorious.clear-flag') )
				.text( I18n.t('javascripts.annotorious.clear-flag') );
		} else {
			$flag_icon
				.attr( 'class','annotorious-popup-button annotorious-popup-flag-gray' )
				.attr( 'title', I18n.t('javascripts.annotorious.flag') )
				.text( I18n.t('javascripts.annotorious.flag') );
		}

		return $flag_icon[0];
	};

	/**
	 * @param {evt} jQuery Event object
	 */
	annotorious.plugin.Flag.prototype.handleFlagClick = function( evt ) {
		var $elm = $(this),
		annotation = evt.data.annotation;

		evt.preventDefault();
		$elm.off('click');

		if ( !annotation.flagged ) {
			Flag.flagAnnotation( annotation, $elm );
		} else {
			Flag.unflagAnnotation( annotation, $elm );
		}
	};

	/**
	 * @param {object} annotation
	 * @param {object} $elm jQuery object representing the flag icon
	 */
	annotorious.plugin.Flag.prototype.toggleFlagIcon = function( annotation, $elm ) {
		if ( $elm.hasClass( 'annotorious-popup-flag-gray' ) ) {
			$elm
				.removeClass( 'annotorious-popup-flag-gray' )
				.addClass( 'annotorious-popup-flag-red' )
				.text( I18n.t('javascripts.annotorious.clear-flag') )
				.on( 'click', { annotation: annotation }, Flag.handleFlagClick );
		} else {
			$elm
				.removeClass( 'annotorious-popup-flag-red' )
				.addClass( 'annotorious-popup-flag-gray' )
				.text( I18n.t('javascripts.annotorious.flag') )
				.on( 'click', { annotation: annotation }, Flag.handleFlagClick );
		}
	};

	/**
	 * @param {object} jqXHR jQuery XHR object
	 */
  annotorious.plugin.Flag.prototype._preserveCSRFToken = function( jqXHR ) {
    jqXHR.setRequestHeader(
      "X-CSRF-Token",
      $('meta[name="csrf-token"]').attr('content')
    );
  };

	/**
	 * @param {object} annotation
	 * @param {object} $elm jQuery object representing the flag icon
	 */
  annotorious.plugin.Flag.prototype.flagAnnotation = function( annotation, $elm ) {
    $.ajax({
      type: "POST",
      url: Flag._BASE_URL + "/" + annotation.id + "/flag",
      beforeSend: Flag._preserveCSRFToken,
			data: { '_method': 'put' },
			success: function() { annotation.flagged = true; Flag.toggleFlagIcon( annotation, $elm ); }
    });
  };

	/**
	 * @param {object} annotation
	 * @param {object} $elm jQuery object representing the flag icon
	 */
	annotorious.plugin.Flag.prototype.unflagAnnotation = function( annotation, $elm ) {
    $.ajax({
      type: "POST",
      url: Flag._BASE_URL + "/" + annotation.id + "/unflag",
      beforeSend: Flag._preserveCSRFToken,
			data: { '_method': 'put' },
			success: function() { annotation.flagged = true; Flag.toggleFlagIcon( annotation, $elm ); }
    });
  };

}( annotorious, I18n, jQuery ));
