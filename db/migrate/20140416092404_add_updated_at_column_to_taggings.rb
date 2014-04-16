class AddUpdatedAtColumnToTaggings < ActiveRecord::Migration
  
  def up
    add_column :taggings, :updated_at, :datetime
    
    execute <<-SQL
      UPDATE taggings SET updated_at=created_at
    SQL
  end

  def down
    remove_column :taggings, :updated_at
  end
end
