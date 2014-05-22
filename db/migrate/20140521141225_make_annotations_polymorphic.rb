class MakeAnnotationsPolymorphic < ActiveRecord::Migration
  def change
    add_column :annotations, :src, :string
    add_column :annotations, :annotatable_type, :text
    rename_column :annotations, :attachment_id, :annotatable_id
  end
end
