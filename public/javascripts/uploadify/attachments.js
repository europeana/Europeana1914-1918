jQuery(function() {
  
  function addUploadify() {
    
    if ( !swfobject.hasFlashPlayerVersion("9.0.24") ) {
      
      return;
      
    }
    
    if (  (window.location.search.indexOf('?ui=basic') != -1)
          || (window.location.search.indexOf('&ui=basic') != -1) ) {
      
      return;
      
    }
  
    var options = {
        
        uploader:     RunCoCo.relativeUrlRoot + '/javascripts/uploadify/uploadify.swf',
        script:       RunCoCo.uploadify.script,
        multi:        true, 
        cancelImg:    RunCoCo.relativeUrlRoot + '/images/style/icons/cancel.png',
        sizeLimit:    RunCoCo.uploadify.maxUploadSize,
        fileExt:      RunCoCo.uploadify.fileExt,
        fileDesc:     RunCoCo.uploadify.fileDesc,
        fileDataName: 'attachment[file]',
        buttonText:   I18n.t('javascripts.uploadify.button_text'),
        onComplete:   function(event, queueID, fileObj, response, data) { 
          
          var dat = eval('(' + response + ')'); 
          
          if (dat.result == 'error') {
            
            $('.percentage', $("#uploadify_file" + queueID)).text(' - ' + dat.msg);
            $("#attachment_file" + queueID).addClass('uploadifyError');
            
          } else {
            
            $('.percentage', $("#uploadify_file" + queueID)).text(' - ').append($('<strong>' + I18n.t('javascripts.uploadify.saved') + '</strong>'));
            var cancelLink = $('.cancel a', $("#uploadify_file" + queueID));
            cancelLink.attr('href', " ");
            
            cancelLink.bind('click', function() {
              
              $(this).parent().parent().remove();
              return false;
            
            });
            
            $("#uploadify_file" + queueID).addClass('uploadifyComplete');
            
          }
          
          return false;
          
        }
        
      };
    
    //var uploadifyFieldset = $('<fieldset id="uploadify_upload" class="inputs"><ol><li id="uploadify_file_input" class="file input optional"><label class=" label" for="uploadify_file"></label></li></ol></fieldset>');
    var uploadifyHtml = jQuery(
        '<li id="uploadify_upload" class="inputs">' +
          //'<ol>' +
            '<div id="uploadify_file_input" class="file input optional">' +
              '<label class=" label" for="uploadify_file">' + I18n.t('javascripts.uploadify.label') + '</label>' +
            '</div>' +
          //'</ol>' +
        '</li>'
      ),
      uploadifyFileControl = $('#attachment_file').clone().attr('id', 'uploadify_file'),
      uploadifyHint = $('<p class="inline-hints">' + I18n.t('javascripts.uploadify.hint') + '</p>'),
      uploadifySubmit = $('#attachment_submit').clone().attr('id', 'uploadify_submit');
    
    //$('label', uploadifyHtml).text($('label[for="attachment_file"]').text());
    jQuery('div', uploadifyHtml).append(uploadifyFileControl).append(uploadifyHint);
    uploadifySubmit.click(function(event) { 
      event.preventDefault();
  
      if ($('#uploadify_fileQueue .uploadifyQueueItem').length == 0) {
        return;
      }
  
      var scriptData = {
        uploadify: '1',
        format: 'json'
      };
      // Add auth tokens to scriptData
      scriptData[RunCoCo.sessionKeyName] = encodeURIComponent(RunCoCo.sessionKey);
      scriptData['authenticity_token'] = encodeURIComponent(RunCoCo.authenticityToken);
      $('#uploadify_file').uploadifySettings('scriptData', scriptData);
      
      setTimeout(function() {
        $('#uploadify_file').uploadifyUpload();
      }, 100);
      
    });
    $('li', uploadifyHtml).append(uploadifySubmit);
    //$('#attachment_upload').before(uploadifyHtml);
    jQuery('#attachment_file_input').html(uploadifyHtml);
    $('#uploadify_file').uploadify(options);
    
  }
  
  function init() {
    
    $fieldsets = jQuery('fieldset');
    $single_upload = jQuery('#attachment_file_input').html();
    $attachment_help_links = jQuery('#attachment-help a');
    
    function openFieldset( id ) {
      
      if ( jQuery(id).hasClass('collapsed') ) {
        
        jQuery(id,'legend').trigger('click');
        
      }
      
    }
    
    function adjustFieldsets( section ) {
      
      $fieldsets.each(function() {
        
        var $elm = jQuery(this);
        
        switch ( section ) {
          
          case 'submit' :
            
            if ( 'submit' === $elm.attr('id') && $elm.is(':hidden') ) {
              
              $elm.fadeIn();
              
            } else if ( $elm.is(':visible') ) {
              
              $elm.fadeOut();
              
            }
            
            openFieldset('#submit');
            
            break;
          
          
          default :
          
            if ( 'attachment_upload' === $elm.attr('id') && $elm.is(':hidden') ) {
              
              $elm.fadeIn();
              
            }
            
            if ( 'single' === section && $elm.is(':hidden') ) {
          
              $elm.fadeIn();
              
            } else if ( 'multiple' === section && $elm.is(':visible') ) {
              
              $elm.fadeOut();
              
            }
            
            openFieldset('#attachment_upload');
            
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
      jQuery('#attachment_file_input').html( $single_upload );
      highlightClick( jQuery(this).attr('id') );
      adjustFieldsets('single');
      
    });
    
    jQuery('#multiple-items').click(function(evt) {
      
      evt.preventDefault();
      highlightClick( jQuery(this).attr('id') );
      addUploadify();
      adjustFieldsets('multiple');
      
    });
    
    jQuery('#submit-story').click(function(evt) {
      
      evt.preventDefault();
      highlightClick( jQuery(this).attr('id') );
      adjustFieldsets('submit');
      
    });
    
    
    setTimeout( function() {
        if ( !RunCoCo.ready_to_submit ) {
        
          if ( RunCoCo.cataloguer ) {
            
            jQuery('#multiple-items').trigger('click');
            
          } else {
            
            jQuery('#single-item').trigger('click');
            
          }
          
        } else {
          
          jQuery('#submit-story').trigger('click');
          
        }
      
      },
      50
    );
    
  }
  
  init();
  
});
