class AddTimestampsToSearchIndexWord < ActiveRecord::Migration
  class SearchIndexWord < ActiveRecord::Base; end
  
  def self.up
    add_column "search_index_words", "created_at", :datetime
    add_column "search_index_words", "updated_at", :datetime
    
    timestamp = Time.zone.now
    SearchIndexWord.update_all(:created_at => timestamp, :updated_at => timestamp)
  end

  def self.down
    remove_column "search_index_words", "created_at"
    remove_column "search_index_words", "updated_at"
  end
end
