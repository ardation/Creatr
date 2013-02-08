class AddCampaignCodeToCampaigns < ActiveRecord::Migration
  def change
    add_column :campaigns, :campaign_code, :integer
    add_index :campaigns, :campaign_code

    Campaign.all.each do |campaign|
      campaign.generate_code
      campaign.save
    end
  end
end
