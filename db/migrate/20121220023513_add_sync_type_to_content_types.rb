class AddSyncTypeToContentTypes < ActiveRecord::Migration
  def change
    add_column :content_types, :sync_type, :integer, default: 0
  end
end
