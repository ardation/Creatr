class AddAttachmentMainImageToThemes < ActiveRecord::Migration
  def self.up
    change_table :themes do |t|
      t.has_attached_file :main_image
    end
  end

  def self.down
    drop_attached_file :themes, :main_image
  end
end
