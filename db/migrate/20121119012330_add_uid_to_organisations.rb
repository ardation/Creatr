class AddUidToOrganisations < ActiveRecord::Migration
  def change
    remove_column :organisations, :uid
  end
end
