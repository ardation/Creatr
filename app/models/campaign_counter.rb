class CampaignCounter < ActiveRecord::Base
  attr_accessible :campaign, :count, :date
  belongs_to :campaign

  def increment
    self.count = if count.blank?
                   1
                 else
                   count + 1
                 end
    save!
  end
end
