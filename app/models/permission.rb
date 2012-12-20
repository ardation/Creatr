class Permission < ActiveRecord::Base
  belongs_to :campaign
  belongs_to :member

  attr_accessible :campaign, :member

end
