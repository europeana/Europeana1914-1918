/**
 *  would rather see the additional input field, language other, being added in place
 *  in the html by the back-end script, but our current understanding of formtastic
 *  shows this as a limitation of formtastic because of the multiple checkbox options
 */

$(document).ready(function() {
  
  var langOtherCheckbox = $('li[id$="_metadata_attributes_field_lang_terms_input"] input[type="checkbox"]').filter(":last");
  var langOtherLi = $('li[id$="_metadata_attributes_field_lang_other_input"]');
  var langOtherInput = $('input[type="text"]', langOtherLi);

  if ((langOtherLi.length == 1) && (langOtherCheckbox.length == 1)) {
    langOtherLi.hide();
    langOtherLi.remove();
    langOtherCheckbox.parent().parent().append( langOtherLi );
    
    if (langOtherCheckbox.attr('checked')) {
      langOtherLi.show();
    }
    
    langOtherCheckbox.click(function() {
      langOtherInput.val('');
      langOtherLi.toggle();
    });
  }
  
});
