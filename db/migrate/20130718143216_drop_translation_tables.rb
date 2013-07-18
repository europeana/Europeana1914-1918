# metadata_field_translations and taxonomy_term_translations tables are
# redundant since switch to localeapp.com for localization management.
class DropTranslationTables < ActiveRecord::Migration
  def self.up
    drop_table :metadata_field_translations
    drop_table :taxonomy_term_translations
  end

  def self.down
    create_table "metadata_field_translations", :force => true do |t|
      t.integer  "metadata_field_id"
      t.string   "locale"
      t.text     "hint"
      t.string   "title"
      t.datetime "created_at"
      t.datetime "updated_at"
    end

    add_index "metadata_field_translations", ["metadata_field_id"]
    
    create_table "taxonomy_term_translations", :force => true do |t|
      t.integer  "taxonomy_term_id"
      t.string   "locale"
      t.string   "term"
      t.datetime "created_at"
      t.datetime "updated_at"
    end

    add_index "taxonomy_term_translations", ["taxonomy_term_id"]
  end
end
