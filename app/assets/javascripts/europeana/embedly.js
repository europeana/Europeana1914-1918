/*global embedly, europeana, jQuery */
/*jslint browser: true, white: true */
(function( $ ) {

	'use strict';

	if ( !window.europeana ) {
		window.europeana = {};
	}


	europeana.embedly = {

		addEmbedButtonListener: function() {
			$('.embedly-button').on('click', this.openEmbedlyModal);
		},

		init: function() {
			this.addEmbedButtonListener();
		},

		/**
		 * adds an embed.ly button to the lightbox $target_elm, which is
		 * most likely the lightbox description area
		 *
		 * @param {object} $metadata
		 * jQuery object
		 *
		 * @param {object} $target_elm
		 * jQuery object
		 *
		 * @param {int} current
		 * the current item index
		 */
		addEmbedlyButton: function( $metadata, $target_elm, current ) {
			var
			prettyfragement = '#prettyPhoto[gallery]/' + current + '/',
			options = {
				"description": $metadata.attr('data-summary') || '',
				"image": $metadata.attr('data-image') || '',
				"title": $metadata.attr('data-title') || '',
				"url": $metadata.attr('data-url') ? $metadata.attr('data-url') + prettyfragement : ''
			};

			$target_elm
				.find('.lightbox-embedly').eq(0)
				.on('click', { options: options }, this.openEmbedlyModal);
		},

		/**
		 * control method used to properly add a lightbox embed.ly button
		 *
		 * @param {object} $metadata
		 * jQuery object
		 *
		 * @param {object} $target_elm
		 * jQuery object
		 *
		 * @param {int} current
		 * the current item index
		 */
		manageEmbedly: function( $metadata, $target_elm, current ) {
			this.addEmbedlyButton( $metadata, $target_elm, current );
		},

		/**
		 * @param {object} evt
		 * jQuery Event Object
		 */
		openEmbedlyModal: function( evt ) {
			if ( evt && evt.data && evt.data.options ) {
				embedly.modal( evt.data.options );
			} else {
				embedly.modal();
			}

			com.google.analytics.trackEvent(
				'Embed.ly',
				'openEmbedlyModal',
				window.location.href.replace('www.','')
			);

			return false;
		}

	};

}( jQuery ));