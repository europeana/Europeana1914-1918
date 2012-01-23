jQuery().ready(function() { 
  if(!swfobject.hasFlashPlayerVersion("9.0.24")) {
    return;
  }
  
  if ((window.location.search.indexOf('?ui=basic') != -1) || (window.location.search.indexOf('&ui=basic') != -1)) {
    return;
  }

  $('#attachment_file').click(function(event){ 
    event.preventDefault(); 
  });
  
  var finishLink = $('<p><a href="' + $('li.cancel a').attr('href') + '">' + I18n.t('javascripts.uploadify.finished') + '</a></p>').hide();
  $('#attachment_upload').after(finishLink);
  
  var options = { 
    uploader: RunCoCo.relativeUrlRoot + '/javascripts/uploadify/uploadify.swf',
    script: RunCoCo.uploadify.script,
    multi: true, 
    cancelImg: RunCoCo.relativeUrlRoot + '/images/style/icons/cancel.png',
    sizeLimit: RunCoCo.uploadify.maxUploadSize,
    fileExt: RunCoCo.uploadify.fileExt,
    fileDesc: RunCoCo.uploadify.fileDesc,
    fileDataName: 'attachment[file]',
    buttonText: I18n.t('javascripts.uploadify.button_text'),
    onComplete: function(event, queueID, fileObj, response, data) { 
        var dat = eval('(' + response + ')'); 
        
        if (dat.result == 'error') {
          $('.percentage', $("#attachment_file" + queueID)).text(' - ' + dat.msg);
        	$("#attachment_file" + queueID).addClass('uploadifyError');
        } else {
          $('.percentage', $("#attachment_file" + queueID)).text(' - ').append($('<strong>' + I18n.t('javascripts.uploadify.saved') + '</strong>'));
          var cancelLink = $('.cancel a', $("#attachment_file" + queueID));
          cancelLink.attr('href', " ");
          cancelLink.bind('click', function() {
            $(this).parent().parent().remove();
            return false;
          });
          $("#attachment_file" + queueID).addClass('uploadifyComplete');
        }

    	return false; 
    },
    onAllComplete: function(event, data) {
      $('#attachment_fileUploader').hide();
      finishLink.fadeIn();
    }
  };
  
  $('#attachment_file').uploadify(options);
  
  $('#attachment_submit').click(function(event) { 
    event.preventDefault();

    if ($('#attachment_fileQueue .uploadifyQueueItem').length == 0) {
      return;
    }
    
    window.location.hash = '#new_attachment';
    
    $('#metadata').hide();
    $('#cataloguing_metadata').hide();
    $('fieldset.buttons').hide();
    
    var scriptData = {
      uploadify: '1',
      format: 'json'
    };
    // Add auth tokens to scriptData
    scriptData[RunCoCo.sessionKeyName] = encodeURIComponent(RunCoCo.sessionKey);
    scriptData['authenticity_token'] = encodeURIComponent(RunCoCo.authenticityToken);
    // Add title and metadata form elements to scriptData
    $("[name='attachment\[title\]'],[name^='attachment\[metadata_attributes\]\[']").each(function() {
      scriptData[$(this).attr('name')] = encodeURIComponent($(this).val());
    });
    $('#attachment_file').uploadifySettings('scriptData', scriptData);
    
    setTimeout(function() {
      $('#attachment_file').uploadifyUpload();
    }, 100);
    
  }); 
  
  var basicLinkSearch = window.location.search;
  if (basicLinkSearch.length == 0) {
    basicLinkSearch = basicLinkSearch + '?ui=basic';
  } else {
    basicLinkSearch = basicLinkSearch + '&ui=basic';
  }
  var basicLinkHref = window.location.protocol + '//' + window.location.host + window.location.pathname + basicLinkSearch;
  var basicLink = $('<p>' + I18n.t('javascripts.uploadify.basic_ui', { href: basicLinkHref }) + '</p>');
  $('form#new_attachment').after(basicLink);
}); 

