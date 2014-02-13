(function() {
	
	'use strict';
	
	var $fieldsets = jQuery('form > fieldset'),
        $attachment_help_links = jQuery('#attachment-help a'),
		$single_file = jQuery('#attachment_file_input'),
		$multiple_file = jQuery('#uploadify_upload');
	
	
	function hideSingleFile() {
		
		if ( $single_file.is(':visible') ) {
			
			$single_file.toggle('height');
			
		}
		
		if ( $multiple_file.is(':hidden') ) {
			
			$multiple_file.toggle('height');
			
		}
		
	}
	
	
	function hideMultipleFile() {
		
		if ( $single_file.is(':hidden') ) {
			
			$single_file.toggle('height');
			
		}
		
		if ( $multiple_file.is(':visible') ) {
			
			$multiple_file.toggle('height');
			
		}
		
	}
	
	
	/**
	 *	opens a collapsed fieldset
	 *	
	 *	@param {jQuery Object} $elm
	 *	represents the fieldset that needs to be un-collapased
	 */
	function openFieldset( $elm ) {
		
		if ( $elm.hasClass( 'collapsed' ) ) {
			
			$elm.find('legend').eq(0).trigger('click');
			
		}
		
	}
	
	
	/**
	 *	closes a collapsed fieldset
	 *	
	 *	@param {jQuery Object} $elm
	 *	represents the fieldset that needs to be collapased
	 */
	function closeFieldset( $elm ) {
		
		if ( $elm.hasClass( 'collapsible' ) ) {
			
			$elm.find('legend').eq(0).trigger('click');
			
		}
		
	}
	
	
	/**
	 *	@param {jQuery Object} $elm
	 *	jQuery Object representing the fieldset that should be opened
	 */
	function showFieldset( $elm ) {
		
		if ( $elm.is(':hidden') ) {
			
			$elm.toggle('height');
			
		}
		
		if ( RunCoCo.cataloguer ) {
			
			openFieldset( $elm );
			
		}
		
	}
	
	
	/**
	 *	@param {jQuery Object} $elm
	 *	jQuery Object representing the fieldset that should be closed
	 */
	function hideFieldset( $elm ) {
		
		if ( $elm.is(':visible') ) {
			
			$elm.toggle('height');
			
		}
		
	}
	
	
	/**
	 *	@param {String} except_id
	 *	the id of the fieldset that should stay open
	 *
	 *	@param {Enum hide|show} other_fieldsets
	 *	whether to hide or show the other fieldsets
	 */
	function toggleFieldsets( except_id, other_fieldsets ) {
		
		var $elm;
		
		$fieldsets.each(function() {
			
			$elm = jQuery(this);
			
			if ( except_id === $elm.attr('id') ) {
				
				if ( 'submit' === $elm.attr('id') ) {
					
					openFieldset( $elm );
					
				}
				
				if ( 'attachment_upload' === $elm.attr('id') ) {
					
					openFieldset( $elm );
					
				}
				
				showFieldset( $elm );
				
			} else {
			
				switch ( other_fieldsets ) {
					
					case 'hide' :
						
						closeFieldset( $elm );
						hideFieldset( $elm );
						break;
					
					case 'show' :
						
						if ( 'attachment_upload' === $elm.attr('id')
							&& ( 'single-item' === except_id
								|| 'multiple-item' === except_id )
							) {
							
							openFieldset( $elm );
							
						} else {
							
							closeFieldset( $elm );
							
						}
						
						if ( 'single-item' === except_id
							&& 'submit' === $elm.attr('id') ) {
							
							hideFieldset( $elm );
							
						} else {
							
							showFieldset( $elm );
							
						}
						
						break;
					
				}
				
			}
			
		});
		
		if ( 'single-item' == except_id ) {
			
			hideMultipleFile();
			
		} else if ( 'attachment_upload' == except_id ) {
			
			hideSingleFile();
			
		}
		
	}
	
	
	function highlightOption( id ) {
      
      $attachment_help_links.each( function() {
        
        var $elm = jQuery(this);
        
        if ( id === $elm.attr('id') ) {
			
          $elm.addClass('highlighted-option');
		  
        } else {
			
          $elm.removeClass('highlighted-option');
		  
        }
        
      });
      
    }
	
	
	function singleItemHandler( evt ) {
		
		evt.preventDefault();
		highlightOption('single-item');
		toggleFieldsets( 'single-item', 'show' );
		window.scrollTo( 0, 0 );
		
	}
	
	
	function multipleItemHandler( evt ) {
		
		evt.preventDefault();
		highlightOption('multiple-items');
		toggleFieldsets( 'attachment_upload', 'hide' );
		window.scrollTo( 0, 0 );
		
	}
	
	function submitStoryHandler( evt ) {
		
		evt.preventDefault();
		highlightOption('submit-story');
		toggleFieldsets( 'submit', 'hide' );
		window.scrollTo( 0, 0 );
		
	}
	
	
	function init() {
		
		jQuery('#single-item').bind( 'click', singleItemHandler );
		jQuery('#multiple-items').bind( 'click', multipleItemHandler );
		jQuery('#submit-story').bind( 'click', submitStoryHandler );
		
		jQuery('#add-another-attachment').bind( 'click', singleItemHandler );
		jQuery('#submit-your-story').bind( 'click', submitStoryHandler );
		
		if ( RunCoCo.cataloguer ) {
			
			if ( RunCoCo.ready_for_submit ) {
				
				jQuery('#submit-your-story').trigger('click');
				
			} else {
				
				jQuery('#multiple-items').trigger('click');
				
			}
			
		}
		
	}
	
	
	init();
	
  
}());

// Clone metadata from story
$(document).ready(function(){
  if (RunCoCo.contribution) {
    
    var cloneButtonHtml =
          '<label>' + I18n.t('javascripts.digital_object.labels.copy_from_story') + '</label>' +
          '<input type="button" value="' + I18n.t('javascripts.digital_object.links.copy_from_story') + '" />' +
          '<p class="inline-hints">' + I18n.t('javascripts.digital_object.hints.copy_from_story') + '</p>',
        cloneButton = $( cloneButtonHtml );
    cloneButton.click(function() {
      $('#attachment_title').val(RunCoCo.contribution.title);
      for (var key in RunCoCo.contribution.metadata['metadata_record']) {
        var fieldValue = RunCoCo.contribution.metadata['metadata_record'][key];
        
        // if metadata value is an array, look for individual input elements with ids
        // like 'attachment_metadata_attributes_field_keywords_term_ids_63'
        // and check them
        if(Object.prototype.toString.call(fieldValue) === '[object Array]') {
          $('*[id^="attachment_metadata_attributes_' + key + '_"]').removeAttr('checked');
          for (var i = 0; i < fieldValue.length; i++) {
            $('#attachment_metadata_attributes_' + key + '_' + fieldValue[i]).each(function(index) {
              var fieldType = $(this).attr('type').toLowerCase();
              if (fieldType == 'checkbox') {
                $(this).attr('checked', 'checked');
              }
            });
          }
        } 
          
        $('#attachment_metadata_attributes_' + key).each(function(index) {
          var fieldTagName = this.tagName.toLowerCase();
          if (fieldTagName == 'input') {
            var fieldType = $(this).attr('type').toLowerCase();
            if (fieldType == 'text') {
              $(this).val(fieldValue);
            } else if (fieldType == 'hidden') {
              $(this).val(fieldValue);
              $(this).change();
            }
          } else if (fieldTagName == 'textarea') {
            $(this).text(fieldValue);
          } else if (fieldTagName == 'select') {
            $('option[value="' + fieldValue + '"]', this).attr('selected', 'selected');
          }
        });
      }
      return false;
    });
    $('#attachment_metadata_attributes_field_cover_image_terms_input').before($('<li></li>').append(cloneButton));
  }
});
