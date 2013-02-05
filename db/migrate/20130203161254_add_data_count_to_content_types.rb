class AddDataCountToContentTypes < ActiveRecord::Migration
  def up
    add_column :content_types, :data_count, :integer
  end
  def down
    remove_column :content_types, :data_count
  end
end
