class AddStopWordFieldToSearchIndexWord < ActiveRecord::Migration
  def self.up
    add_column "search_index_words", "stop_word", :boolean
  end

  def self.down
    remove_column "search_index_words", "stop_word"
  end
end
