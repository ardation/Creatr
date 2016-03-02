class AddIsPublishedColumnToContentTypes < ActiveRecord::Migration
  def change
    add_column :content_types, :is_published, :boolean, default: false
  end
end
