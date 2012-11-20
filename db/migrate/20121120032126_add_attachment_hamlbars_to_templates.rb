class AddAttachmentHamlbarsToTemplates < ActiveRecord::Migration
  def self.up
    change_table :templates do |t|
      t.has_attached_file :hamlbars
    end
  end

  def self.down
    drop_attached_file :templates, :hamlbars
  end
end
