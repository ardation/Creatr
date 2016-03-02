class Crm < ActiveRecord::Base
  attr_accessible :name, :id

  has_many :organisations

  has_many :member_crms
  has_many :members, through: :member_crms
end
