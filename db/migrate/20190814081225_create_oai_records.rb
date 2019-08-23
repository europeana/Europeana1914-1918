class CreateOaiRecords < ActiveRecord::Migration
  class OAIRecord < ActiveRecord::Base
    belongs_to :metadata_mapping
  end
  class MetadataMapping < ActiveRecord::Base
    has_one :oai_record
  end

  def change
    create_table :oai_records do |t|
      t.references :metadata_mapping
      t.string :identifier, :null => false
      t.string :metadata_prefix, :null => false
      t.timestamps
    end
    add_index :oai_records, :identifier
    add_index :oai_records, :metadata_prefix
    add_index :oai_records, :metadata_mapping_id
  end
end
