class CreateMemberCrms < ActiveRecord::Migration
  def up
    create_table :member_crm do |t|
      t.string :member_id
      t.string :crm_id
    end
  end

  def down
    drop_table :member_crm
  end
end
