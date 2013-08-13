class CreateAnnotoriousTables < ActiveRecord::Migration
  def self.up
    create_table :annotations do |t|
      t.integer :attachment_id
      t.integer :user_id
      t.text :text
      t.timestamps
    end
    add_index :annotations, [ :attachment_id ]
    add_index :annotations, [ :user_id ]
    
    create_table :annotation_shapes do |t|
      t.integer :annotation_id
      t.string :type
      t.string :units, :default => "relative"
      t.text :geometry
      t.timestamps
    end
    add_index :annotation_shapes, [ :annotation_id ]
  end

  def self.down
    drop_table :annotations
    drop_table :annotation_shapes
  end
end
