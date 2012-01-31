class DefaultMetadataFieldsToEnglishTranslation < ActiveRecord::Migration
  def self.up
    MetadataField.connection.select_all("SELECT mf.id, mf.hint, mf.title, tr.hint en_hint, tr.title en_title FROM metadata_fields mf INNER JOIN metadata_field_translations tr ON mf.id=tr.metadata_field_id WHERE tr.locale='en'").each do |row|
      mf = MetadataField.find(row['id'])
      if mf
        mf.update_attributes(:hint => row['en_hint'], :title => row['en_title'])
      end
    end
  end

  def self.down
  end
end
