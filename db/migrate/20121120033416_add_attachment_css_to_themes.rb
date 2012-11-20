class AddAttachmentCssToThemes < ActiveRecord::Migration
  def self.up
    change_table :themes do |t|
      t.has_attached_file :css
    end
  end

  def self.down
    drop_attached_file :themes, :css
  end
end
