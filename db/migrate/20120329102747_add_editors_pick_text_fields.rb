class AddEditorsPickTextFields < ActiveRecord::Migration
  class MetadataField < ActiveRecord::Base; end

  def self.up
    position = MetadataField.find_by_name('editor_pick').position
    MetadataField.update_all('position=position+2', [ 'position > ?', position ])
  
    say "Adding editor's pick text field"
    MetadataField.create!(:name => 'editor_pick_text', 
      :field_type => 'text', :contribution => true, :attachment => false, 
      :required => false, :cataloguing => true, :searchable => false,
      :title => "Editor's pick text", :position => position + 1)
      
    say "Adding editor's pick signature field"
    MetadataField.create!(:name => 'editor_pick_sig', 
      :field_type => 'string', :contribution => true, :attachment => false, 
      :required => false, :cataloguing => true, :searchable => false,
      :title => "Editor's pick signature", :position => position + 2)
  end

  def self.down
    say "Removing editor's pick text field"
    MetadataField.find_by_name('editor_pick_text').destroy
    
    say "Removing editor's pick signature field"
    MetadataField.find_by_name('editor_pick_sig').destroy
    
    position = MetadataField.find_by_name('editor_pick').position
    MetadataField.update_all('position=position-2', [ 'position > ?', position ])
  end
end
