class AddCampaignCodeToCampaigns < ActiveRecord::Migration
  def change
    add_column :campaigns, :campaign_code, :integer
    add_index :campaigns, :campaign_code
  end
end
