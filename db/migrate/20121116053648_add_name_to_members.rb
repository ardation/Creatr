class AddNameToMembers < ActiveRecord::Migration
  def change
    add_column :members, :name, :string
    add_column :members, :token, :string
  end
end
