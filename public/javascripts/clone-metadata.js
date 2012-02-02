$(document).ready(function(){
  if (RunCoCo.contribution) {
    
    var cloneButtonHtml = '<label></label><input type="button" value="' + I18n.t('javascripts.digital_object.links.copy_from_story') + '" />' + '<p class="inline-hints">' + I18n.t('javascripts.digital_object.hints.copy_from_story') + '</p>',
        cloneButton = $( cloneButtonHtml );
    cloneButton.click(function() {
      $('#attachment_title').val(RunCoCo.contribution.title);
      for (var key in RunCoCo.contribution.metadata['metadata_record']) {
        var fieldValue = RunCoCo.contribution.metadata['metadata_record'][key];
        
        // if metadata value is an array, look for individual input elements with ids
        // like 'attachment_metadata_attributes_field_keywords_term_ids_63'
        // and check them
        if(Object.prototype.toString.call(fieldValue) === '[object Array]') {
          $('*[id^="attachment_metadata_attributes_' + key + '_"]').removeAttr('checked');
          for (var i = 0; i < fieldValue.length; i++) {
            $('#attachment_metadata_attributes_' + key + '_' + fieldValue[i]).each(function(index) {
              var fieldType = $(this).attr('type').toLowerCase();
              if (fieldType == 'checkbox') {
                $(this).attr('checked', 'checked');
              } else {
//                alert(fieldType);
              }
            });
          }
        } 
          
        $('#attachment_metadata_attributes_' + key).each(function(index) {
          var fieldTagName = this.tagName.toLowerCase();
          if (fieldTagName == 'input') {
            var fieldType = $(this).attr('type').toLowerCase();
            if (fieldType == 'text') {
              $(this).val(fieldValue);
            } else if (fieldType == 'hidden') {
              $(this).val(fieldValue);
              $(this).change();
            } else { 
//              alert(fieldType); 
            }
          } else if (fieldTagName == 'textarea') {
            $(this).text(fieldValue);
          } else if (fieldTagName == 'select') {
            $('option[value="' + fieldValue + '"]', this).attr('selected', 'selected');
          } else { 
//            alert(fieldTagName + ': ' + fieldValue); 
          }
        });
      }
      return false;
    });
    $('#attachment_file_input').after($('<li></li>').append(cloneButton));
  }
});
