(function() {
	
	'use strict';
	var $fieldsets = jQuery('fieldset'),
        $attachment_help_links = jQuery('#attachment-help a');
    
    
    function openFieldset( id ) {
      
      if ( jQuery(id).hasClass('collapsed') ) {        
        jQuery(id + ' legend').trigger('click');        
      }
      
    }
    
    function adjustFieldsets( type ) {
      
      $fieldsets.each(function() {
        
        var $elm = jQuery(this);
        
        switch ( type ) {
          
          case 'submit' :
            
            if ( 'submit' === $elm.attr('id') ) {
              
              if ( $elm.is(':hidden') ) {
                
                $elm.toggle('height');
                
              }
              
            } else if ( $elm.is(':visible') ) {
              
              $elm.toggle('height');
              
            }
            
            break;
          
          
          case 'single' :
            
            if ( 'attachment_upload' === $elm.attr('id') ) {
              
              if ( $elm.is(':hidden') ) {
                
                $elm.toggle('height');
                
              }
            
            } else if ( 'submit' === $elm.attr('id') && $elm.is(':visible') ) {
              
              $elm.toggle('height');
              
            } else if ( $elm.is(':hidden') ) {
              
              $elm.toggle('height');
              
            }
            
            break;
          
          case 'multiple' :
            
            if ( 'attachment_upload' === $elm.attr('id') ) {
              
              if ( $elm.is(':hidden') ) {
                
                $elm.toggle('height');
                
              }
            
            } else if ( 'submit' === $elm.attr('id') && $elm.is(':visible') ) {
              
              $elm.toggle('height');
              
            } else if ( $elm.is(':visible') ) {
              
              $elm.toggle('height');
              
            }
            
            break;
          
        }
        
      });
      
    }
    
    function highlightClick( id ) {
      
      $attachment_help_links.each( function() {
        
        var $elm = jQuery(this);
        
        if ( id === $elm.attr('id') ) {          
          $elm.css('font-weight','bold');          
        } else {          
          $elm.css('font-weight','normal');          
        }
        
      });     
      
    }
    
    jQuery('#single-item').click(function(evt) {
      
      evt.preventDefault();
      highlightClick( jQuery(this).attr('id') );
      adjustFieldsets('single');
      
      if ( jQuery('#uploadify_upload').is(':visible') ) {
        jQuery('#uploadify_upload').toggle('height', function() {
          if ( jQuery('#attachment_file_input').is(':hidden') ) {
            jQuery('#attachment_file_input').toggle('height');
          }
        });
      }
      
      if ( jQuery('#attachment_file_input').is(':hidden') ) {
        jQuery('#attachment_file_input').toggle('height');
      }
      
    });
    
    jQuery('#multiple-items').click(function(evt) {
      
      evt.preventDefault();
      highlightClick( jQuery(this).attr('id') );
      adjustFieldsets('multiple');
      
      if ( jQuery('#attachment_file_input').is(':visible') ) {
        jQuery('#attachment_file_input').toggle('height', function() {
          if ( jQuery('#uploadify_upload').is(':hidden') ) {
            jQuery('#uploadify_upload').toggle('height');
          }
        });
      }
      
      if ( jQuery('#uploadify_upload').is(':hidden') ) {
        jQuery('#uploadify_upload').toggle('height');
      }
      
    });
    
    jQuery('#submit-story').click(function(evt) {
      
      evt.preventDefault();
      highlightClick( jQuery(this).attr('id') );
      adjustFieldsets('submit');
      
    });
    
    
    setTimeout(function() {
      
        if ( RunCoCo.ready_to_submit ) {          
          jQuery('#submit-story').trigger('click');          
        } else {
          if ( RunCoCo.cataloguer ) {            
            jQuery('#multiple-items').trigger('click');    
          } else {
            jQuery('#single-item').trigger('click');
          }          
        }
      
      },
      500
    );
    
    
    jQuery('#terms-conditions').click(function(evt) {
      
      evt.preventDefault();
      jQuery('#submit #terms-of-use').toggle('height');
      
    });
    
  }
  
}());