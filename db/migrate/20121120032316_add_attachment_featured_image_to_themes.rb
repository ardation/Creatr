class AddAttachmentFeaturedImageToThemes < ActiveRecord::Migration
  def self.up
    change_table :themes do |t|
      t.has_attached_file :featured_image
    end
  end

  def self.down
    drop_attached_file :themes, :featured_image
  end
end
