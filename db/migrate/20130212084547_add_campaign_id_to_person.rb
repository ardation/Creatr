class AddCampaignIdToPerson < ActiveRecord::Migration
  def change
    add_column :people, :campaign_id, :integer
  end
end
