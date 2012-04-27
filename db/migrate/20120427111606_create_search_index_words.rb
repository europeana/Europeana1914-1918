class CreateSearchIndexWords < ActiveRecord::Migration
  def self.up
    create_table :search_index_words do |t|
      t.string :text
    end
    add_index :search_index_words, :text, :unique => true
  end

  def self.down
    drop_table :search_index_words
  end
end
