class DeleteCrmOrganisations < ActiveRecord::Migration
  def change 
    drop_table :crm_organisations
  end
end
