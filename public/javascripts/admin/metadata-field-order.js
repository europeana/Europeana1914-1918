$(function() {
  // Enable drag-and-drop sorting of fields
  $("#metadata-fields").sortable({
    placeholder: 'ui-sortable-placeholder',
  	update: function(event, ui) { $("#metadata-fields li").each(function(index) { $('input[type=hidden]', this).attr('value', index + 1) }); }
  });
  // Replace text input fields with equivalent hidden fields
  $("#metadata-fields li input[type=text]").replaceWith(function() {
    return $('<input type="hidden">').attr('name', $(this).attr('name')).attr('value', $(this).attr('value')).attr('id', $(this).attr('id'));
  });
  $("#metadata-fields li, #metadata-fields li label").css('cursor', 'move');
  $('p.instructions').text(I18n.t('javascripts.admin.metadata_fields.order'));
});
