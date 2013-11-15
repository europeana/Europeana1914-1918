(function() {

  'use strict';
  
  jQuery("fieldset.collapsible").collapse();
  jQuery("fieldset.collapsed").collapse( { closed: true } );
  
  RunCoCo.languageOther.init();
  RunCoCo.fieldsetButtons.init();
  RunCoCo.uploadify.init();
  
  jQuery("table.attachments td.pending").each(function() {
    var thumnailTableCell = this;
    jQuery(this).text('').append(jQuery('<img src="/images/europeana-theme/progress_bar/loading_animation.gif" height="32" width="32" alt="" />'));
    var contributionId = jQuery(this).data('contribution-id');
    var attachmentId = jQuery(this).data('attachment-id');
    var url = RunCoCo.relativeUrlRoot + '/contributions/' + contributionId + '/attachments/' + attachmentId + '/uploaded.json';
    
    function runCheck() {
      jQuery.ajax({
        type: "GET",
        url: url, 
        beforeSend: function(xhr) {
          xhr.setRequestHeader("X-CSRF-Token", jQuery('meta[name="csrf-token"]').attr('content'));
        },
        success: function(response) {
          if (response.uploaded == true) {
            jQuery(thumnailTableCell).children().remove();
            jQuery(thumnailTableCell).append(jQuery(response.thumbnailLink));
            jQuery(thumnailTableCell).siblings(':eq(4)').append(jQuery(response.downloadLink));
          } else {
            window.setTimeout(runCheck, 5000);
          }
        }
      });
    }
    
    runCheck();
  });
  
}());
