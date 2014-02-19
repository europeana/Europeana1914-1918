/**
 * CHANGES
 *         - Customised for RunCoCo.
 * v.2.1.3 - Made it $.noConflict() compatible
 * v.2.1.2 - Fixed bug in which nested fieldsets do not work correctly.
 * v.2.1.1 - Forgot to put the new filter from v.2.1 into the if (settings.closed)
 * v.2.1 - Changed jQuery(this).parent().children().filter( ELEMENTS HERE) to jQuery(this).parent().children().not('label').  Prevents you from having to guess what elements will be in the fieldset.
 * v.2.0 - Added settings to allow a fieldset to be initiated as closed.
 *
 * This script may be used by anyone, but please link back to me.
 *
 * Copyright 2009-2010.  Michael Irwin (http://michael.theirwinfamily.net)
 */
       
jQuery.fn.collapse = function(options) {
	var defaults = {
		closed : false
	}
	settings = jQuery.extend({}, defaults, options);

	return this.each(function() {
		var obj = jQuery(this);
		obj.find("legend:first").addClass('collapsible').click(function() {
			if (obj.hasClass('collapsed')) {
				obj.removeClass('collapsed').addClass('collapsible');
				obj.children().not('legend').show();
			} else {
			  obj.removeClass('collapsible').addClass('collapsed');
				obj.children().not('legend').hide();
			}
		});
		if (settings.closed) {
			obj.addClass('collapsed').find("legend:first").addClass('collapsed');
			obj.children().not("legend:first").css('display', 'none');
		}
	});
};

jQuery(document).ready(function() {
  jQuery("fieldset.collapsible").collapse();
  jQuery("fieldset.collapsed").collapse( { closed: true } );
});
