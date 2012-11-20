class AddDesscriptorsToThemes < ActiveRecord::Migration
  def change
    add_column :themes, :title, :string
    add_column :themes, :description, :text
    add_column :themes, :featured, :boolean, :default => false
    add_column :themes, :featured_at, :timestamp
    add_column :themes, :published, :boolean, :default => false
    add_column :themes, :published_at, :timestamp
    add_column :themes, :request_to_publish, :boolean, :default => false
  end
end
