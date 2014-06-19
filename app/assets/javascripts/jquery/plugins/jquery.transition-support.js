/*global jQuery */
/*jslint browser: true, white: true */

// http://www.abeautifulsite.net/blog/2012/12/feature-detection-for-css-transitions-via-jquery-support/
jQuery.support.transition = (function() {
	'use strict';

	var thisBody = document.body || document.documentElement,
		thisStyle = thisBody.style,
		support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;
	return support;
}());
