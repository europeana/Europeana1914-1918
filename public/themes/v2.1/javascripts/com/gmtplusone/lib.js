/*global lib */
/*jslint browser: true, devel: true, white: true */
/**
 *	@author dan entous <contact@gmtplusone.com>
 */
(function( window, document ) {

	'use strict';
	if ( window.lib ) { console.log('lib already loaded; returning'); return; }


	/**
	 * library for js interaction
	 */
	window.lib = {

		display_debug_output : true,
		empty_console : { log : function() {} },

		setConsole : function() {
			if ( window.console === undefined || !this.display_debug_output ) {
				window.console = this.empty_console;
			}
		},

		/**
		 * @param DOM Object obj
		 *
		 * @param string event
		 * dom event type, e.g. click
		 *
		 * @param function fn
		 * funtion that will handle the event
		 *
		 * @link http://ejohn.org/projects/flexible-javascript-events/
		 */
		addEvent : function( obj, type, fn ) {
			if ( obj === null ) {
				console.log('cannot addEvent to null object');
				return;
			}

			if ( obj.attachEvent ) {
				obj['e'+type+fn] = fn;

				obj[type+fn] = function() {
					var event = window.event;

					if ( event.stopPropagation === undefined ) {
						event.stopPropagation = function() {
							event.cancelBubble = true;
						};
					}

					if ( event.preventDefault === undefined ) {
						event.preventDefault = function() {
							event.returnValue = false;
						};
					}

					obj['e'+type+fn]( event );

				};

				obj.attachEvent( 'on'+type, obj[type+fn] );

			} else {
				obj.addEventListener( type, fn, false );
			}
		}

	};

	window.lib.setConsole();

}( window, document ));
