class CreateMemberOrganisations < ActiveRecord::Migration
  def up
    create_table :member_organisations do |t|
      t.integer :id
      t.integer :member_id
      t.integer :organisation_id
    end
    add_index(:member_organisations, :id, unique: true)
    add_index(:member_organisations, [:member_id, :organisation_id])
  end

  def down
    drop_table :member_organisations
  end
end
