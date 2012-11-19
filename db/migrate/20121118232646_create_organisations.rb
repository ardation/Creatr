class CreateOrganisations < ActiveRecord::Migration
  def up
    create_table :organisations do |t|
      t.string :name
      t.integer :id
  	end
    add_index(:organisations, :id, :unique => true)
  end
  def down
    drop_table :organisations
  end
end
