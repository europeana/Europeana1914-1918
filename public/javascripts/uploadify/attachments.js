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
    jQuery('#attachment_file_input').after(uploadifyHtml);
    $('#uploadify_file').uploadify(options);
    
  }
  
  function init() {
    
    
  }
  
});
