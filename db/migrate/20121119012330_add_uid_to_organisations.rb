class AddUidToOrganisations < ActiveRecord::Migration
  def change
    add_column :organisations, :uid, :integer
    add_column :organisations, :crm_id, :integer
  end
end
