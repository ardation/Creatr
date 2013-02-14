class AddForeignIdToPeople < ActiveRecord::Migration
  def change
    add_column :people, :foreign_id, :integer
  end
end
