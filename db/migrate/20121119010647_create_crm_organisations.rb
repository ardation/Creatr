class CreateCrmOrganisations < ActiveRecord::Migration
  def up
    create_table :crm_organisations do |t|
      t.integer :organisation_id
      t.integer :crm_id

      t.timestamps
    end
  end

  def down
    drop_table :crm_organisations
  end
end
