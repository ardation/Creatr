class ChangeFbidToBigIntOnPeople < ActiveRecord::Migration
  def self.up
   change_column :people, :facebook_id, :bigint
  end

  def self.down
   change_column :people, :facebook_id, :integer
  end
end
