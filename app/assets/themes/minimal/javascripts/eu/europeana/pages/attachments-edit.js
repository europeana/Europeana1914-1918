(function() {

  'use strict';
  
  jQuery("fieldset.collapsible").collapse();
  jQuery("fieldset.collapsed").collapse( { closed: true } );
  
  RunCoCo.languageOther.init();
  RunCoCo.fieldsetButtons.init();
  
}());