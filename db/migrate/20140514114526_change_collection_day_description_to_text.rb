class ChangeCollectionDayDescriptionToText < ActiveRecord::Migration
  def up
    change_column :collection_days, :description, :text
  end

  def down
    change_column :collection_days, :description, :string
  end
end
