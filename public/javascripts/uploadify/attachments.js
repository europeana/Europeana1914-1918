jQuery(function() {
  
  var uploadify_added = false;
  
  function addUploadify() {
    
    if ( uploadify_added
          || !swfobject.hasFlashPlayerVersion("9.0.24")
          || (window.location.search.indexOf('?ui=basic') != -1)
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

            var queueDiv = jQuery("#uploadify_file" + queueID);
            $('.percentage', queueDiv).text(' - ' + dat.msg);
            queueDiv.addClass('uploadifyError');
            
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
          
        },
        onAllComplete: function( event, data ) {
          
          if ( 0 === data.errors ) {
            window.location = window.location.href;
          }
          
        }
        
      };
    
    var uploadifyHtml = jQuery(
        '<li id="uploadify_upload" class="inputs" style="display:none;">' +
          '<div id="uploadify_file_input" class="file input optional">' +
            '<label class=" label" for="uploadify_file">' + I18n.t('javascripts.uploadify.label') + '</label>' +
          '</div>' +
        '</li>'
      ),
      uploadifyFileControl = $('#attachment_file').clone().attr('id', 'uploadify_file'),
      uploadifyHint = $('<p class="inline-hints">' + I18n.t('javascripts.uploadify.hint', { types: RunCoCo.uploadify.fileDesc, size: RunCoCo.uploadify.maxUploadSize }) + '</p>'),
      uploadifySubmit = $('#attachment_submit').clone().attr('id', 'uploadify_submit');
    
    
    jQuery('div', uploadifyHtml).append(uploadifyFileControl).append(uploadifyHint);
    
    uploadifySubmit.click(function(evt) {
      
      evt.preventDefault();
      
      if ( jQuery('#uploadify_fileQueue .uploadifyQueueItem').length == 0 ) {
        
        return;
        
      }
  
      var scriptData = {
        uploadify: '1',
        format: 'json'
      };
      
      // Add auth tokens to scriptData
      scriptData[RunCoCo.sessionKeyName] = encodeURIComponent(RunCoCo.sessionKey);
      scriptData['authenticity_token'] = encodeURIComponent(RunCoCo.authenticityToken);
      jQuery('#uploadify_file').uploadifySettings('scriptData', scriptData);
      
      setTimeout(function() {
        jQuery('#uploadify_file').uploadifyUpload();
      }, 100);
      
    });
    
    jQuery(uploadifyHtml).append(uploadifySubmit);
    jQuery('#attachment_upload ol').append(uploadifyHtml);
    jQuery('#uploadify_file').uploadify(options);
    
    uploadify_added = true;
    
  }
  
  function init() {
    
    addUploadify();
    
    var $fieldsets = jQuery('fieldset'),
        $attachment_help_links = jQuery('#attachment-help a');
    
    
    function openFieldset( id ) {
      
      if ( jQuery(id).hasClass('collapsed') ) {        
        jQuery(id + ' legend').trigger('click');        
      }
      
    }
    
    function adjustFieldsets( type, callback ) {
      
      $fieldsets.each(function() {
        
        var $elm = jQuery(this);
        
        if ( 'submit' === type ) {
          
          if ( 'submit' === $elm.attr('id') ) {          
            if ( $elm.is(':hidden') ) {            
              $elm.toggle('height');              
            }            
          } else if ( $elm.is(':visible') ) {            
            $elm.toggle('height');            
          }
          
          //openFieldset('#submit');
          
        } else if ( 'single' === type || 'multiple' === type )  {
          
          if ( 'attachment_upload' === $elm.attr('id') ) {            
            if ( $elm.is(':hidden') ) {           
              $elm.toggle('height');
            }            
          } else if ( 'submit' === $elm.attr('id') ) {    
            if ( $elm.is(':visible') ) {              
              $elm.toggle('height');              
            }            
          } else if ( 'single' === type && $elm.is(':hidden') ) {        
            $elm.toggle('height');
          } else if ( 'multiple' === type && $elm.is(':visible') ) {            
            $elm.toggle('height');
          }
          
          //openFieldset('#attachment_upload');
          
        }
        
      });
      
      if ( callback ) {
        setTimeout( function() { callback(); }, 300 );
      }
      
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
      openFieldset('#attachment_upload');
      jQuery('#attachment_file_input').show();
      jQuery('#uploadify_upload').hide();
      adjustFieldsets('single');
      
    });
    
    jQuery('#multiple-items').click(function(evt) {
      
      evt.preventDefault();
      highlightClick( jQuery(this).attr('id') );
      openFieldset('#attachment_upload');
      jQuery('#attachment_file_input').hide();
      jQuery('#uploadify_upload').show();
      adjustFieldsets('multiple');
      
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
  
  init();
  
});
