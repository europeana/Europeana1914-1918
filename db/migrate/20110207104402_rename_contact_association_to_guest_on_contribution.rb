class RenameContactAssociationToGuestOnContribution < ActiveRecord::Migration
  def self.up
    rename_column :contributions, :contact_id, :guest_id
  end

  def self.down
    rename_column :contributions, :guest_id, :contact_id
  end
end
