class AddCataloguedByToContribution < ActiveRecord::Migration
  def self.up
    add_column "contributions", "catalogued_by", :integer
    add_index "contributions", ["catalogued_by"], :name => "index_contributions_on_catalogued_by"
  end

  def self.down
    remove_index "contributions", :name => "index_contributions_on_catalogued_by"
    remove_column "contributions", "catalogued_by"
  end
end
