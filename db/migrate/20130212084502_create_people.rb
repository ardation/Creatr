class CreatePeople < ActiveRecord::Migration
  def change
    create_table :people do |t|
      t.string :first_name
      t.string :last_name
      t.integer :phone
      t.integer :facebook_id
      t.string :facebook_access_token
      t.integer :sms_token

      t.timestamps
    end
  end
end
