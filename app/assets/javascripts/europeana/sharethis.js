/*global europeana, jQuery */
/*jslint browser: true, white: true */
(function( $ ) {

	'use strict';

	if ( !window.europeana ) {
		window.europeana = {};
	}

	europeana.sharethis = {

		Shareable: {},
		$sharethis_elm: {},

		/**
		 * @see http://support.sharethis.com/customer/portal/articles/475260-examples
		 * @see http://support.sharethis.com/customer/portal/articles/475079-share-properties-and-sharing-custom-information#Dynamic_Specification_through_JavaScript
		 *
		 * @param {object} $metadata
		 * jQuery object
		 *
		 * @param {object} $additional_info_link
		 * jQuery object
		 *
		 * @param {int} current
		 * the current item index
		 */
		addShareThis: function( $metadata, $additional_info_link, current ) {
			var
			$target = $('<span>')
				.attr('class', 'st_sharethis_custom'),
			prettyfragement = '#prettyPhoto[gallery]/' + current + '/',
			options = {
				"element": $target[0],
				"image": $metadata.attr('data-image') ? $metadata.attr('data-image') : '',
				"title": $metadata.attr('data-title') ? $metadata.attr('data-title') : '',
				"type": "none",
				"service":"sharethis",
				"summary": $metadata.attr('data-summary') ? $metadata.attr('data-summary') : '',
				"url": $metadata.attr('data-url') ? $metadata.attr('data-url') + prettyfragement : ''
			};

			this.Shareable = stWidget.addEntry( options );
			this.$sharethis_elm = $target;
			$additional_info_link.before( this.$sharethis_elm );
		},

		/**
		 * @param {object} $metadata
		 * jQuery object
		 *
		 * @param {object} $additional_info_link
		 * jQuery object
		 *
		 * @param {int} current
		 * the current item index
		 */
		manageShareThis: function( $metadata, $additional_info_link, current ) {
			if ( $.isEmptyObject( this.Shareable ) ) {
				this.addShareThis( $metadata, $additional_info_link, current );
			} else {
				this.updateShareThis( $metadata, $additional_info_link, current );
			}
		},

		/**
		 * @param {object} $metadata
		 * jQuery object
		 *
		 * @param {object} $additional_info_link
		 * jQuery object
		 *
		 * @param {int} current
		 * the current item index
		 */
		updateShareThis: function( $metadata, $additional_info_link, current ) {
			var prettyfragement = '#prettyPhoto[gallery]/' + current + '/';
			this.Shareable.url = $metadata.attr('data-url') ? $metadata.attr('data-url') + prettyfragement : '';
			this.Shareable.title = $metadata.attr('data-title') ? $metadata.attr('data-title') : '';
			this.Shareable.image = $metadata.attr('data-image') ? $metadata.attr('data-image') : '';
			this.Shareable.summary = $metadata.attr('data-summary') ? $metadata.attr('data-summary') : '';
			$additional_info_link.before( this.$sharethis_elm );
		}

	};

}( jQuery ));