class RemoveAttributesAndAddContentFromTemplate < ActiveRecord::Migration
  def up
    drop_attached_file :templates, :hamlbars
    add_column :templates, :content, :text
  end

  def down
    remove_column :templates, :content
    change_table :templates do |t|
      t.has_attached_file :hamlbars
    end
  end
end
