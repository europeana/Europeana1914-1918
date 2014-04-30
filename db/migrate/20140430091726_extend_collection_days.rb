class ExtendCollectionDays < ActiveRecord::Migration
  def up
    add_column :collection_days, :start_date, :date
    add_column :collection_days, :end_date, :date
    add_column :collection_days, :url, :string
  end

  def down
    remove_column :collection_days, :start_date
    remove_column :collection_days, :end_date
    remove_column :collection_days, :url
  end
end
