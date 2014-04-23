class CreateCollectionDays < ActiveRecord::Migration
  def up
    create_table(:collection_days) do |t|
      t.integer "taxonomy_term_id"
      t.string "name"
      t.string "description"
      t.integer "contact_id"
      t.timestamps
    end
    add_index "collection_days", "taxonomy_term_id"
    add_index "collection_days", "contact_id"
  end

  def down
    drop_table "collection_days"
  end
end
