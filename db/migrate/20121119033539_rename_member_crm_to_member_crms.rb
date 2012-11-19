class RenameMemberCrmToMemberCrms < ActiveRecord::Migration
  def up
    rename_table :member_crm, :member_crms
  end

  def down
  end
end
