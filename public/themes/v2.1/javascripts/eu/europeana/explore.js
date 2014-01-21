/*global jQuery */
/*jslint browser: true, regexp: true, white: true */
(function() {
	'use strict';

	jQuery('#explore-editors-picks')
		.readMore({
			read_more_link : '#read-more'
		});

	jQuery('#q').autocomplete({
		minLength : 3,
		source : document.location.protocol + '//' + document.location.host + '/suggest.json',
		select: function() { var self = this; setTimeout( function() { jQuery(self).closest('form').submit(); }, 100 ); }
	});


}());
