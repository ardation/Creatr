class Permission < ActiveRecord::Base 
  has_one :survey
  has_one :member
  belongs_to :member

  attr_accessible :member_id

end