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
		
		//evt.preventDefault();
		highlightOption('single-item');
		toggleFieldsets( 'single-item', 'show' );
		
	}
	
	
	function multipleItemHandler( evt ) {
		
		evt.preventDefault();
		highlightOption('multiple-items');
		toggleFieldsets( 'attachment_upload', 'hide' );
		
	}
	
	function submitStoryHandler( evt ) {
		
		//evt.preventDefault();
		highlightOption('submit-story');
		toggleFieldsets( 'submit', 'hide' );
		
	}
	
	
	function init() {
		
		jQuery('#single-item').bind( 'click', singleItemHandler );
		jQuery('#multiple-items').bind( 'click', multipleItemHandler );
		jQuery('#submit-story').bind( 'click', submitStoryHandler );
		
		jQuery('#add-another-attachment').bind( 'click', singleItemHandler );
		jQuery('#submit-your-story').bind( 'click', submitStoryHandler );
		
	}
	
	
	init();
	
  
}());