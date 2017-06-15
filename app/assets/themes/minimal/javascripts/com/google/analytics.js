/*jslint browser: true, white: true, nomen: true */
/*global _gaq, com, google, js, RunCoCo */
/**
 *  analytics.js
 *
 *  @package	com.google
 *  @author		dan entous <contact@gmtplusone.com>
 *  @created	2011-09-15 17:27 gmt +1
 *  @version	2012-01-14 12:06 gmt +1
 */
(function() {
	
	'use strict';
	
	if ( !window.com ) { window.com = {}; }
	if ( !com.google ) { com.google = {}; }
	
	
	com.google.analytics = {
		
		
		gaId : 'UA-XXXXXXXX-1',
		
		
		/**
		 * Event Tracking is a method available in the ga.js tracking code that you
		 * can use to record user interaction with website elements
		 *
		 * @param {string} category (required)
		 * The name you supply for the group of objects you want to track.
		 * 
		 * @param {string} action (required)
		 * A string that is uniquely paired with each category, and commonly used to 
		 * define the type of user interaction for the web object.
		 *
		 * @param {string} label (optional)
		 * An optional string to provide additional dimensions to the event data.
		 * 
		 * @param {int} value (optional)
		 * An integer that you can use to provide numerical data about the user event.
		 * 
		 * @param {boolean} non-interaction (optional)
		 * A boolean that when set to true, indicates that the event hit will not be
		 * used in bounce-rate calculation.
		 *
		 * @see https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiEventTracking
		 * @see https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
		 */
		trackEvent : function( category, action, opt_label, opt_value, opt_noninteraction ) {
			
			_gaq.push(['_trackEvent', category, action, opt_label, opt_value, opt_noninteraction ]);
			
		},
		
		
		trackPageView : function() {
			
			_gaq.push(['_trackPageview']);
			
		},
		
		
		loadApi : function() {
			
			js.loader.loadScripts([{
				file : 'ga.js',
				path : ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/'
			}]);
			
		},
		
		
		setAccountId : function( gaId ) {
			
			gaId = gaId || this.gaId;
			_gaq.push(['_setAccount', gaId]);
			
		},
		
		
		createAnalyticsArray : function() {
			
			if ( window._gaq ) {
				
				throw new Error( 'window._gaq already exists' );
				
			}
			
			window._gaq = [];
			
		},
		
		
		init : function() {
			
			this.createAnalyticsArray();
			this.setAccountId( RunCoCo.gaId );
			this.trackPageView();
			this.loadApi();
			
		}
		
	};
	
	com.google.analytics.init();
	
}());