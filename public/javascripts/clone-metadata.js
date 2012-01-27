$(document).ready(function(){
  if (contributionMetadata['metadata_record']) {
    var cloneButton = $('<input type="button" value="Copy from contribution" />');
    cloneButton.click(function() {
      $('#attachment_title').val(contributionTitle);
      for (var key in contributionMetadata['metadata_record']) {
        // if metadata value is an array, look for individual input elements with ids
        // like 'attachment_metadata_attributes_field_keywords_term_ids_63'
        // and check/enable them
      
        var fieldValue = contributionMetadata['metadata_record'][key];
        $('#attachment_metadata_attributes_' + key).each(function(index) {
          var fieldTagName = this.tagName.toLowerCase();
          if (fieldTagName == 'input') {
            var fieldType = $(this).attr('type').toLowerCase();
            if (fieldType == 'text') {
              $(this).val(fieldValue);
            } else { 
              //alert(fieldType); 
            }
          } else if (fieldTagName == 'textarea') {
            $(this).text(fieldValue);
          } else { 
            // alert(fieldTagName + ': ' + fieldValue); 
          }
        });
      }
      return false;
    });
    $('#attachment_file_input').after($('<li></li>').append(cloneButton));
  }
});
