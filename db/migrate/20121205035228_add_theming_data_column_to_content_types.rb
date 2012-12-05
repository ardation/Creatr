class AddThemingDataColumnToContentTypes < ActiveRecord::Migration
  def change
    add_column :content_types, :theming_data, :text
  end
end
