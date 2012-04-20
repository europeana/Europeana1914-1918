(function() {
  
  'use strict';
  if ( !window.RunCoCo ) { window.RunCoCo = {}; }
  
  /**
   *  would rather see the additional input field, language other, being added in place
   *  in the html by the back-end script, but our current understanding of formtastic
   *  shows this as a limitation of formtastic because of the multiple checkbox options
   *  so we have to move it with js
   */
  RunCoCo.languageOther = {
   
      langOtherCheckbox : jQuery('li[id$="_metadata_attributes_field_lang_terms_input"] input[type="checkbox"]').filter(":last"),
      langOtherLi : jQuery('li[id$="_metadata_attributes_field_lang_other_input"]'),
      langOtherInput : null,
      
      init : function() {
          
          var self = this;
          
          self.langOtherInput = jQuery('input[type="text"]', self.langOtherLi );
          
          if ( ( self.langOtherLi.length == 1 ) && ( self.langOtherCheckbox.length == 1 ) ) {
              
              self.langOtherLi.hide();
              self.langOtherLi.remove();
              self.langOtherCheckbox.parent().parent().append( self.langOtherLi );
              
              if ( self.langOtherCheckbox.attr('checked') ) {
                  
                  self.langOtherLi.slideToggle();
                  
              }
              
              self.langOtherCheckbox.on( 'click', function() {
                  
                  self.langOtherInput.val('');
                  self.langOtherLi.slideToggle();
                  
              });
              
          }
          
      }
      
  };

}());