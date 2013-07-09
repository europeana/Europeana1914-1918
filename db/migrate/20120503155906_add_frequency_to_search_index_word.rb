class AddFrequencyToSearchIndexWord < ActiveRecord::Migration
  def self.up
    add_column "search_index_words", "frequency", :integer, :default => 0
  end

  def self.down
    remove_column "search_index_words", "frequency"
  end
end
