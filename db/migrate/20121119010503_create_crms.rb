class CreateCrms < ActiveRecord::Migration
  def up
    create_table :crms do |t|
      t.string :name
    end
  end

  def down
    drop_table :crms
  end
end
