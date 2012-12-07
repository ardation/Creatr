class AddPlatformColumnsToThemes < ActiveRecord::Migration
  def change
    add_column :themes, :mobile, :boolean, :default => true
    add_column :themes, :tablet, :boolean, :default => true
    add_column :themes, :laptop, :boolean, :default => true
    add_column :themes, :desktop, :boolean, :default => true
  end
end
