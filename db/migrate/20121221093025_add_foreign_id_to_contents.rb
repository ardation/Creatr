class AddForeignIdToContents < ActiveRecord::Migration
  def change
    add_column :contents, :foreign_id, :integer
  end
end
