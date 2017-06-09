class CreateMetadataMappings < ActiveRecord::Migration
  def change
    create_table :metadata_mappings do |t|
      t.references :mappable, :polymorphic => true
      t.string :format
      t.text :content, :limit => 16.megabytes - 1
      t.timestamps
    end
    add_index :metadata_mappings, [:mappable_id, :mappable_type]
  end
end
