class CampaignCounter < ActiveRecord::Base
  attr_accessible :campaign, :count, :date
  belongs_to :campaign

  def increment
    if self.count.blank?
      self.count = 1
    else
      self.count = self.count + 1
    end
    self.save!
  end
end
