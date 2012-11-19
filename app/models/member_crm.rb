class MemberCrm < ActiveRecord::Base
  belongs_to :member
  belongs_to :crm

  attr_accessible :api_secret
end