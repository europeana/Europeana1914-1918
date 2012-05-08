/**
 *	@author dan entous <contact@gmtplusone.com>
 *	@version 2012-05-08 10:47 gmt +1
 */
(function() {
	
	'use strict';

	
	RunCoCo.translation_services = {
		
		links : {
			
			$return_to_original : jQuery( '<a/>', { href : '', text : I18n.t('javascripts.translate.return-to-language') } )
			
		},
		
		containers : {
			
			$loading_animation : jQuery('<img/>', { src : "/images/europeana-theme/progress_bar/loading_animation.gif", height : 32, width : 32, alt : "loading animation"} ),
			$translation_services : jQuery( '<div/>', { id : "translation-services" } )
			
		},
		
		translators : {
			
			microsoft : {
				
				callbacks: [],
				translations : {}
		
			}
		
		},
		
		text_nodes : [],
		source_text : [],
		to_locale : null,
		microsoft : null,
		
		
		handleTranslateRequest : function( e ) {
			
			var self = e.data.self,
				translator = e.data.translator,
				i,
				ii = self.text_nodes.length;
			
			// set the translator’s to locale value
			self.to_locale = jQuery(this).val();
			if ( self.to_locale.length < 1 ) { return; }
			RunCoCo.translation_services[translator].options.to_locale = self.to_locale;
			
			self.addReturnToOriginal();
			self.containers.$loading_animation.fadeToggle();
			
			for ( i = 0; i < ii; i = i + 1 ) {
				
				self.setTranslatorTranslationLocale( translator );
				self.setTranslatorTranslationDefault( translator, i );
				
				if ( self.translators[translator].translations[self.to_locale] && self.translators[translator].translations[self.to_locale][i] ) {
					
					self.applyTranslation( self.text_nodes[i], self.translators[translator].translations[self.to_locale][i] );
					
				} else {
					
					RunCoCo.translation_services[translator].options.text_to_translate = self.source_text[i];
					RunCoCo.translation_services[translator].options.callback = 'RunCoCo.translation_services.translators.' + translator + '.callbacks[' + i + ']';
					RunCoCo.translation_services.microsoft.translate();
					
				}
				
			}
			
			self.containers.$loading_animation.fadeToggle();
			
		},
		
		
		/**
		 *	make sure the translator’s translations array exists for the selected locale
		 * 
		 * @param translator
		 */
		setTranslatorTranslationLocale : function( translator ) {
			
			if ( this.translators[translator].translations[this.to_locale] ) { return; }
			this.translators[translator].translations[this.to_locale] = [];
			
		},
		
		
		/**
		 *	make sure the translator’s translations arrays have default values for each source text node
		 *
		 * @param translator
		 * @param i
		 */
		setTranslatorTranslationDefault : function( translator, i ) {
			
			if ( this.translators[translator].translations[this.to_locale][i] ) { return; }
			this.translators[translator].translations[this.to_locale][i] = null;
			
		},
		
		
		applyTranslation : function( $text_node, translation ) {
			
			$text_node.html( translation );
			js.utils.flashHighlight( $text_node, '#ffff00', '#ffffff', 1500);
			
		},
		
		
		addReturnToOriginal : function() {
			
			if ( this.links.$return_to_original.is(':hidden') ) {
				
				this.containers.$translation_services
					.append(
						this.links.$return_to_original.bind('click', { self : this }, this.handleReturnToOriginal )
						.fadeToggle()
					);
				
			}
			
		},
		
		
		handleReturnToOriginal : function( e ) {
			
			var self = e.data.self,
				i,
				ii = self.text_nodes.length;
			
			e.preventDefault();
			
			for ( i = 0; i < ii; i = i + 1 ) {
				
				self.applyTranslation( self.text_nodes[i], self.source_text[i] );
				
			};
			
			jQuery('#microsoft-translate-element select').val('');
			self.links.$return_to_original.fadeOut();
			
		},
		
		
		addTranslatorMicrosoft : function() {
			
			var self = this;
			
			self.microsoft = new com.microsoft.translator({
				
				BING_API_KEY : RunCoCo.bing_translate_key,
				callback : 'RunCoCo.translation_services.microsoft.callback',
				browser_locale : I18n.locale,
				
				$container_for_selector : self.containers.$translation_services,
				translator_selector_html :
					'<div id="microsoft-translate-element">' +
						'<select>' +
							'<option value="">' + I18n.t('javascripts.translate.translate-to') + '</option>' +
						'</select>' +
						'<span>Powered by <span class="bold">Microsoft<sup>®</sup></span> Translator</span>' +
					'</div>'
				
			});
			
			
			self.microsoft.init(
				
				function() {
					
					jQuery('#microsoft-translate-element select').bind(
						
						'change',
						{ self : self, translator : 'microsoft' },
						self.handleTranslateRequest
						
					);
					
				}
				
			);
			
		},
		
		
		/**
		 *	each translation should be placed into an array that matches up with the callback for the request per translator
		 *	the array entry contains the original text if no translation came thru then it will not be replaced
		 *	original nodes are kept and a click on the return to language link brings them back
		 *
		 * @param translator
		 */
		setUpCallbacks : function( translator ) {
			
			var self = this,
					i,
					ii = self.text_nodes.length;
			
			
			for ( i = 0; i < ii; i += 1 ) {
				
				(function() {
					
					var x = i;
					self.source_text[x] = jQuery.trim( self.text_nodes[x].html() );
					
					self.translators[translator].callbacks[x] = 
						
						function( response ) {
							
							self.translators[translator].translations[self.to_locale][x] = response;
							self.applyTranslation( self.text_nodes[x], response );
							
						};
				
				})();
			
			}			
			
		},
		
		
		captureOriginalTextNodes : function() {
			
			var self = this;
			
			jQuery('.translate').each( function() {
				
				self.text_nodes.push( jQuery( this ) );
				
			});
			
		},
		
		
		/**
		 *	@param {jQuery Object} $elm
		 *	represents where to place the translation drop down in relation to
		 */
		init : function( $elm ) {
			
			$elm.after( this.containers.$translation_services.append( this.containers.$loading_animation) );
			this.captureOriginalTextNodes();
			this.setUpCallbacks('microsoft');
			this.addTranslatorMicrosoft();
			
		}
		
	};

}());