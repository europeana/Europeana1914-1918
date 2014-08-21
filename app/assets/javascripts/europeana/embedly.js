/*global embedly, europeana, jQuery */
/*jslint browser: true, white: true */
(function( $ ) {

	'use strict';

	if ( !window.europeana ) {
		window.europeana = {};
	}


	europeana.embedly = {

		originalOg: null,


		addEmbedButtonListener: function() {
			$('.embedly-button').on( 'click', this.openEmbedlyModal );
		},

		/**
		 * control method used to:
		 * - store the original og meta tag properties
		 * - set the og meta tag properties to this item’s metadata
		 *
		 * @param {object} options
		 */
		alterOg: function( options ) {
			this.storeOg();
			this.setOg( options );
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
			$embedly_elm =
				$('<span>')
				.attr('class', 'lightbox-embedly')
				.on('click', this.openEmbedlyModal),
			prettyfragement = '#prettyPhoto[gallery]/' + current + '/',
			options = {
				"image": $metadata.attr('data-image') || '',
				"title": $metadata.attr('data-title') || '',
				"url": $metadata.attr('data-url') ? $metadata.attr('data-url') + prettyfragement : ''
			};

			this.alterOg( options );
			$target_elm.prepend( $embedly_elm );
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

		openEmbedlyModal: function() {
			embedly.modal();
			return false;
		},

		/**
		 * reset the og meta tag properties to the original item’s metadata
		 */
		resetOg: function() {
			if ( this.originalOg !== null ) {
				this.setOg( this.originalOg );
			}
		},

		/**
		 * set the og meta tag properties to this item’s metadata
		 *
		 * @param {object} options
		 */
		setOg: function( options ) {
			$("meta[property='og:image']").attr('content', options.image);
			$("meta[property='og:title']").attr('content', options.title);
			$("meta[property='og:url']").attr('content', options.url);
		},

		/**
		 * store the original og meta tag properties
		 */
		storeOg: function() {
			if ( this.originalOg === null ) {
				this.originalOg = {
					image: $("meta[property='og:image']").attr('content'),
					title: $("meta[property='og:title']").attr('content'),
					url: $("meta[property='og:url']").attr('content')
				};
			}
		}

	};

}( jQuery ));