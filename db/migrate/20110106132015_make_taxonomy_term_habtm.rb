class MakeTaxonomyTermHabtm < ActiveRecord::Migration
  def self.up
    # Create HABTM join table
    create_table :metadata_records_taxonomy_terms, :id => false do |t|
      t.integer :metadata_record_id
      t.integer :taxonomy_term_id
    end
    
    MetadataField.where('field_type = ?', 'taxonomy').each do |field|
      column_name = MetadataRecord.column_name(field.name)
      
      # Migrate taxonomy term data to HABTM join table
      execute "INSERT INTO metadata_records_taxonomy_terms (metadata_record_id, taxonomy_term_id)
        SELECT id, #{column_name} FROM metadata_records WHERE #{column_name} IS NOT NULL"
      
      remove_column :metadata_records, column_name
    end
    
    MetadataField.update_all( { :searchable => false }, { :field_type => 'taxonomy' } )
  end

  def self.down
    MetadataField.where('field_type = ?', 'taxonomy').each do |field|
      column_name = MetadataRecord.column_name(field.name)
      add_column :metadata_records, column_name, :integer
      
      result = execute "SELECT mrtt.metadata_record_id, mrtt.taxonomy_term_id FROM metadata_records_taxonomy_terms mrtt LEFT OUTER JOIN taxonomy_terms tt ON mrtt.taxonomy_term_id=tt.id LEFT OUTER JOIN metadata_fields mf ON tt.metadata_field_id=mf.id WHERE mf.name='#{field.name}'"
      result.each do |row|
        execute "UPDATE metadata_records SET #{column_name}='#{row[1]}' WHERE id=#{row[0]}"
      end
    end
  
    drop_table :metadata_records_taxonomy_terms
  end
end
