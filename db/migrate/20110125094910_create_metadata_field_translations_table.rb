class CreateMetadataFieldTranslationsTable < ActiveRecord::Migration
  def self.up
    MetadataField.create_translation_table!( 
      { :title => :string, :hint => :text },
      { :migrate_data => true }
    )
  end

  def self.down
    MetadataField.drop_translation_table! :migrate_data => true
  end
end
