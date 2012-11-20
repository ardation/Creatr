class AddAttachmentDefaultTemplateToContentTypes < ActiveRecord::Migration
  def self.up
    change_table :content_types do |t|
      t.has_attached_file :default_template
    end
  end

  def self.down
    drop_attached_file :content_types, :default_template
  end
end
