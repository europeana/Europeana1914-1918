/**
 *	@fileOverview
 *	This file contains JavaScript utility functions
 *
 *	@author dan entous &lt;contact@pennlinepublishing.com&gt;
 *	@version 2011-12-05 11:19 gmt +1
 */
(function( jQuery, js ) {
	
	'use strict';
	js.utils = {};
	
	
	/**
	 *	@namespace
	 *	a namespace container for the utility methods
	 */
	js.utils = {
		
		/**
		 *	a JavaScript object that contains page specific configuration to be used by the loadPageComponents methods
		 */
		page_config : {
			
			components : [],
			callback : function() {}
			
		},
		
		
		/**
		 *	determines whether or not a JavaScript namespace exists
		 *	
		 *	@param {String} namespace
		 *	@returns {Boolean}
		 */
		namespaceExists : function( namespace ) {
			
			var namespace_parts = namespace.split( '.' ),
				root = window,
				fcn = '',
				i = 0,
				ii = namespace_parts.length;
			
			for ( i = 0; i < ii; i += 1 ) {
				
				fcn += namespace_parts[i];
				
				if ( typeof root[ namespace_parts[i] ] === 'undefined' ) {
					
					return false;
					
				}
				
				root = root[ namespace_parts[i] ];
				fcn += '.';
				
			}
			
			return true;
			
		},
		
		
		/**
		 *	determines whether an array of components has been loaded or not
		 *
		 *	@returns {Boolean}
		 */
		componentsLoaded : function() {
			
			var components = this.page_config.components,
				i,
				ii = components.length;
			
			for ( i = 0; i < ii; i += 1 ) {
				
				if ( !components[i].loaded ) {
					
					return false;
					
				}
				
			}
			
			return true;
			
		},
		
		
		/**
		 *	loads a specific component, given by i, in an array of components to load.
		 *	calls the callback, if present, and all components in the array of components have loaded
		 *
		 *	@param {Int} i
		 */
		loadComponent : function(i) {
			
			var components = this.page_config.components;
			
			jQuery.ajax({
				
				url : components[i].path + components[i].file,
				dataType : "script",
				complete : function() {
					
					components[i].loaded = true;
					
					if ( js.utils.componentsLoaded() && js.utils.page_config.callback ) {
						
						js.utils.page_config.callback();
						
					}
					
					
				
				}
				
			});				
			
		},
		
		
		/**
		 *	iterates over a page configuration object’s array of components and makes sure they are loaded;
		 *	then, if present, calls the callback function that’s part of the configuration object
		 *	
		 *	@param {Object} page_config
		 *
		 *	@example
		 *	{
		 *		components : [
		 *			{
		 *				'file' : 'jquery.validate.min.js',
		 *				'path' : '/assets/js/com/jquery/plugins/jquery-validation-1.9.0/',
		 *				'namespace' : 'jQuery.validator'
		 *			},
		 *			{
		 *				'file' : 'validation.js',
		 *				'path' : '/assets/js/com/philips/myphilips/',
		 *				'namespace' : 'com.philips.myphilips.validation'
		 *			}
		 *		],
		 *		callback : function() {
		 *			jQuery('#e-mail').focus();
		 *			com.philips.myphilips.validation.setupValidation({
		 *				url : '/assets/validations/login.json',
		 *				form_id : 'form-login',
		 *				parameters : {
		 *					'page' : 'login',
		 *					'service' : 'get-rules',
		 *					'service-key' : atg_service_key
		 *				}
		 *			});
		 *		}
		 *	}
		 */
		loadPageComponents : function( page_config ) {
			
			this.page_config = page_config;
			
			var components = this.page_config.components,
				i,
				ii = components.length;
			
			for ( i = 0; i < ii; i += 1 ) {
				
				if ( this.namespaceExists( components[i].namespace ) ) {
					
					components[i].loaded = true;
					
				} else {
					
					components[i].loaded = false;
					this.loadComponent(i);
					
				}
				
			}
			
		}
		
		
	};
	
} ( jQuery, js ));