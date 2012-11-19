class RenameCrmsToCrm < ActiveRecord::Migration
  def up
    rename_table :crms, :crm
  end

  def down
    rename_table :crm, :crms
  end
end
