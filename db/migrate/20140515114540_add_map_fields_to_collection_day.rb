class AddMapFieldsToCollectionDay < ActiveRecord::Migration
  def change
    add_column :collection_days, :map_latlng, :string
    add_column :collection_days, :map_zoom, :integer
  end
end
