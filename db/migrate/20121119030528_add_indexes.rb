class AddIndexes < ActiveRecord::Migration
  def change
    rename_column :organisations, :crm_id, :crm
    add_index :organisations, :crm
  end
end
