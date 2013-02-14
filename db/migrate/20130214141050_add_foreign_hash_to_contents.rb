class AddForeignHashToContents < ActiveRecord::Migration
  def change
    add_column :contents, :foreign_hash, :string
  end
end
