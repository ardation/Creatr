class AddIndexesToMemberCrms < ActiveRecord::Migration
  def change
    add_index :member_crms, :member_id
    add_index :member_crms, :crm_id
  end
end
