class AddUsageToMembers < ActiveRecord::Migration
  def change
    add_column :members, :usage, :string
  end
end
