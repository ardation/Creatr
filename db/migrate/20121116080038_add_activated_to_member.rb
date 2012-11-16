class AddActivatedToMember < ActiveRecord::Migration
  def change
    add_column :members, :activated, :boolean, :default => false
  end
end
