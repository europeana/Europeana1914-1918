# contributions.terms column redundant since introduction of users.terms and
# migration of former to latter for existing data.
class RemoveTermsFromContribution < ActiveRecord::Migration
  def self.up
    remove_column :contributions, :terms
  end

  def self.down
    add_column :contributions, :terms, :boolean
  end
end
