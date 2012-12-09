class RemoveFeaturedAttachmentColumnsFromThemes < ActiveRecord::Migration
  def self.up
    drop_attached_file :themes, :featured_image
  end

  def self.down
    change_table :themes do |t|
      t.has_attached_file :featured_image
    end
  end
end
