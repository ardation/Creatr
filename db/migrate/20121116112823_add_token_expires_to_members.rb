class AddTokenExpiresToMembers < ActiveRecord::Migration
  def change
    add_column :members, :tokenExpires, :datetime
  end
end
