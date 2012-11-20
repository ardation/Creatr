class DropTableOrganisationsMembers < ActiveRecord::Migration
  def up
    drop_table :member_organisations
  end

  def down
  end
end
