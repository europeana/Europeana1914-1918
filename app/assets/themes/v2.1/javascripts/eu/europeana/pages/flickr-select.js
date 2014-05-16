(function( $ ) {

	'use strict';
	
	var flickrLicenseInfo = $( '#flickr_license_info' ).remove();
	var flickrLicenseHeading = $( 'h3', flickrLicenseInfo ).remove();
	flickrLicenseInfo.attr('title', flickrLicenseHeading.text() );
	
	$( 'a[href="#flickr_license_info"]' ).click(function() {
		flickrLicenseInfo.dialog({
			width: 350,
			height: 250,
			modal: true
		});
		return false;
	});
	
}( jQuery ));
