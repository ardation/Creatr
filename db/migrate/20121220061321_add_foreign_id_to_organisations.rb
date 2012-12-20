class AddForeignIdToOrganisations < ActiveRecord::Migration
  def change
    add_column :organisations, :foreign_id, :integer
  end
end
