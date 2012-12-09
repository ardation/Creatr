class ChangeCssColumnInThemes < ActiveRecord::Migration
  def self.up
    drop_attached_file :themes, :css
    add_column :content_types, :css, :text
  end

  def self.down
    change_table :themes do |t|
      t.has_attached_file :css
    end
  end
end
