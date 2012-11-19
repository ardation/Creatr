class CreateTableSurveyPermissions < ActiveRecord::Migration
  def up
    create_table :surveys do |t|
      t.string :name
      t.integer :permissions_id
    end
  end

  def down
    drop_table :surveys
  end
end
