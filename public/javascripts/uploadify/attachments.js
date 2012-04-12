(function() {
  
  'use strict';
  
  
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
        fileDataName: 'attachment_file',
        buttonText:   I18n.t('javascripts.uploadify.button_text'),
        onComplete:   function(event, queueID, fileObj, response, data) { 
          var dat = eval('(' + response + ')'); 
          
          if (dat.result == 'error') {

            var queueDiv = jQuery("#uploadify_file" + queueID);
            jQuery('.percentage', queueDiv).text(' - ' + dat.msg);
            queueDiv.addClass('uploadifyError');
            
          } else {
            
            jQuery('.percentage', jQuery("#uploadify_file" + queueID)).text(' - ').append(jQuery('<strong>' + I18n.t('javascripts.uploadify.saved') + '</strong>'));
            var cancelLink = jQuery('.cancel a', jQuery("#uploadify_file" + queueID));
            cancelLink.attr('href', " ");
            
            cancelLink.bind('click', function() {
              
              jQuery(this).parent().parent().remove();
              return false;
            
            });
            
            jQuery("#uploadify_file" + queueID).addClass('uploadifyComplete');
            
          }
          
          return false;
          
        },
        onAllComplete: function( event, data ) {
          jQuery('#ajax-message').hide();
          
          // Can not just check size of data.errors as Uploadify does not
          // detect HTTP 400 status code as an error.
          if (jQuery('.uploadifyError').size() == 0) {
            window.location = window.location.href;
          }
          
        },
//        onError: function (event, queueID, fileObj, errorObj) {
//          alert(errorObj.type + ' Error: ' + errorObj.info);
//          var queueDiv = jQuery("#uploadify_file" + queueID);
//          jQuery('.percentage', queueDiv).text(' - ' + dat.msg);
//          queueDiv.addClass('uploadifyError');
//        }
        
      };
    
    var li_style = ( !RunCoCo.cataloguer ) ? 'style="display:none;"' : '',
        uploadifyHtml = jQuery(
      '<li id="uploadify_upload" class="inputs"' + li_style + '>' +
        '<div id="uploadify_file_input" class="file input optional">' +
        '<label class=" label" for="uploadify_file">' + I18n.t('javascripts.uploadify.label') + '</label>' +
        '</div>' +
      '</li>'
      ),
    ajax_loader_html = '<div id="ajax-message"><img src="/images/europeana-theme/progress_bar/loading_animation.gif" height="32" width="32" alt="loading animation" /></div>',
    uploadifyFileControl = jQuery('#attachment_file').clone().attr('id', 'uploadify_file'),
    uploadifyHint = jQuery('<p class="inline-hints">' + I18n.t('javascripts.uploadify.hint', { types: RunCoCo.uploadify.fileDesc, size: RunCoCo.uploadify.maxUploadSize }) + '</p>'),
    uploadifySubmit = jQuery('#attachment_submit').clone().attr('id', 'uploadify_submit');
    
    
    jQuery('div', uploadifyHtml).append(uploadifyFileControl).append(uploadifyHint);
    jQuery('#attachment-help').after( ajax_loader_html );
  
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
      
      var attachmentMetadata = { };
      
      // Add metadata from form to scriptData
      jQuery("[name^='attachment\[metadata_attributes\]\[']").each(function() {
          
        var re = /\[([^\]]+)\](\[\])?$/;
        var result = re.exec(jQuery(this).attr('name'));
        var fieldName = result[1];
        var isArrayField = (result[2] == '[]');
        
        var fieldTagName = this.tagName.toLowerCase();
        var fieldValue = null;
        
        if (fieldTagName == 'input') {
          var fieldType = jQuery(this).attr('type').toLowerCase();
          if (fieldType == 'text') {
            fieldValue = jQuery(this).val();
          } else if (fieldType == 'hidden') {
            fieldValue = jQuery(this).val();
          } else if (fieldType == 'checkbox') {
            if (jQuery(this).is(":checked")) {
              fieldValue = jQuery(this).val();
            }
          } else {
            alert('input[type="' + fieldType + '"]'); 
          }
        } else if (fieldTagName == 'textarea') {
          fieldValue = jQuery(this).val();
        } else if (fieldTagName == 'select') {
          fieldValue = jQuery('option', this).filter(':selected').val();
        } else { 
          alert(fieldTagName); 
        }
        
        if (fieldValue !== null) {
          if (isArrayField) {
            if (!attachmentMetadata[fieldName]) {
              attachmentMetadata[fieldName] = new Array();
            }
            attachmentMetadata[fieldName].push(fieldValue);
          } else {
            attachmentMetadata[fieldName] = fieldValue;
          }
        }
      });
      
      var attachmentParams = {
        title: jQuery('#attachment_title').val(),
        metadata_attributes: attachmentMetadata
      };

      scriptData['attachment'] = encodeURIComponent(JSON.stringify(attachmentParams));
      
      jQuery('#uploadify_file').uploadifySettings('scriptData', scriptData);
      
      jQuery('#ajax-message').show();
    
      setTimeout(function() {
        jQuery('#uploadify_file').uploadifyUpload();
      }, 100);
      
    });
    
    jQuery(uploadifyHtml).append(uploadifySubmit);
    jQuery('#attachment_upload ol').append(uploadifyHtml);
    jQuery('#uploadify_file').uploadify(options);
    
    uploadify_added = true;
    
  }
  
  addUploadify();
  
}());
