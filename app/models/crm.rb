class Crm < ActiveRecord::Base
  attr_accessible :name
  
  has_many :organisations

  has_many :member_crms
  has_many :members, :through => :member_crms

end
