class AddOtherLanguageField < ActiveRecord::Migration
  def self.up
    position = MetadataField.find_by_name('lang').position + 1
    MetadataField.create(:field_type => 'string', :name => 'lang_other', :title => 'Language (other)', :cataloguing => false, :contribution => true, :attachment => true, :searchable => false, :required => false, :show_in_listing => false, :position => position)
  end

  def self.down
    MetadataField.find_by_name('lang_other').destroy
  end
end
