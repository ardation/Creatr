class AddOwnerIdToThemes < ActiveRecord::Migration
  def change
    add_column :themes, :owner_id, :integer
  end
end
