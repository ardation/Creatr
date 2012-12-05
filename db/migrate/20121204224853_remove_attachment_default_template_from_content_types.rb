class RemoveAttachmentDefaultTemplateFromContentTypes < ActiveRecord::Migration
  def self.up
    drop_attached_file :content_types, :default_template
    add_column :content_types, :default_template, :text
  end

  def self.down
    change_table :content_types do |t|
      t.has_attached_file :default_template
    end
  end
end
