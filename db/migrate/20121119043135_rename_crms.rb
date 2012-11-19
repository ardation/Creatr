class RenameCrms < ActiveRecord::Migration
  def up
    rename_table :crm, :crms
  end
end
