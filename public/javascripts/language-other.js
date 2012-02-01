/**
 *	script relies on hard coded ids shown below
 *	
 *	would rather see the additional input field, language other, being added in place
 *	in the html by the back-end script, but our current understanding of formtastic
 *	shows this as a limitation of formtastic because of the multiple checkbox options
 */

$(document).ready(function() {
	
	var $lang_other_checkbox = jQuery('#contribution_metadata_attributes_field_lang_term_ids_95').length === 1 ? jQuery('#contribution_metadata_attributes_field_lang_term_ids_95') : jQuery('#attachment_metadata_attributes_field_lang_term_ids_95'),
		$lang_other_li = jQuery('#contribution_metadata_attributes_field_lang_other_input').length === 1 ? jQuery('#contribution_metadata_attributes_field_lang_other_input') : jQuery('#attachment_metadata_attributes_field_lang_other_input'),
		$lang_other_input = jQuery('#contribution_metadata_attributes_field_lang_other').length === 1 ? jQuery('#contribution_metadata_attributes_field_lang_other') : jQuery('#attachment_metadata_attributes_field_lang_other');
	
	
	if ( 1 === $lang_other_li.length && 1 === $lang_other_checkbox.length ) {
	  
	  $lang_other_li.hide();
	  $lang_other_li.remove();
	  $lang_other_checkbox.parent().parent().append( $lang_other_li );
	  
	  if ( $lang_other_checkbox.attr('checked') ) {
		
		$lang_other_li.show();
		
	  }
	  
	  $lang_other_checkbox.click(function() {
		
		$lang_other_input.val('');
		$lang_other_li.toggle();
		
	  });
	  
	}
	
});