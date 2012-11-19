class AddSurveyIdToOrganisations < ActiveRecord::Migration
  def change
    add_column :surveys, :organisation_id, :integer
    rename_column :organisations, :crm, :crm_id
    remove_column :surveys, :permissions_id
  end
end
