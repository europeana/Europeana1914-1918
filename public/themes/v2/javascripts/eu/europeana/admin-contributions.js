(function() {

	'use strict';
	
	jQuery("fieldset.collapsible").collapse();
	jQuery("fieldset.collapsed").collapse( { closed: true } );
	RunCoCo.fieldsetButtons.init();
	
	
}());