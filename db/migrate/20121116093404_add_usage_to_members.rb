class AddUsageToMembers < ActiveRecord::Migration
  def change
    add_column :members, :usage, :text
  end
end
