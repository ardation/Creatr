class AddMobileIndexOnPeople < ActiveRecord::Migration
  def change
    add_index :people, [:mobile, :campaign_id], unique: true
  end
end
