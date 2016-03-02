class FixColumnTypes < ActiveRecord::Migration
  def up
    remove_column :member_crms, :member_id
    remove_column :member_crms, :crm_id

    add_column :member_crms, :member_id, :integer
    add_column :member_crms, :crm_id, :integer
  end

  def down
  end
end
