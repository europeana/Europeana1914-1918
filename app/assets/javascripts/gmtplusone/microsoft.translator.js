/*global console, jQuery, microsoft */
/*jslint browser: true, white: true */
/**
 * microsoft.translator
 * @see https://github.com/dan-nl/microsoft.translator
 *
 * @version 0.0.4
 * @author dan entous
 *
 * released under the MIT license
 * @see https://github.com/dan-nl/microsoft.translator/blob/master/LICENSE.md
 * © 2014 dan entous
 */
/**
 * AJAX
 *
 * To start using the AJAX interface for the Microsoft Translator service all
 * you need to do is to direct an ajax call to the appropriate
 * http://api.microsofttranslator.com/V2/Ajax.svc method and register a
 * callback function and that's it, the translator API will handle the heavy
 * lifting and pass the results of the method back to a registered callback
 * function and part of this heavy lifting is the encodeURIcomponent
 * function which is provided to escape UTF characters that may be present
 * in the strings that we pass to the translator service.
 *
 * How this all works is to dynamically register a html script element to the
 * <head> tag of the page via accessing the DOM. Within this script is
 * contained the call to the translator ajax service API, as well as a
 * callback function.
 *
 * Once the AJAX call to the Microsoft Translator API is complete, the API will
 * return to the callback handler function that we have previously nominated.
 *
 * @see http://msdn.microsoft.com/en-us/library/ff512404.aspx
 */
window.microsoft = (function( microsoft, $ ) {

	'use strict';

	microsoft.translator = (function( translator ) {

		var
		/**
		 * A string array containing the language codes supported by
		 * the Translator Services (retrieved on 2014-09-28).
		 *
		 * @type {array}
		 */
		languageCodes = ["ar", "bg", "ca", "zh-CHS", "zh-CHT", "cs", "da", "nl", "en", "et", "fi", "fr", "de", "el", "ht", "he", "hi", "mww", "hu", "id", "it", "ja", "tlh", "tlh-Qaak", "ko", "lv", "lt", "ms", "mt", "no", "fa", "pl", "pt", "ro", "ru", "sk", "sl", "es", "sv", "th", "tr", "uk", "ur", "vi", "cy"],

		/**
		 * A string array containing the language codes supported for speech
		 * synthesis by the Translator Services (retrieved on 2014-09-28).
		 *
		 * @type {array}
		 */
		languagesForSpeak = ["ca", "ca-es", "da", "da-dk", "de", "de-de", "en", "en-au", "en-ca", "en-gb", "en-in", "en-us", "es", "es-es", "es-mx", "fi", "fi-fi", "fr", "fr-ca", "fr-fr", "it", "it-it", "ja", "ja-jp", "ko", "ko-kr", "nb-no", "nl", "nl-nl", "no", "pl", "pl-pl", "pt", "pt-br", "pt-pt", "ru", "ru-ru", "sv", "sv-se", "zh-chs", "zh-cht", "zh-cn", "zh-hk", "zh-tw"],

		/**
		 * An object that contains static results of the language codes and
		 * corresponding language names for a given language code
		 * (retrieved on 2014-10-03).
		 *
		 * @type {object}
		 */
		languageCodesAndNames = {
			"da" : { "ar":"Arabisk", "bg":"Bulgarsk", "ca":"Catalansk", "zh-CHS":"Kinesisk, forenklet", "zh-CHT":"Kinesisk, traditionelt", "cs":"Tjekkisk", "da":"Dansk", "nl":"Nederlandsk", "en":"Engelsk", "et":"Estisk", "fi":"Finsk", "fr":"Fransk", "de":"Tysk", "el":"Græsk", "ht":"Haitiansk", "he":"Hebraisk", "hi":"Hindi", "mww":"Hmong Daw", "hu":"Ungarsk", "id":"Indonesisk", "it":"Italiensk", "ja":"Japansk", "tlh":"Klingon", "tlh-Qaak":"Klingon (pIqaD)", "ko":"Koreansk", "lv":"Lettisk", "lt":"Litauisk", "ms":"Malaysisk", "mt":"Maltesisk", "no":"Norsk", "fa":"Persisk", "pl":"Polsk", "pt":"Portugisisk", "ro":"Rumænsk", "ru":"Russisk", "sk":"Slovakisk", "sl":"Slovensk", "es":"Spansk", "sv":"Svensk", "th":"Thai", "tr":"Tyrkisk", "uk":"Ukrainsk", "ur":"Urdu", "vi":"Vietnamesisk", "cy":"Walisisk" },
			"de" : { "ar":"Arabisch", "bg":"Bulgarisch", "ca":"Katalanisch", "zh-CHS":"Chinesisch (Vereinfacht)", "zh-CHT":"Chinesisch (Traditionell)", "cs":"Tschechisch", "da":"Dänisch", "nl":"Niederländisch", "en":"Englisch", "et":"Estnisch", "fi":"Finnisch", "fr":"Französisch", "de":"Deutsch", "el":"Griechisch", "ht":"Haitianisch", "he":"Hebräisch", "hi":"Hindi", "mww":"Hmong Daw", "hu":"Ungarisch", "id":"Indonesisch", "it":"Italienisch", "ja":"Japanisch", "tlh":"Klingonisch", "tlh-Qaak":"Klingonisch (pIqaD)", "ko":"Koreanisch", "lv":"Lettisch", "lt":"Litauisch", "ms":"Malaiisch", "mt":"Maltesisch", "no":"Norwegisch", "fa":"Persisch", "pl":"Polnisch", "pt":"Portugiesisch", "ro":"Rumänisch", "ru":"Russisch", "sk":"Slowakisch", "sl":"Slowenisch", "es":"Spanisch", "sv":"Schwedisch", "th":"Thailändisch", "tr":"Türkisch", "uk":"Ukrainisch", "ur":"Urdu", "vi":"Vietnamesisch", "cy":"Walisisch" },
			"el" : { "ar":"Αραβικά", "bg":"Βουλγαρικά", "ca":"Καταλανικά", "zh-CHS":"Κινεζικά (Απ)", "zh-CHT":"Κινεζικά (Πα)", "cs":"Τσεχικά", "da":"Δανικά", "nl":"Ολλανδικά", "en":"Αγγλικά", "et":"Εσθονικά", "fi":"Φινλανδικά", "fr":"Γαλλικά", "de":"Γερμανικά", "el":"Ελληνικά", "ht":"γλώσσα Αϊτής", "he":"Εβραϊκά", "hi":"Χίντι", "mww":"Χμονγκ", "hu":"Ουγγρικά", "id":"Ινδονησιακά", "it":"Ιταλικά", "ja":"Ιαπωνικά", "tlh":"Klingon", "tlh-Qaak":"Klingon (pIqaD)", "ko":"Κορεατικά", "lv":"Λετονικά", "lt":"Λιθουανικά", "ms":"Μαλαϊκά", "mt":"Μαλτεζικά", "no":"Νορβηγικά", "fa":"Περσικά", "pl":"Πολωνικά", "pt":"Πορτογαλικά", "ro":"Ρουμανικά", "ru":"Ρωσικά", "sk":"Σλοβακικά", "sl":"Σλοβενικά", "es":"Ισπανικά", "sv":"Σουηδικά", "th":"Ταϊλανδικά", "tr":"Τουρκικά", "uk":"Ουκρανικά", "ur":"Ουρντού", "vi":"Βιετναμικά", "cy":"Ουαλλικά" },
			"en" : { "ar":"Arabic", "bg":"Bulgarian", "ca":"Catalan", "zh-CHS":"Chinese Simplified", "zh-CHT":"Chinese Traditional", "cs":"Czech", "da":"Danish", "nl":"Dutch", "en":"English", "et":"Estonian", "fi":"Finnish", "fr":"French", "de":"German", "el":"Greek", "ht":"Haitian Creole", "he":"Hebrew", "hi":"Hindi", "mww":"Hmong Daw", "hu":"Hungarian", "id":"Indonesian", "it":"Italian", "ja":"Japanese", "tlh":"Klingon", "tlh-Qaak":"Klingon (pIqaD)", "ko":"Korean", "lv":"Latvian", "lt":"Lithuanian", "ms":"Malay", "mt":"Maltese", "no":"Norwegian", "fa":"Persian", "pl":"Polish", "pt":"Portuguese", "ro":"Romanian", "ru":"Russian", "sk":"Slovak", "sl":"Slovenian", "es":"Spanish", "sv":"Swedish", "th":"Thai", "tr":"Turkish", "uk":"Ukrainian", "ur":"Urdu", "vi":"Vietnamese", "cy":"Welsh" },
			"fr" : { "ar":"Arabe", "bg":"Bulgare", "ca":"Catalan", "zh-CHS":"Chinois simplifié", "zh-CHT":"Chinois traditionnel", "cs":"Tchèque", "da":"Danois", "nl":"Néerlandais", "en":"Anglais", "et":"Estonien", "fi":"Finnois", "fr":"Français", "de":"Allemand", "el":"Grec", "ht":"Haïtien", "he":"Hébreu", "hi":"Hindi", "mww":"Hmong daw", "hu":"Hongrois", "id":"Indonésien", "it":"Italien", "ja":"Japonais", "tlh":"Klingon", "tlh-Qaak":"Klingon (pIqaD)", "ko":"Coréen", "lv":"Letton", "lt":"Lituanien", "ms":"Malaisien", "mt":"Maltais", "no":"Norvégien", "fa":"Perse", "pl":"Polonais", "pt":"Portugais", "ro":"Roumain", "ru":"Russe", "sk":"Slovaque", "sl":"Slovène", "es":"Espagnol", "sv":"Suédois", "th":"Thaï", "tr":"Turc", "uk":"Ukrainien", "ur":"Urdu", "vi":"Vietnamien", "cy":"Gallois" },
			"it" : { "ar":"Arabo", "bg":"Bulgaro", "ca":"Catalano", "zh-CHS":"Cinese semplificato", "zh-CHT":"Cinese tradizionale", "cs":"Ceco", "da":"Danese", "nl":"Olandese", "en":"Inglese", "et":"Estone", "fi":"Finlandese", "fr":"Francese", "de":"Tedesco", "el":"Greco", "ht":"Haitiano", "he":"Ebraico", "hi":"Hindi", "mww":"Hmong Daw", "hu":"Ungherese", "id":"Indonesiano", "it":"Italiano", "ja":"Giapponese", "tlh":"Klingon", "tlh-Qaak":"Klingon (pIqaD)", "ko":"Coreano", "lv":"Lettone", "lt":"Lituano", "ms":"Malese", "mt":"Maltese", "no":"Norvegese", "fa":"Farsi", "pl":"Polacco", "pt":"Portoghese", "ro":"Rumeno", "ru":"Russo", "sk":"Slovacco", "sl":"Sloveno", "es":"Spagnolo", "sv":"Svedese", "th":"Tailandese", "tr":"Turco", "uk":"Ucraino", "ur":"Urdu", "vi":"Vietnamita", "cy":"Gallese" },
			"hu" : { "ar":"Arab", "bg":"Bolgár", "ca":"Katalán", "zh-CHS":"Kínai (egyszerűsített)", "zh-CHT":"Kínai (hagyományos)", "cs":"Cseh", "da":"Dán", "nl":"Holland", "en":"Angol", "et":"Észt", "fi":"Finn", "fr":"Francia", "de":"Német", "el":"Görög", "ht":"Haiti kreol", "he":"Héber", "hi":"Hindi", "mww":"Hmong daw", "hu":"Magyar", "id":"Indonéz", "it":"Olasz", "ja":"Japán", "tlh":"Klingon", "tlh-Qaak":"Klingon (pIqaD)", "ko":"Koreai", "lv":"Lett", "lt":"Litván", "ms":"Maláj", "mt":"Máltai", "no":"Norvég", "fa":"Perzsa", "pl":"Lengyel", "pt":"Portugál", "ro":"Román", "ru":"Orosz", "sk":"Szlovák", "sl":"Szlovén", "es":"Spanyol", "sv":"Svéd", "th":"Thai", "tr":"Török", "uk":"Ukrán", "ur":"Urdu", "vi":"Vietnami", "cy":"Walesi" },
			"nl" : { "ar":"Arabisch", "bg":"Bulgaars", "ca":"Catalaans", "zh-CHS":"Vereenvoudigd Chinees", "zh-CHT":"Traditioneel Chinees", "cs":"Tsjechisch", "da":"Deens", "nl":"Nederlands", "en":"Engels", "et":"Estisch", "fi":"Fins", "fr":"Frans", "de":"Duits", "el":"Grieks", "ht":"Haïtiaans", "he":"Hebreeuws", "hi":"Hindi", "mww":"Hmong Daw", "hu":"Hongaars", "id":"Indonesisch", "it":"Italiaans", "ja":"Japans", "tlh":"Klingon", "tlh-Qaak":"Klingon (pIqaD)", "ko":"Koreaans", "lv":"Lets", "lt":"Litouws", "ms":"Maleis", "mt":"Maltees", "no":"Noors", "fa":"Perzisch", "pl":"Pools", "pt":"Portugees", "ro":"Roemeens", "ru":"Russisch", "sk":"Slowaaks", "sl":"Sloveens", "es":"Spaans", "sv":"Zweeds", "th":"Thais", "tr":"Turks", "uk":"Oekraïens", "ur":"Urdu", "vi":"Vietnamees", "cy":"Welsh" },
			"pl" : { "ar":"Arabski", "bg":"Bułgarski", "ca":"Kataloński", "zh-CHS":"Chiński uproszczony", "zh-CHT":"Chiński tradycyjny", "cs":"Czeski", "da":"Duński", "nl":"Holenderski", "en":"Angielski", "et":"Estoński", "fi":"Fiński", "fr":"Francuski", "de":"Niemiecki", "el":"Grecki", "ht":"Haitański", "he":"Hebrajski", "hi":"Hindi", "mww":"Hmong daw", "hu":"Węgierski", "id":"Indonezyjski", "it":"Włoski", "ja":"Japoński", "tlh":"Klingoński", "tlh-Qaak":"Klingoński (pIqaD)", "ko":"Koreański", "lv":"Łotewski", "lt":"Litewski", "ms":"Malajski", "mt":"Maltański", "no":"Norweski", "fa":"Perski", "pl":"Polski", "pt":"Portugalski", "ro":"Rumuński", "ru":"Rosyjski", "sk":"Słowacki", "sl":"Słoweński", "es":"Hiszpański", "sv":"Szwedzki", "th":"Tajski", "tr":"Turecki", "uk":"Ukraiński", "ur":"Urdu", "vi":"Wietnamski", "cy":"Walijski" },
			"pt" : { "ar":"Árabe", "bg":"Búlgaro", "ca":"Catalão", "zh-CHS":"Chinês simplificado", "zh-CHT":"Chinês tradicional", "cs":"Tcheco", "da":"Dinamarquês", "nl":"Holandês", "en":"Inglês", "et":"Estoniano", "fi":"Finlandês", "fr":"Francês", "de":"Alemão", "el":"Grego", "ht":"Haitiano", "he":"Hebraico", "hi":"Hindi", "mww":"Hmong Daw", "hu":"Húngaro", "id":"Indonésio", "it":"Italiano", "ja":"Japonês", "tlh":"Klingon", "tlh-Qaak":"Klingon (pIqaD)", "ko":"Coreano", "lv":"Letão", "lt":"Lituano", "ms":"Malaio", "mt":"Maltês", "no":"Norueguês", "fa":"Persa", "pl":"Polonês", "pt":"Português", "ro":"Romeno", "ru":"Russo", "sk":"Eslovaco", "sl":"Esloveno", "es":"Espanhol", "sv":"Sueco", "th":"Tailandês", "tr":"Turco", "uk":"Ucraniano", "ur":"Urdu", "vi":"Vietnamita", "cy":"Galês" },
			"ro" : { "ar":"Arabă", "bg":"Bulgară", "ca":"Catalană", "zh-CHS":"Chineză simplificată", "zh-CHT":"Chineză tradiţională", "cs":"Cehă", "da":"Daneză", "nl":"Olandeză", "en":"Engleză", "et":"Estonă", "fi":"Finlandeză", "fr":"Franceză", "de":"Germană", "el":"Greacă", "ht":"Creolă haitiană", "he":"Ebraică", "hi":"Hindi", "mww":"Hmong Daw", "hu":"Maghiară", "id":"Indoneziană", "it":"Italiană", "ja":"Japoneză", "tlh":"Klingoniană", "tlh-Qaak":"Klingoniană (pIqaD)", "ko":"Coreeană", "lv":"Letonă", "lt":"Lituaniană", "ms":"Malaieză", "mt":"Malteză", "no":"Norvegiană", "fa":"Persană", "pl":"Poloneză", "pt":"Portugheză", "ro":"Română", "ru":"Rusă", "sk":"Slovacă", "sl":"Slovenă", "es":"Spaniolă", "sv":"Suedeză", "th":"Thai", "tr":"Turcă", "uk":"Ucraineană", "ur":"Urdu", "vi":"Vietnameză", "cy":"Velşă" },
			"sk" : { "ar":"Arabčina", "bg":"Bulharčina", "ca":"Katalánčina", "zh-CHS":"Čínština (zjednodušená)", "zh-CHT":"Čínština (tradičná)", "cs":"Čeština", "da":"Dánčina", "nl":"Holandčina", "en":"Angličtina", "et":"Estónčina", "fi":"Fínčina", "fr":"Francúzština", "de":"Nemčina", "el":"Gréčtina", "ht":"Haitská kreolčina", "he":"Hebrejčina", "hi":"Hindčina", "mww":"Hmong daw", "hu":"Maďarčina", "id":"Indonézština", "it":"Taliančina", "ja":"Japončina", "tlh":"Klingonèina", "tlh-Qaak":"Klingonèina (pIqaD)", "ko":"Kórejčina", "lv":"Lotyština", "lt":"Litovčina", "ms":"Malajčina", "mt":"Maltčina", "no":"Nórčina", "fa":"Perzština", "pl":"Poľština", "pt":"Portugalčina", "ro":"Rumunčina", "ru":"Ruština", "sk":"Slovenčina", "sl":"Slovinčina", "es":"Španielčina", "sv":"Švédčina", "th":"Thajčina", "tr":"Turečtina", "uk":"Ukrajinčina", "ur":"Urdčina", "vi":"Xietnamčina", "cy":"Waleština" },
			"sl" : { "ar":"Arabščina", "bg":"Bolgarščina", "ca":"Katalonščina", "zh-CHS":"Poenostavljena kitajščina", "zh-CHT":"Tradicionalna kitajščina", "cs":"Češčina", "da":"Danščina", "nl":"Nizozemščina", "en":"Angleščina", "et":"Estonščina", "fi":"Finščina", "fr":"Francoščina", "de":"Nemščina", "el":"Grščina", "ht":"Kreolščina (Haiti)", "he":"Hebrejščina", "hi":"Hindijščina", "mww":"Hmong Daw", "hu":"Madžarščina", "id":"Indonezijščina", "it":"Italijanščina", "ja":"Japonščina", "tlh":"Klingon", "tlh-Qaak":"Klingon (pIqaD)", "ko":"Korejščina", "lv":"Latvijščina", "lt":"Litovščina", "ms":"Malajščina", "mt":"Malteščina", "no":"Norveščina", "fa":"Perzijščina", "pl":"Poljščina", "pt":"Portugalščina", "ro":"Romunščina", "ru":"Ruščina", "sk":"Slovaščina", "sl":"Slovenščina", "es":"Španščina", "sv":"Švedščina", "th":"Tajščina", "tr":"Turščina", "uk":"Ukrajinščina", "ur":"Urdu", "vi":"Vietnamščina", "cy":"Valižanščina" }
		};

		/**
		 * @param {string} msg
		 */
		function debug( msg ) {
			if ( window.console && console.log ) {
				console.log( msg );
			}
		}

		/**
		 * @param {string} data
		 * @param {function} callback
		 */
		function handleApiDone( data, callback ) {
			callback.call( translator, { status: 'success' }, data );
		}

		/**
		 * as of 2015-10-01 the api returns invalid js for exceptions,
		 * which are interpreted as parser errors
		 *
		 * instead of handling these errors here, pass the response to the
		 * callback and let the controlling js handle the error
		 *
		 * @param {string} textStatus
		 * @param {function} callback
		 */
		function handleApiFail( textStatus, callback ) {
			debug( 'there was an error interpreting the microsoft translator api response' );
			debug( 'you can see the api response in the developer network console' );

			callback.call( translator, { status: textStatus } );
		}

		/**
		 * @param {string} endpoint
		 * the api endpoint
		 *
		 * @param {string} callback
		 * the name of the callback method
		 *
		 * @param {string} options
		 * properly encoded query string parameters relevant to the api endpoint
		 */
		function callApi( endpoint, callback, options ) {
			$.ajax({
				data: options.substring( 1, options.length ),
				dataType: 'jsonp',
				jsonp: 'oncomplete',
				url: endpoint
			})

			.done(function( data ) {
				handleApiDone( data, callback );
			})

			.fail(function( jqXHR, textStatus ) {
				handleApiFail( textStatus, callback );
			});

			//var s = document.createElement("script");
			//s.src = endpoint + '?' + 'oncomplete=' + callback + options;
			//document.getElementsByTagName("head")[0].appendChild(s);
		}

		/**
		 * @returns {bool}
		 */
		function online() {
			return navigator.onLine || false;
		}

		/**
		 * @param {function} callback
		 *
		 * @returns {int}
		 * new length of the microsoft.translator.callbacks array
		 */
		function setCallback( callback ) {
			return microsoft.translator.callbacks.push( function() {
				callback.apply( microsoft.translator, arguments );
			});
		}

		/**
		 * A method for making sure that options passed to a function contain the
		 * expected, required, typed options.
		 *
		 * @todo wonder if a library/plugin/method for jQuery exists that already
		 * handles this.
		 *
		 * @param {method} method
		 * the name of the calling method
		 *
		 * @param {object} options
		 * options to be validated
		 *
		 * @param {array} requirements
		 * the required options that should be present
		 *
		 * @example requirements
			 {
			  'default': 'default string',
			  'empty': false,
			  'option': 'appId',
			  'required': true,
			  'type': 'string'
			 }
		 *
		 * @returns {object}
		 * a validated options object
		 */
		function validateOptions( method, options, requirements ) {
			var
			error_msg_prefix = '';

			$.each( requirements, function() {
				error_msg_prefix = method + ', parameter options.' + this.option;

				// option not defined attempt to set it to default
				if ( options[this.option] === undefined ) {

					// is option required
					// is this.required truthy
					if ( this.required ) {
						if ( this['default'] === undefined ) {
							throw new Error( error_msg_prefix + ' was not provided yet it is required and no default value was provided' );
						}
					}

					// can option be empty
					// is this.empty falsy
					if ( !this.empty ) {
						if ( this['default'] === undefined ) {
							throw new Error( error_msg_prefix + ' was not provided yet it cannot be empty and no default value was provided' );
						}
					}

					// set option with default
					options[this.option] = this['default'];
				}

				switch ( this.type ) {
					case 'array':
						// is option an array
						if ( !$.isArray( options[this.option] ) ) {
							throw new Error( error_msg_prefix + ' is not an array' );
						}

						// is option an empty array
						if ( !this.empty && options[this.option].length < 1 ) {
							throw new Error( error_msg_prefix + ' must contain at least one array element' );
						}

						break;

					case 'function':
						// is option a function
						if ( !$.isFunction( options[this.option] ) ) {
							throw new Error( error_msg_prefix + ' is not a function' );
						}

						break;

					case 'object':
						// not defined and not required
						if ( options[this.option] === undefined && this.empty ) {
							break;
						}

						// is option an object
						if ( !$.isPlainObject( options[this.option] ) ) {
							throw new Error( error_msg_prefix + ' is not an object' );
						}

						// is option an empty object
						if ( !this.empty && $.isEmptyObject( options[this.option] ) ) {
							throw new Error( error_msg_prefix + ' must contain at least one element' );
						}

						break;

					case 'string':
						// not defined and not required
						if ( options[this.option] === undefined && this.empty ) {
							break;
						}

						// is option a string
						if ( typeof options[this.option] !== 'string' ) {
							throw new Error( error_msg_prefix + ' is not a string' );
						}

						// is option an empty string
						if ( !this.empty && options[this.option].length < 1 ) {
							throw new Error( error_msg_prefix + ' cannot be an empty string' );
						}

						break;
				}
			});

			return options;
		}

		/**
		 * AddTranslation Method
		 * Adds a translation to the translation memory.
		 *
		 * @see http://msdn.microsoft.com/en-us/library/ff512393.aspx
		 *
		 * Request URI
		 * http://api.microsofttranslator.com/V2/Ajax.svc/AddTranslation
		 *
		 * @param {object} options
		 *
		 * @param {string} options.appId
		 * A string containing "Bearer" + " " + access token.
		 * (required)
		 *
		 * @param {function} options.callback
		 * A function that will handle the promised return value from the api
		 * (required)
		 *
		 * @param {string} options.category
		 * A string containing the category (domain) of the translation.
		 * Defaults to "general".
		 * (optional)
		 *
		 * @param {string} options.contentType
		 * The format of the text being translated. The supported formats
		 * are "text/plain" and "text/html". Any HTML needs to be well-formed.
		 * (optional)
		 *
		 * @param {string} options.from
		 * A string containing the language code of the source language.
		 * Must be a valid culture name.
		 * (required)
		 *
		 * @param {string} options.originalText
		 * A string containing the text to translate from. The string has
		 * a maximum length of 1000 characters
		 * (required)
		 *
		 * @param {int} options.rating
		 * An int representing the quality rating for this string.
		 * Value between -10 and 10. Defaults to 1.
		 * (optional)
		 *
		 * @param {string} options.to
		 * A string containing the language code of the target language.
		 * Must be a valid culture name.
		 * (required)
		 *
		 * @param {string} options.translatedText
		 * A string containing translated text in the target language.
		 * The string has a maximum length of 2000 characters.
		 * (required)
		 *
		 * @param {string} options.uri
		 * A string containing the content location of this translation.
		 * (optional)
		 *
		 * @param {string} options.user
		 * A string used to track the originator of the submission.
		 * (required)
		 */
		translator.addTranslation = function( options ) {
			debug( 'microsoft.translator.addTranslation not yet implemented' );
		};

		/**
		 * AddTranslationArray Method
		 * Adds a translation to the translation memory.
		 *
		 * @see http://msdn.microsoft.com/en-us/library/ff512394.aspx
		 *
		 * Request URI
		 * http://api.microsofttranslator.com/V2/Ajax.svc/AddTranslationArray
		 *
		 * @param {object} options
		 *
		 * @param {string} options.appId
		 * A string containing "Bearer" + " " + access token.
		 * (required)
		 *
		 * @param {function} options.callback
		 * A function that will handle the promised return value from the api
		 * (required)
		 *
		 * @param {string} options.from
		 * A string containing the language code of the source language.
		 * Must be a valid culture name.
		 * (required)
		 *
		 * @param {object} options.options
		 * A set of TranslateOptions
		 *
		 * @param {object} options.options.category
		 * (optional)
		 *
		 * @param {object} options.options.contentType
		 * (optional)
		 *
		 * @param {object} options.options.uri
		 * (optional)
		 *
		 * @param {object} options.options.user
		 * (required)
		 *
		 * @param {string} options.to
		 * A string containing the language code of the target language.
		 * Must be a valid culture name.
		 * (required)
		 *
		 * @param {array} options.translations
		 * An array of translations to add to translation memory.
		 * Each translation must contain: originalText, translatedText, rating.
		 * The size of each originalText and translatedText is limited to 1000 chars.
		 * The total of all the originalText(s) and translatedText(s) must not
		 * exceed 10000 characters. The maximum number of array elements is 100.
		 * (required)
		 */
		translator.addTranslationArray = function( options ) {
			debug( 'microsoft.translator.addTranslationArray not yet implemented' );
		};

		/**
		 * BreakSentences Method
		 * Breaks a piece of text into sentences and returns an array containing
		 * the lengths in each sentence.
		 *
		 * @see http://msdn.microsoft.com/en-us/library/ff512395.aspx
		 *
		 * Request URI
		 * http://api.microsofttranslator.com/V2/Ajax.svc/BreakSentences
		 *
		 * @param {object} options
		 *
		 * @param {string} options.appId
		 * A string containing "Bearer" + " " + access token.
		 * (required)
		 *
		 * @param {function} options.callback
		 * A function that will handle the promised return value from the api
		 * (required)
		 *
		 * @param {string} options.language
		 * A string representing the language code of input text.
		 * (required)
		 *
		 * @param {string} options.text
		 * A string representing the text to split into sentences.
		 * The size of the text must not exceed 10000 characters.
		 * (required)
		 *
		 * @returns {array}
		 * An array of integers representing the lengths of the sentences.
		 * The length of the array is the enumber of sentences, and the values
		 * are the length of each sentence.
		 */
		translator.breakSentences = function( options ) {
			var
			callback_index = 0,
			query_params = '',
			result = [];

			if ( !online() ) {
				return false;
			}

			options = validateOptions(
				'microsoft.translator.breakSentences',
				options,
				[
					{
						'option': 'appId',
						'required': true,
						'type': 'string'
					},
					{
						'option': 'callback',
						'required': true,
						'type': 'function'
					},
					{
						'option': 'language',
						'required': true,
						'type': 'string'
					},
					{
						'option': 'text',
						'required': true,
						'type': 'string'
					}
				]
			);

			query_params += '&appId=Bearer+' + encodeURIComponent( options.appId );
			query_params += '&language=' + encodeURIComponent( options.language );
			query_params += '&text=' + encodeURIComponent( options.text );

			callback_index = setCallback( options.callback ) - 1;

			callApi(
				'http://api.microsofttranslator.com/V2/Ajax.svc/BreakSentences',
				microsoft.translator.callbacks[ callback_index ],
				query_params
			);

			return result;
		};

		/**
		 * @type {array}
		 */
		translator.callbacks = [];

		/**
		 * Detect Method
		 * Use the Detect Method to identify the language of a selected piece of text.
		 *
		 * @see http://msdn.microsoft.com/en-us/library/ff512396.aspx
		 *
		 * Request URI
		 * http://api.microsofttranslator.com/V2/Ajax.svc/Detect
		 *
		 * @param {object} options
		 *
		 * @param {string} options.appId
		 * A string containing "Bearer" + " " + access token.
		 * (required)
		 *
		 * @param {function} options.callback
		 * A function that will handle the promised return value from the api
		 * (required)
		 *
		 * @param {string} options.text
		 * A string representing the text from an unknown language.
		 * The size of the text must not exceed 10000 characters.
		 * (required)
		 *
		 * @returns {string}
		 * A string containing a two-character Language code for the given text.
		 */
		translator.detect = function( options ) {
			var
			callback_index = 0,
			query_params = '',
			result = '';

			if ( !online() ) {
				return false;
			}

			options = validateOptions(
				'microsoft.translator.detect',
				options,
				[
					{
						'option': 'appId',
						'required': true,
						'type': 'string'
					},
					{
						'option': 'callback',
						'required': true,
						'type': 'function'
					},
					{
						'option': 'text',
						'required': true,
						'type': 'string'
					}
				]
			);

			query_params += '&appId=Bearer+' + encodeURIComponent( options.appId );
			query_params += '&text=' + encodeURIComponent( options.text );

			callback_index = setCallback( options.callback ) - 1;

			callApi(
				'http://api.microsofttranslator.com/V2/Ajax.svc/Detect',
				microsoft.translator.callbacks[ callback_index ],
				query_params
			);

			return result;
		};

		/**
		 * DetectArray Method
		 * Use the DetectArray Method to identify the language of an array of
		 * strings all at once. Performs independent detection of each individual
		 * array element and returns a result for each element of the array.
		 *
		 * @see http://msdn.microsoft.com/en-us/library/ff512396.aspx
		 *
		 * Request URI
		 * http://api.microsofttranslator.com/V2/Ajax.svc/DetectArray
		 *
		 * @param {object} options
		 *
		 * @param {string} options.appId
		 * A string containing "Bearer" + " " + access token.
		 * (required)
		 *
		 * @param {function} options.callback
		 * A function that will handle the promised return value from the api
		 * (required)
		 *
		 * @param {array} options.texts
		 * A string array representing the text from an unknown language.
		 * The size of the text must not exceed 10000 characters.
		 * (required)
		 *
		 * @returns {array}
		 * A string array containing a two-character Language codes for each row
		 * of the input array.
		 */
		translator.detectArray = function( options ) {
			var
			callback_index = 0,
			query_params = '',
			result = [];

			if ( !online() ) {
				return false;
			}

			options = validateOptions(
				'microsoft.translator.detectArray',
				options,
				[
					{
						'option': 'appId',
						'required': true,
						'type': 'string'
					},
					{
						'option': 'callback',
						'required': true,
						'type': 'function'
					},
					{
						'option': 'texts',
						'required': true,
						'type': 'array'
					}
				]
			);

			query_params += '&appId=Bearer+' + encodeURIComponent( options.appId );
			query_params += '&texts=' + encodeURIComponent( JSON.stringify( options.texts ) );

			callback_index = setCallback( options.callback ) - 1;

			callApi(
				'http://api.microsofttranslator.com/V2/Ajax.svc/DetectArray',
				microsoft.translator.callbacks[ callback_index ],
				query_params
			);

			return result;
		};

		/**
		 * @param {string} locale
		 * @return {object}
		 */
		translator.getLanguageCodesAndNames = function( locale ) {
			var
			result = {};

			if (
				$.inArray( locale, languageCodes ) !== -1 &&
				languageCodesAndNames[locale]
			) {
				result = languageCodesAndNames[locale];
			}

			return result;
		};

		/**
		 * GetLanguageNames Method
		 * Retrieves friendly names for the languages passed in as the parameter
		 * languageCodes, and localized using the passed locale language.
		 *
		 * @see http://msdn.microsoft.com/en-us/library/
		 *
		 * Request URI
		 * http://api.microsofttranslator.com/V2/Ajax.svc/GetLanguageNames
		 *
		 * @param {object} options
		 *
		 * @param {string} options.appId
		 * A string containing "Bearer" + " " + access token.
		 * (required)
		 *
		 * @param {function} options.callback
		 * A function that will handle the promised return value from the api
		 * (required)
		 *
		 * @param {string} options.languageCodes
		 * A string array representing the ISO 639-1 language codes to retrieve
		 * the friendly name for.
		 * (required)
		 *
		 * @param {string} options.locale
		 * A string representing a combination of an ISO 639 two-letter lowercase
		 * culture code associated with a language and an ISO 3166 two-letter
		 * uppercase subculture code to localize the language names or a ISO 639
		 * lowercase culture code by itself.
		 * (required)
		 *
		 * @returns {array}
		 * A string array containing the friendly language names of the
		 * passed languageCodes.
		 */
		translator.getLanguageNames = function( options ) {
			var
			callback_index = 0,
			query_params = '',
			result = [];

			if ( !online() ) {
				return false;
			}

			options = validateOptions(
				'microsoft.translator.detect',
				options,
				[
					{
						'option': 'appId',
						'required': true,
						'type': 'string'
					},
					{
						'option': 'callback',
						'required': true,
						'type': 'function'
					},
					{
						'default': languageCodes,
						'empty': true,
						'option': 'languageCodes',
						'required': false,
						'type': 'array'
					},
					{
						'default': 'en',
						'option': 'locale',
						'required': true,
						'type': 'string'
					}
				]
			);

			if ( $.inArray( options.locale, languageCodes ) === - 1 ) {
				debug(
					'microsoft.translator.getLanguageNames options.locale [' +
					options.locale + '] is not a valid locale'
				);

				options.locale = 'en';
			}

			query_params += '&appId=Bearer+' + encodeURIComponent( options.appId );
			query_params += '&languageCodes=' + encodeURIComponent( JSON.stringify( options.languageCodes ) );
			query_params += '&locale=' + encodeURIComponent( options.locale );

			callback_index = setCallback( options.callback ) - 1;

			callApi(
				'http://api.microsofttranslator.com/V2/Ajax.svc/GetLanguageNames',
				microsoft.translator.callbacks[ callback_index ],
				query_params
			);

			return result;
		};

		/**
		 * GetLanguagesForSpeak Method
		 * Retrieves the languages available for speech synthesis.
		 *
		 * @see http://msdn.microsoft.com/en-us/library/
		 *
		 * Request URI
		 * http://api.microsofttranslator.com/V2/Ajax.svc/GetLanguagesForSpeak
		 *
		 * @param {object} options
		 *
		 * @param {string} options.appId
		 * A string containing "Bearer" + " " + access token.
		 * (required)
		 *
		 * @param {function} options.callback
		 * A function that will handle the promised return value from the api
		 * (required)
		 *
		 * @returns {array}
		 * A string array containing the language codes supported for speech
		 * synthesis by the Translator Services.
		 */
		translator.getLanguagesForSpeak = function( options ) {
			var
			callback_index = 0,
			query_params = '',
			result = [];

			if ( !online() ) {
				return false;
			}

			options = validateOptions(
				'microsoft.translator.getLanguagesForSpeak',
				options,
				[
					{
						'option': 'appId',
						'required': true,
						'type': 'string'
					},
					{
						'option': 'callback',
						'required': true,
						'type': 'function'
					}
				]
			);

			query_params += '&appId=Bearer+' + encodeURIComponent( options.appId );

			callback_index = setCallback( options.callback ) - 1;

			callApi(
				'http://api.microsofttranslator.com/V2/Ajax.svc/GetLanguagesForSpeak',
				microsoft.translator.callbacks[ callback_index ],
				query_params
			);

			return result;
		};

		/**
		 * GetLanguagesForTranslate Method
		 * Obtain a list of language codes representing languages that are
		 * supported by the Translation Service. Translate() and TranslateArray()
		 * can translate between any of these languages.
		 *
		 * @see http://msdn.microsoft.com/en-us/library/ff512401.aspx
		 *
		 * Request URI
		 * http://api.microsofttranslator.com/V2/Ajax.svc/GetLanguagesForTranslate
		 *
		 * @param {object} options
		 *
		 * @param {string} options.appId
		 * A string containing "Bearer" + " " + access token.
		 * (required)
		 *
		 * @param {function} options.callback
		 * A function that will handle the promised return value from the api
		 * (required)
		 *
		 * @returns {array}
		 * A string array containing the language codes supported by
		 * the Translator Services.
		 */
		translator.getLanguagesForTranslate = function( options ) {
			var
			callback_index = 0,
			query_params = '',
			result = [];

			if ( !online() ) {
				return false;
			}

			options = validateOptions(
				'microsoft.translator.getLanguagesForTranslate',
				options,
				[
					{
						'empty': false,
						'option': 'appId',
						'required': true,
						'type': 'string'
					},
					{
						'option': 'callback',
						'required': true,
						'type': 'function'
					}
				]
			);

			query_params += '&appId=Bearer+' + encodeURIComponent( options.appId );

			callback_index = setCallback( options.callback ) - 1;

			callApi(
				'http://api.microsofttranslator.com/V2/Ajax.svc/GetLanguagesForTranslate',
				microsoft.translator.callbacks[ callback_index ],
				query_params
			);

			return result;
		};

		/**
		 * GetTranslations Method
		 * Retrieves an array of translations for a given language pair from the
		 * store and the MT engine. GetTranslations differs from Translate as it
		 * returns all available translations.
		 *
		 * @see http://msdn.microsoft.com/en-us/library/ff512402.aspx
		 *
		 * Request URI
		 * http://api.microsofttranslator.com/V2/Ajax.svc/GetTranslations
		 *
		 * @param {object} options
		 *
		 * @param {string} options.appId
		 * A string containing "Bearer" + " " + access token.
		 * (required)
		 *
		 * @param {function} options.callback
		 * A function that will handle the promised return value from the api
		 * (required)
		 *
		 * @param {string} options.from
		 * A string representing the language code of the translation text.
		 * (required)
		 *
		 * @param {int} options.maxTranslations
		 * An int representing the maximum number of translations to return.
		 * (required)
		 *
		 * @param {object} options.TranslateOptions
		 * A TranslateOptions object which contains the values listed below.
		 * They are all optional and default to the most common settings.
		 *
		 * @param {string} options.TranslateOptions.Category
		 * A string containing the category (domain) of the translation.
		 * Defaults to "general".
		 * (optional)
		 *
		 * @param {string} options.TranslateOptions.ContentType
		 * A string containing the type of content.
		 * Either "text/html" or "text/plain".
		 * Defaults to "text/plain".
		 * (optional)
		 *
		 * @param {string} options.TranslateOptions.State
		 * User state to help correlate request and response.
		 * The same contents will be returned in the response.
		 * (optional)
		 *
		 * @param {string} options.TranslateOptions.Uri
		 * A string containing the content location of this translation.
		 * (optional)
		 *
		 * @param {string} options.TranslateOptions.User
		 * A string used to track the originator of the submission.
		 * (optional)
		 *
		 * @param {string} options.text
		 * A string representing the text to translate.
		 * The size of the text must not exceed 10000 characters.
		 * (required)
		 *
		 * @param {string} options.to
		 * A string representing the language code to translate the text into.
		 * (required)
		 *
		 * @returns {array} GetTranslationsResponse
		 * A GetTranslationsResponse containing the following values:
		 *
		 * @returns {string} GetTranslationsResponse.From
		 * If the method did not specify a From language, this will be the result
		 * of auto language detection. Otherwise it will be the given From language.
		 *
		 * @returns {string} GetTranslationsResponse.State
		 * User state to help correlate request and response.
		 * Contains the same value as given in the TranslateOptions parameter.
		 *
		 * @returns {array} GetTranslationsResponse.Translations
		 * An array of matches found, stored in TranslationMatch (see below) objects.
		 * The translations may include slight variants of the original text (fuzzy matching).
		 * The translations will be sorted: 100% matches first, fuzzy matches below.
		 *
		 * @returns {object} GetTranslationsResponse.Translations.TranslationMatch
		 * A TranslationMatch object consists of the following:
		 *
		 * @returns {int} GetTranslationsResponse.Translations.TranslationMatch.Count
		 * The number of times this translation with this rating has been selected.
		 * The value will be 0 for the automatically translated response.
		 *
		 * @returns {string} GetTranslationsResponse.Translations.TranslationMatch.Error
		 * If an error has occurred for a specific input string, the error code is stored.
		 * Otherwise the field is empty.
		 *
		 * @returns {int} GetTranslationsResponse.Translations.TranslationMatch.MatchDegree
		 * The system matches input sentences against the store, including inexact matches.
		 * MatchDegree indicates how closely the input text matches the original text
		 * found in the store. The value returned ranges from 0 to 100, where 0 is
		 * no similarity and 100 is an exact case sensitive match.
		 *
		 * @returns {string} GetTranslationsResponse.Translations.TranslationMatch.MatchedOriginalText
		 * Original text that was matched for this result. Only returned if the matched
		 * original text was different than the input text. Used to return the source
		 * text of a fuzzy match. Not returned for Microsoft Translator results.
		 *
		 * @returns {int} GetTranslationsResponse.Translations.TranslationMatch.Rating
		 * Indicates the authority of the person making the quality decision.
		 * Machine Translation results will have a rating of 5. Anonymously provided
		 * translations will generally have a rating of 1 to 4, whilst authoritatively
		 * provided translations will generally have a rating of 6 to 10.
		 *
		 * @returns {string} GetTranslationsResponse.Translations.TranslationMatch.TranslatedText
		 * The translated text.
		 */
		translator.getTranslations = function( options ) {
			var result = [];
			debug( 'microsoft.translator.getTranslations not yet implemented' );
			return result;
		};

		/**
		 * GetTranslationsArray Method
		 * Use the GetTranslationsArray method to retrieve multiple translation
		 * candidates for multiple source texts.
		 *
		 * @see http://msdn.microsoft.com/en-us/library/ff512403.aspx
		 *
		 * Request URI
		 * http://api.microsofttranslator.com/V2/Ajax.svc/GetTranslationsArray
		 *
		 * @param {object} options
		 *
		 * @param {string} options.appId
		 * A string containing "Bearer" + " " + access token.
		 * (required)
		 *
		 * @param {function} options.callback
		 * A function that will handle the promised return value from the api
		 * (required)
		 *
		 * @param {string} options.from
		 * A string representing the language code of the translation text.
		 * (required)
		 *
		 * @param {int} options.maxTranslations
		 * An int representing the maximum number of translations to return.
		 * (required)
		 *
		 * @param {object} options.TranslateOptions
		 * A TranslateOptions object which contains the values listed below.
		 * They all default to the most common settings.
		 * You do not need to set any of the values.
		 *
		 * @param {string} options.TranslateOptions.Category
		 * A string containing the category (domain) of the translation.
		 * Defaults to "general".
		 * (optional)
		 *
		 * @param {string} options.TranslateOptions.ContentType
		 * A string containing the type of content. Either "text/html" or "text/plain".
		 * Defaults to "text/plain".
		 * (optional)
		 *
		 * @param {string} options.TranslateOptions.State
		 * User state to help correlate request and response.
		 * The same contents will be returned in the response.
		 * (optional)
		 *
		 * @param {string} options.TranslateOptions.Uri
		 * A string containing the content location of this translation.
		 * (optional)
		 *
		 * @param {string} options.TranslateOptions.User
		 * A string used to track the originator of the submission.
		 * (optional)
		 *
		 * @param {array} options.texts
		 * An array containing the texts for translation. All strings must be of the
		 * same language. The total of all texts to be translated must not exceed
		 * 10000 characters. The maximum number of array elements is 10.
		 * (required)
		 *
		 * @param {string} options.to
		 * A string representing the language code to translate the text into.
		 * (required)
		 *
		 * @returns {array} GetTranslationsResponse
		 * Returns a GetTranslationsResponse array. Each GetTranslationsResponse
		 * has the following elements:
		 *
		 * @returns {string} GetTranslationsResponse.From
		 * If the method did not specify a From language, this will be the result
		 * of auto language detection. Otherwise it will be the given From language.
		 *
		 * @returns {string} GetTranslationsResponse.State
		 * User state to help correlate request and response.
		 * Contains the same value as given in the TranslateOptions parameter.
		 *
		 * @returns {array} GetTranslationsResponse.Translations
		 * An array of matches found, stored in TranslationMatch (see below) objects.
		 * The translations may include slight variants of the original text (fuzzy matching).
		 * The translations will be sorted: 100% matches first, fuzzy matches below.
		 *
		 * @returns {object} GetTranslationsResponse.Translations.TranslationMatch
		 * A TranslationMatch object consists of the following:
		 *
		 * @returns {int} GetTranslationsResponse.Translations.TranslationMatch.Count
		 * The number of times this translation with this rating has been selected by the users.
		 * The value will be 0 for the automatically translated response.
		 *
		 * @returns {string} GetTranslationsResponse.Translations.TranslationMatch.Error
		 * If an error has occurred for a specific input string, the error code is stored.
		 * Otherwise the field is empty.
		 *
		 * @returns {int} GetTranslationsResponse.Translations.TranslationMatch.MatchDegree
		 * TThe system matches input sentences against the store, including inexact matches.
		 * MatchDegree indicates how closely the input text matches the original text found
		 * in the store. The value returned ranges from 0 to 100, where 0 is no similarity
		 * and 100 is an exact case sensitive match.
		 *
		 * @returns {string} GetTranslationsResponse.Translations.TranslationMatch.MatchedOriginalText
		 * Original text that was matched for this result. Only returned if the matched original text
		 * was different than the input text. Used to return the source text of a fuzzy match.
		 * Not returned for Microsoft Translator results.
		 *
		 * @returns {int} GetTranslationsResponse.Translations.TranslationMatch.Rating
		 * Indicates the authority of the person making the quality decision. Machine Translation
		 * results will have a rating of 5. End user submitted translations will generally have
		 * a rating of 1 to 4, whilst webmaster approved translations will generally have a
		 * rating of 6 to 10.
		 *
		 * @returns {string} GetTranslationsResponse.Translations.TranslationMatch.TranslatedText
		 * The translated text.
		 */
		translator.getTranslationsArray = function( options ) {
			var result = [];
			debug( 'microsoft.translator.getTranslationsArray not yet implemented' );
			return result;
		};

		/**
		 * Speak Method
		 * Returns a string which is a URL to a wave or mp3 stream of the passed-in
		 * text being spoken in the desired language.
		 *
		 * @see http://msdn.microsoft.com/en-us/library/
		 *
		 * Request URI
		 * http://api.microsofttranslator.com/V2/Ajax.svc/Speak
		 *
		 * @param {object} options
		 *
		 * @param {string} options.appId
		 * A string containing "Bearer" + " " + access token.
		 * (required)
		 *
		 * @param {function} options.callback
		 * A function that will handle the promised return value from the api
		 * (required)
		 *
		 * @param {string} options.format
		 * A string specifying the content-type ID. Currently, “audio/wav” and
		 * “audio/mp3” are available. The default value is "audio/wav".
		 * (optional)
		 *
		 * @param {string} options.language
		 * A string representing the supported language code to speak the text in.
		 * The code must be present in the list of codes returned from
		 * the method GetLanguagesForSpeak.
		 * (required)
		 *
		 * @param {string} options.options
		 * A string specifying the quality of the audio signals. Currently,
		 * “MaxQuality” and “MinSize” are available. With “MaxQuality”, you can
		 * get the voice(s) with the highest quality, and with “MinSize”, you can
		 * get the voices with the smallest size. If no value is provided,
		 * we default to “MinSize”.
		 * (optional)
		 *
		 * @param {string} options.text
		 * A string containing a sentence or sentences of the specified language
		 * to be spoken for the wave stream. The size of the text to speak must
		 * not exceed 2000 characters.
		 * (required)
		 *
		 * @returns {string}
		 * Returns a string which is a URL to a wave or mp3 stream of the
		 * passed-in text being spoken in the desired language.
		 */
		translator.speak = function( options ) {
			var
			callback_index = 0,
			query_params = '',
			result = '';

			if ( !online() ) {
				return false;
			}

			options = validateOptions(
				'microsoft.translator.speak',
				options,
				[
					{
						'option': 'appId',
						'required': true,
						'type': 'string'
					},
					{
						'option': 'callback',
						'required': true,
						'type': 'function'
					},
					{
						'empty': true,
						'option': 'format',
						'required': false,
						'type': 'string'
					},
					{
						'default': 'en',
						'option': 'language',
						'required': true,
						'type': 'string'
					},
					{
						'empty': true,
						'option': 'options',
						'required': false,
						'type': 'string'
					},
					{
						'option': 'text',
						'required': true,
						'type': 'string'
					}
				]
			);

			if ( $.inArray( options.language, languagesForSpeak ) === - 1 ) {
				debug(
					'microsoft.translator.speak options.language [' +
					options.locale + '] is not a valid language value'
				);

				options.language = 'en';
			}

			query_params += '&appId=Bearer+' + encodeURIComponent( options.appId );
			query_params += '&language=' + encodeURIComponent( options.language );
			query_params += '&text=' + encodeURIComponent( options.text );

			// optional parameter format
			if ( options.format ) {
				query_params += '&format=' + encodeURIComponent( options.format );
			}

			// optional parameter options
			if ( options.options ) {
				query_params += '&options=' + encodeURIComponent( options.options );
			}

			callback_index = setCallback( options.callback ) - 1;

			callApi(
				'http://api.microsofttranslator.com/V2/Ajax.svc/Speak',
				microsoft.translator.callbacks[ callback_index ],
				query_params
			);

			return result;
		};

		/**
		 * Translate Method
		 * Translates a text string from one language to another.
		 *
		 * @see http://msdn.microsoft.com/en-us/library/
		 *
		 * Request URI
		 * http://api.microsofttranslator.com/V2/Ajax.svc/Translate
		 *
		 * @param {object} options
		 *
		 * @param {string} options.appId
		 * A string containing "Bearer" + " " + access token.
		 * (required)
		 *
		 * @param {function} options.callback
		 * A function that will handle the promised return value from the api
		 * (required)
		 *
		 * @param {string} options.category
		 * A string containing the category (domain) of the translation.
		 * Defaults to "general".
		 * (optional)
		 *
		 * @param {string} options.contentType
		 * The format of the text being translated. The supported formats are
		 * "text/plain" and "text/html". Any HTML needs to be well-formed.
		 * (required)
		 *
		 * @param {string} options.from
		 * A string representing the language code of the translation text. If left
		 * empty the response will include the result of language auto-detection.
		 * (optional)
		 *
		 * @param {string} options.text
		 * A string representing the text to translate. The size of the text must
		 * not exceed 10000 characters.
		 * (required)
		 *
		 * @param {string} options.to
		 * A string representing the language code to translate the text into.
		 * (required)
		 *
		 * @returns {string}
		 * A string representing the translated text. If you previously use
		 * AddTranslation or AddTranslationArray to enter a translation with a
		 * rating of 5 or higher for the same source sentence, Translate returns
		 * only the top choice that is available to your system. The "same source
		 * sentence" means the exact same (100% matching), except for capitalization,
		 * white space, tag values, and punctuation at the end of a sentence.
		 * If no rating is stored with a rating of 5 or above then the returned
		 * result will be the automatic translation by Microsoft Translator.
		 */
		translator.translate = function( options ) {
			var
			callback_index = 0,
			query_params = '',
			result = '';

			if ( !online() ) {
				return false;
			}

			options = validateOptions(
				'microsoft.translator.translate',
				options,
				[
					{
						'option': 'appId',
						'required': true,
						'type': 'string'
					},
					{
						'option': 'callback',
						'required': true,
						'type': 'function'
					},
					{
						'empty': true,
						'option': 'category',
						'required': false,
						'type': 'string'
					},
					{
						'default': 'text/plain',
						'option': 'contentType',
						'required': true,
						'type': 'string'
					},
					{
						'empty': true,
						'option': 'from',
						'required': false,
						'type': 'string'
					},
					{
						'option': 'text',
						'required': true,
						'type': 'string'
					},
					{
						'default': 'en',
						'option': 'to',
						'required': true,
						'type': 'string'
					}
				]
			);

			if ( $.inArray( options.to, languageCodes ) === - 1 ) {
				debug(
					'microsoft.translator.translate options.to [' +
					options.locale + '] is not a valid to value'
				);

				options.to = 'en';
			}

			query_params += '&appId=Bearer+' + encodeURIComponent( options.appId );
			query_params += '&contentType=' + encodeURIComponent( options.contentType );
			query_params += '&text=' + encodeURIComponent( options.text );
			query_params += '&to=' + encodeURIComponent( options.to );

			// optional parameter category
			if ( options.category ) {
				query_params += '&category=' + encodeURIComponent( options.category );
			}

			// optional parameter from
			if ( options.from ) {
				if ( $.inArray( options.from, languageCodes ) === - 1 ) {
					debug(
						'microsoft.translator.translate options.from [' +
						options.locale + '] is not a valid from value'
					);
				} else {
					query_params += '&from=' + encodeURIComponent( options.from );
				}
			}

			callback_index = setCallback( options.callback ) - 1;

			callApi(
				'http://api.microsofttranslator.com/V2/Ajax.svc/Translate',
				microsoft.translator.callbacks[ callback_index ],
				query_params
			);

			return result;
		};

		/**
		 * TranslateArray Method
		 * Translates an array of text strings from one language to another.
		 *
		 * @see http://msdn.microsoft.com/en-us/library/
		 *
		 * Request URI
		 * http://api.microsofttranslator.com/V2/Ajax.svc/TranslateArray
		 *
		 * @param {object} options
		 *
		 * @param {string} options.appId
		 * A string containing "Bearer" + " " + access token.
		 * (required)
		 *
		 * @param {function} options.callback
		 * A function that will handle the promised return value from the api
		 * (required)
		 *
		 * @param {string} options.from
		 * A string representing the language code of the translation text.
		 * If left empty the response will include the result of language auto-detection.
		 * (optional)
		 *
		 * @param {object} options.options
		 * A TranslateOptions element containing the values below. They are all
		 * optional and default to the most common settings.
		 *
		 * @param {string} options.options.Category
		 * A string containing the category (domain) of the translation.
		 * Defaults to "general".
		 * (optional)
		 *
		 * @param {string} options.options.ContentType
		 * The format of the text being translated. The supported formats are
		 * "text/plain", "text/xml" and "text/html". Any HTML needs to be well-formed.
		 * (optional)
		 *
		 * @param {string} options.options.Uri
		 * A string containing the content location of this translation.
		 * (optional)
		 *
		 * @param {string} options.options.User
		 * A string used to track the originator of the submission.
		 * (optional)
		 *
		 * @param {string} options.options.State
		 * User state to help correlate request and response. The same contents
		 * will be returned in the response.
		 * (optional)
		 *
		 * @param {string} options.to
		 * A string representing the language code to translate the text to.
		 * (required)
		 *
		 * @param {string} options.texts
		 * An array containing the texts for translation. All strings must be of
		 * the same language. The total of all texts to be translated must not
		 * exceed 10000 characters. The maximum number of array elements is 2000.
		 * (required)
		 *
		 * @returns {array} TranslateArrayResponse
		 * Returns a TranslateArrayResponse array. Each TranslateArrayResponse
		 * has the following elements:
		 *
		 * @returns {string} TranslateArrayResponse.Error
		 * Indicates an error if one has occurred. Otherwise set to null.
		 *
		 * @returns {array} TranslateArrayResponse.OriginalSentenceLengths
		 * An array of integers indicating the length of each sentence in the
		 * original source text. The length of the array indicates the number
		 * of sentences.
		 *
		 * @returns {string} TranslateArrayResponse.TranslatedText
		 * The translated text.
		 *
		 * @returns {array} TranslateArrayResponse.TranslatedSentenceLengths
		 * An array of integers indicating the length of each sentence in the
		 * translated text. The length of the array indicates the number of sentences.
		 *
		 * @returns {string} TranslateArrayResponse.State
		 * User state to help correlate request and response. Returns the same
		 * content as in the request.
		 */
		translator.translateArray = function( options ) {
			var
			callback_index = 0,
			query_params = '',
			result = '';

			if ( !online() ) {
				return false;
			}

			options = validateOptions(
				'microsoft.translator.translate',
				options,
				[
					{
						'option': 'appId',
						'required': true,
						'type': 'string'
					},
					{
						'option': 'callback',
						'required': true,
						'type': 'function'
					},
					{
						'empty': true,
						'option': 'from',
						'required': false,
						'type': 'string'
					},
					{
						'empty': true,
						'options': 'options',
						'required': false,
						'type': 'object'
					},
					{
						'option': 'texts',
						'required': true,
						'type': 'array'
					},
					{
						'default': 'en',
						'option': 'to',
						'required': true,
						'type': 'string'
					}
				]
			);

			if ( $.inArray( options.to, languageCodes ) === - 1 ) {
				debug(
					'microsoft.translator.translateArray options.to [' +
					options.locale + '] is not a valid to value'
				);

				options.to = 'en';
			}

			query_params += '&appId=Bearer+' + encodeURIComponent( options.appId );
			query_params += '&texts=' + encodeURIComponent( JSON.stringify( options.texts ) );
			query_params += '&to=' + encodeURIComponent( options.to );

			// optional parameter from
			if ( options.from ) {
				if ( $.inArray( options.from, languageCodes ) === - 1 ) {
					debug(
						'microsoft.translator.translateArray options.from [' +
						options.locale + '] is not a valid from value'
					);
				} else {
					query_params += '&from=' + encodeURIComponent( options.from );
				}
			}

			// optional parameter category
			if ( options.options ) {
				query_params += '&options=' + encodeURIComponent( JSON.stringify( options.options ) );
			}

			callback_index = setCallback( options.callback ) - 1;

			callApi(
				'http://api.microsofttranslator.com/V2/Ajax.svc/Translate',
				microsoft.translator.callbacks[ callback_index ],
				query_params
			);

			return result;
		};

		return translator;

	}( microsoft.translator || {} ));

	return microsoft;

}( window.microsoft || {}, jQuery ));
