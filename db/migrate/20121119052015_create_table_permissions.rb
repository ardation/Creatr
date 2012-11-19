class CreateTablePermissions < ActiveRecord::Migration
  def up
    create_table :permissions do |t|
      t.integer :survey_id
      t.integer :member_id
    end
  end

  def down
    drop_table :permissions
  end
end
