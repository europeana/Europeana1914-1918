(function() {
  
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
    
    var li_style = ( !RunCoCo.ready_for_submit && !RunCoCo.cataloguer ) ? 'style="display:none;"' : '',
        uploadifyHtml = jQuery(
        '<li id="uploadify_upload" class="inputs"' + li_style + '>' +
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
  
  addUploadify();
  
}());
