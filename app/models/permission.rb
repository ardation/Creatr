class Permission < ActiveRecord::Base 
  belongs_to :survey
  belongs_to :member

  attr_accessible :member_id

end