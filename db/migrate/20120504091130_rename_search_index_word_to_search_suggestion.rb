class RenameSearchIndexWordToSearchSuggestion < ActiveRecord::Migration
  def self.up
    rename_table "search_index_words", "search_suggestions"
  end

  def self.down
    rename_table "search_suggestions", "search_index_words"
  end
end
