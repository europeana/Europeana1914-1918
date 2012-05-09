/**
 *  analytics.js
 *
 *  @package	com.google
 *  @author		dan entous <contact@gmtplusone.com>
 *  @created	2011-09-15 17:27 GMT +1
 *  @version	2011-09-15 17:27 GMT +1
 */
/**
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-XXXXXXXX-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
 */
(function() {
	
	'use strict';
	
	if ( !window.com ) { window.com = {}; }
	if ( !com.google ) { com.google = {}; }
	
	
	com.google.analytics = {
		
		gaId : 'UX-XXXXXXXX-1',
		
		
		createAnalyticsArray : function() {
			
			if ( window._gaq ) {
				
				throw new Error( 'window._gaq already exists' );
				
			}
			
			window._gaq = [];
			
		},
		
		
		setAccountId : function( gaId ) {
			
			gaId = gaId || this.gaId;
			_gaq.push(['_setAccount', gaId]);
			
		},
		
		
		trackPageView : function() {
			
			_gaq.push(['_trackPageview']);
			
		},
		
		
		loadApi : function() {
			
			js.loader.loadScripts([{
				file : 'ga.js',
				path : ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/'
			}]);
			
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