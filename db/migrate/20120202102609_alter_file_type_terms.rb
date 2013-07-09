class AlterFileTypeTerms < ActiveRecord::Migration
  MAP = {
    'Audio' => 'SOUND',
    'Image' => 'IMAGE',
    'Text'  => 'TEXT',
    'Video' => 'VIDEO'
  }

  def self.up
    mf = MetadataField.find_by_name('file_type')
    unless mf.nil?
      MAP.each_pair do |from, to|
        tt = TaxonomyTerm.find_by_metadata_field_id_and_term(mf.id, from)
        unless tt.nil?
          tt.update_attribute(:term, to)
        end
      end
    end
  end

  def self.down
    mf = MetadataField.find_by_name('file_type')
    unless mf.nil?
      MAP.each_pair do |to, from|
        tt = TaxonomyTerm.find_by_metadata_field_id_and_term(mf.id, from)
        unless tt.nil?
          tt.update_attribute(:term, to)
        end
      end
    end
  end
end
