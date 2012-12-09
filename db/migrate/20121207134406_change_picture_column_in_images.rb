class ChangePictureColumnInImages < ActiveRecord::Migration
  def self.up
    drop_attached_file :images, :picture
    add_column :images, :url, :text
  end

  def self.down
    change_table :images do |t|
      t.has_attached_file :picture
    end
  end
end
