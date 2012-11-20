class CreateMemberOrganisationsS < ActiveRecord::Migration
  def change
    create_table :member_organisations do |t|
      t.integer :member_id
      t.integer :organisation_id
    end
  end

  def down
    drop_table :member_organisations
  end
end
