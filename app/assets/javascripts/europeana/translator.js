/*global com, console, I18n, jQuery, js, microsoft, RunCoCo */
/*jslint browser: true, todo: true, white: true */
/**
 * @class europeana
 */
window.europeana = (function( europeana, $ ) {

	'use strict';

	if ( window.js === undefined || !js.console || !js.console.log ) {
		js.console.log( 'europeana.translator: js.console.log is not defined' );
		return undefined;
	}

	if ( window.js === undefined || !js.utils || !js.utils.flashHighlight ) {
		js.console.log( 'europeana.translator: js.utils.flashHighlight is not defined' );
		return undefined;
	}

	if ( window.microsoft === undefined || !microsoft.translator ) {
		js.console.log( 'europeana.translator: microsoft.translator is not defined' );
		return undefined;
	}

	if ( window.RunCoCo === undefined ) {
		js.console.log( 'europeana.translator RunCoCo is not defined' );
		return undefined;
	}

	if ( window.RunCoCo === undefined || !RunCoCo.locale ) {
		js.console.log( 'europeana.translator RunCoCo.locale is not defined' );
		return undefined;
	}

	if ( window.I18n === undefined || !I18n.t ) {
		js.console.log( 'europeana.translator I18n.t is not defined' );
		return undefined;
	}

	if ( window.com === undefined || !com.google || !com.google.analytics || !com.google.analytics.trackEvent ) {
		js.console.log( 'europeana.translator com.google.analytics.trackEvent is not defined' );
		return undefined;
	}

	/**
	 * manages the translator service using the azure marketplace
	 * microsoft translator
	 *
	 * @class translator
	 */
	europeana.translator = (function( translator ) {

		var
		/**
		 * a jQuery object that allows a user to return to the original language text.
		 *
		 * @name translator#$return_to_original_text
		 * @type {object}
		 */
		$return_to_original_text,

		/**
		 * jQuery object that represent the DOM element that contains the language
		 * services html
		 *
		 * @name translator#$services
		 * @type {object}
		 */
		$services,

		/**
		 * jQuery object that represent the DOM element that contains the
		 * translation services not available message
		 *
		 * @name translator#$services_not_available
		 * @type {object}
		 */
		$services_not_available,

		/**
		 * jQuery object that represent the DOM element that contains the
		 * translation services parser error message
		 *
		 * @name translator#$services_parser_error
		 * @type {object}
		 */
		$services_parser_error,

		/**
		 * jQuery object that represent the DOM element that is the language
		 * dropdown selector
		 *
		 * @name translator#$services_select
		 * @type {object}
		 */
		$services_select,

		/**
		 * jQuery object that represents the DOM element that is the
		 * loading spinner
		 *
		 * @name #translator#$translations_loading_icon
		 * @type {jQuery}
		 */
		$translations_loading_icon,

		/**
		 * indicates how many translate callbacks the application is waiting on
		 *
		 * @name #translator#callbacks_waiting
		 * @type {int}
		 */
		callbacks_waiting = 0,

		/**
		 * whether or not a request for a new access token was made
		 *
		 * @name translator#getting_new_access_token
		 * @type {bool}
		 */
		getting_new_access_token = false,

		/**
		 * Language ISO codes matched with their corresponding localised language
		 * names based on the locale passed to
		 * microsoft.translator.getLanguageCodesAndNames()
		 *
		 * @name translator#language_codes_and_names
		 * @type {object}
		 */
		language_codes_and_names = {},

		/**
		 * ISO language codes
		 *
		 * @name translator#languages_for_translate
		 * @type {array}
		 */
		languages_for_translate = [],

		/**
		 * whether or not the tranlsate request had a parser error
		 *
		 * @name translator#parser_error
		 * @type {bool}
		 */
		parser_error = false,

		/**
		 * a cache container for previous translations request during this page visit
		 *
		 * @name translator#translation_cache
		 * @type {array}
		 */
		translation_cache = [],

		/**
		 * a collection of text nodes to be translated as jQuery objects
		 *
		 * @name translator#translation_nodes
		 * @type {array}
		 */
		translation_nodes = [],

		/**
		 * a collection of the original text nodes to be translated as jQuery objects
		 *
		 * @name translator#translation_nodes
		 * @type {array}
		 */
		translation_nodes_original = [],

		/**
		 * an html template representing the translation services container
		 *
		 * @name translator#translation_services_html
		 * @type {string}
		 */
		translation_services_html =
			'<div id="translation-services">' +
				'<div id="microsoft-translate-element">' +
					'<select>' +
						'<option value="">' + I18n.t( 'javascripts.translate.translate-to' ) + '</option>' +
					'</select>' +
					'<a ' +
						'id="return-to-original-text" ' +
						'href="" ' +
						'title="' + I18n.t( 'javascripts.translate.return-to-language' ) +
					'">' +
						I18n.t( 'javascripts.translate.return-to-language' ) +
					'</a>' +
					'<span>Powered by <span class="bold">Microsoft®</span> Translator</span><br />' +
					'<span id="translation-services-parser-error" class="error">Some of the text could not be translated.</span>' +
				'</div>' +
			'</div>' +
			'<div ' +
				'id="translations-loading-icon" ' +
				'class="loading-spinner" ' +
				'title="' + I18n.t( 'javascripts.loading' ) + '">' +
			'</div>' +
			'<div id="translation-services-not-available">' +
				I18n.t( 'javascripts.translate.service-not-available' ) +
			'</div>';

		/**
		 * @param {object} jqXHR
		 * a superset of the browser's native XMLHttpRequest object
		 *
		 * @see http://api.jquery.com/jquery.ajax/#jqXHR
		 */
		function addCsrfToken( jqXHR ) {
			jqXHR.setRequestHeader( "X-CSRF-Token", $( 'meta[name="csrf-token"]' ).attr( 'content' ) );
		}

		/**
		 * @param {string} services_selector
		 */
		function displayServiceNotAvailable( services_selector ) {
			// this happens if token is not available at init
			if ( !$services && services_selector ) {
				$( services_selector ).append( I18n.t( 'javascripts.translate.service-not-available' ) );
			} else if ( $services ) {
				$services.fadeOut(function() {
					$services_not_available.fadeIn();
				});
			}
		}

		/**
		 * @param {string} data
		 * @param {function} callback
		 */
		function handleRetrieveNewTokenDone( data, textStatus, callback ) {
			callback.call( translator, textStatus, data );
		}

		/**
		 * @param {string} textStatus
		 * @param {function} callback
		 */
		function handleRetrieveNewTokenFail( textStatus, callback ) {
			callback.call( translator, textStatus );
		}

		/**
		 * @param {function} callback
		 */
		function retrieveNewToken( callback ) {
			if ( getting_new_access_token ) {
				return;
			}

			js.console.log( 'europeana.translator.retrieveNewToken' );
			getting_new_access_token = true;

			$.ajax({
				beforeSend: addCsrfToken,
				dataType: 'json',
				type: 'POST',
				url: '/translate/access_tokens.json'
			})

			.done(function( data, textStatus ) {
				handleRetrieveNewTokenDone( data, textStatus, callback );
			})

			.fail(function( jqXHR, textStatus ) {
				js.console.log( jqXHR );
				handleRetrieveNewTokenFail( textStatus, callback );
			});
		}

		/**
		 * @param {bool} retrieve_new_token
		 * optional
		 *
		 * @param {function} callback
		 * optional
		 *
		 * @returns {object}
		 */
		function getAccessToken( retrieve_new_token, callback ) {
			var
			result = {};

			if ( retrieve_new_token ) {
				retrieveNewToken( callback );
			}

			if (
				RunCoCo.bing_access_token !== undefined &&
				RunCoCo.bing_access_token.access_token !== undefined
			) {
				result = RunCoCo.bing_access_token.access_token;
			}

			return result;
		}

		/**
		 * @param {string} translate_elm_selector
		 * css selector that indicates the DOM elements that should be translated
		 */
		function captureOriginalNodes( translate_elm_selector ) {
			$( translate_elm_selector ).each( function() {
				translation_nodes.push( $( this ) );

				// don’t store as jQuery objects as they will change with the translation
				// update. store the html as sometimes the content is surrounded in html
				translation_nodes_original.push( $( this ).html() );
			});
		}

		/**
		 * handle a request for a new access token
		 *
		 * if a new token was received re-initiate the translation request. if a
		 * new access token wasn’t received, display a message that translation
		 * services are not available.
		 *
		 * @param {string} textStatus
		 * @param {string} data
		 */
		//function retrieveAccessTokenCallback( textStatus, data ) {
		//	var okay = true;
		//
		//	getting_new_access_token = false;
		//
		//	if ( !$services_select && $services_select.length !== 1 ) {
		//		js.console.log( 'europeana.translator.retrieveAccessTokenCallback $services_select is not defined' );
		//		okay = false;
		//	}
		//
		//	if ( textStatus !== 'success' ) {
		//		js.console.log( 'europeana.translator.retrieveAccessTokenCallback textStatus !== success' );
		//		okay = false;
		//	}
		//
		//	if ( !okay ) {
		//		displayServiceNotAvailable();
		//		return;
		//	}
		//
		//	RunCoCo.bing_access_token = data;
		//	$services_select.trigger( 'change' );
		//}

		function displayTranslationServices() {
			if ( callbacks_waiting > 0 ) {
				return;
			}

			if ( parser_error && !getting_new_access_token ) {
				$services.fadeTo( 'fast', 1.0, function() {
					$translations_loading_icon.fadeOut( function() {
						displayServiceNotAvailable();
					});
				});

				return;
			}

			// hide the loading spinner
			// display the language drop down
			// display the return to original language link
			// keep this order - otherwise loading icon doesn’t always fade out
			// especially when using the translation_cache
			$services.fadeTo( 'fast', 1.0, function() {
				$translations_loading_icon.fadeOut(function() {
					$return_to_original_text.slideDown( 'slow' );
				});
			});
		}

		function displayTranslationsLoading() {
			$services.fadeTo( 'fast', 0.2, function() {
				$translations_loading_icon.fadeIn();
			});
		}

		/**
		 * stores translations received from microsoft.translator.translate in
		 * a local cache. the cache is only good for this session.
		 *
		 * @todo create a persistent cache
		 *
		 * @param {object} translation
		 * @example
		   {
					$elm: $elm,
					index: index,
					locale_requested: locale_requested,
					response: response
		   }
		 */
		function addTranslationToCache( translation ) {
			if ( !$.isArray( translation_cache[ translation.locale_requested ] ) ) {
				translation_cache[ translation.locale_requested ] = [];
			}

			if ( !$.isPlainObject( translation_cache[ translation.locale_requested ][ translation.index ] ) ) {
				translation_cache[ translation.locale_requested ][ translation.index ] = translation;
			}
		}

		/**
		 * @param {object} $elm
		 * the DOM element to receive the content
		 *
		 * @param {string} content
		 * text or html
		 */
		function addContentWithFlashHighlight( $elm, content ) {
			$elm.html( content );
			js.utils.flashHighlight( $elm, '#ffff00', '#ffffff', 1500 );
		}

		function handleReturnToOriginal( evt ) {
			evt.preventDefault();

			$.each( translation_nodes, function( index ) {
				// restore as html in case the original content contained html
				addContentWithFlashHighlight( $( this ), translation_nodes_original[ index ] );
			});

			$services_select.val( '' );
			$return_to_original_text.slideToggle();
		}

		/**
		 * callback for the microsoft.translator.translate method
		 *
		 * @param {object} status
		 * @param {object} translation
		 * @example
		   {
					$elm: $elm,
					index: index,
					locale_requested: locale_requested,
					response: response
		   }
		 */
		function translateCallback( status, translation ) {
			if ( $.isEmptyObject( translation.$elm ) ) {
				js.console.log(
					'europena.translator.handleTranslateRequest: ' +
					'$elm is not an object'
				);
			} else if ( status.status === 'success' ) {
				addContentWithFlashHighlight( translation.$elm, translation.response );
				addTranslationToCache( translation );
				parser_error = false;
			} else {
				js.console.log(
					'europena.translator.handleTranslateRequest: ' +
					'callback status - ' + status.status
				);

				// assume a new token is needed
				// assuming that a new token is needed creates an endsless loop
				// for languages not handled such as serbian
				// need to sort out a better way to deal with parse errors
				if ( status.status === 'parsererror' ) {
					if ( !parser_error ) {
						//getAccessToken( true, retrieveAccessTokenCallback );
						$services_parser_error.fadeIn();
						parser_error = true;
					}
				}
			}

			callbacks_waiting -= 1;
			displayTranslationServices();
		}

		function handleTranslateRequest() {
			var
			locale_requested = $(this).val();

			// no translation requested
			if ( locale_requested.length < 1 ) {
				js.console.log(
					'europena.translator.handleTranslateRequest: locale requested ' +
					'[' + locale_requested + '] is empty'
				);

				return;
			}

			// validate locale requested
			if ( $.inArray( locale_requested, languages_for_translate ) === -1 ) {
				js.console.log(
					'europeana.translator.handleTranslateRequest: locale requested ' +
					'[' + locale_requested + '] is not valid'
				);

				return;
			}

			// trigger google analytics event
			com.google.analytics.trackEvent(
				'Object description translations',
				locale_requested,
				window.location.href.replace( 'www.', '' )
			);

			// hide the language drop down, display loading spinner
			displayTranslationsLoading();

			// cycle through text nodes and send them off for translation
			$.each( translation_nodes, function( index ) {

				// use cache if translation already exists
				if (
					translation_cache[ locale_requested ] &&
					translation_cache[ locale_requested ][ index ] &&
					$.isPlainObject( translation_cache[ locale_requested ][ index ] )
				) {
					callbacks_waiting += 1;

					translateCallback.call(
						translator,
						{ status: 'success' },
						translation_cache[ locale_requested ][ index ]
					);

					return true;
				}

				// need these to be defined per scope
				var
				$elm = $( this ),
				options = {
					appId: getAccessToken(),
					to: locale_requested
				};

				// use the node’s original content, which may contain html
				// this insures that translations are not made on results of
				// previous translations
				options.text = translation_nodes_original[ index ];

				options.callback = function( status, response ) {
					var translation = {
						$elm: $elm,
						index: index,
						locale_requested: locale_requested,
						response: response
					};

					translateCallback.call( translator, status, translation );
				};

				microsoft.translator.translate( options );
				callbacks_waiting += 1;

				return true;
			});
		}

		function addReturnToOriginalClickHandler() {
			$return_to_original_text.on( 'click', handleReturnToOriginal );
		}

		function addLanguageSelectorChangeHandler() {
			$services_select.on( 'change', handleTranslateRequest );
		}

		function addLanguagesToLanguageSelector() {
			var
			html = '';

			if ( !$.isEmptyObject( language_codes_and_names ) ) {
				$.each( language_codes_and_names, function( index, value ) {
					languages_for_translate.push( index );
					html += '<option value="' + index + '">' + value + '</option>';
				});
			}

			$services_select.append( html );
		}

		/**
		 * fallback to locale ‘en’ if locale provided is not available
		 *
		 * @param {string} locale
		 */
		function setLanguageCodesAndNames( locale ) {
			language_codes_and_names = microsoft.translator.getLanguageCodesAndNames( locale );

			if ( $.isEmptyObject( language_codes_and_names ) ) {
				language_codes_and_names = microsoft.translator.getLanguageCodesAndNames( 'en' );

				js.console.log(
					'europeana.translator setLanguageCodesAndNames: locale [' + locale + '] has no cached language codes and names; fell back to [en]'
				);
			}
		}

		/**
		 * choose not to make any api calls and rely on the cached
		 * array in microsoft.translator
		 */
		function createTranslateDropDown() {
			setLanguageCodesAndNames( RunCoCo.locale );
			addLanguagesToLanguageSelector();
		}

		/**
		 * add translation services to the page
		 * setup variables that refer to that DOM element and the language dropdown
		 *
		 * @param {string} services_selector
		 */
		function addTranslationServices( services_selector ) {
			$( services_selector ).append( $( translation_services_html ) );
			$services =	$( '#translation-services' );
			$services_select = $services.find( 'select' );
			$return_to_original_text = $services.find( '#return-to-original-text' ).hide();
			$translations_loading_icon = $( '#translations-loading-icon' ).hide();
			$services_not_available = $( '#translation-services-not-available' ).hide();
			$services_parser_error = $( '#translation-services-parser-error' ).hide();
		}

		/**
		 * @param {string} services_selector
		 * css selector that indicates which DOM element receives
		 * the translation services html, which includes the language
		 * selector dropdown
		 *
		 * @param {string} translate_elm_selector
		 * css selector that indicates which DOM elements should be translated
		 */
		translator.init = function( services_selector, translate_elm_selector ) {
			// make sure an access token exists on page load
			if ( $.isEmptyObject( getAccessToken() ) ) {
				displayServiceNotAvailable( services_selector );

				js.console.log(
					'europeana.translator.getAccessToken: no microsoft translator ' +
					'access token was available'
				);

				return;
			}

			addTranslationServices( services_selector );
			createTranslateDropDown();
			addLanguageSelectorChangeHandler();
			addReturnToOriginalClickHandler();
			captureOriginalNodes( translate_elm_selector );
		};

		return translator;

	}( europeana.translator || {} ));

	return europeana;

}( window.europeana || {}, jQuery ));
