class CampaignCounter < ActiveRecord::Base
  attr_accessible :campaign, :count, :date
  belongs_to :campaign
end
