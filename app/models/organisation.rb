class Organisation < ActiveRecord::Base

  has_many :surveys

  validates_presence_of :name

  has_one :crm

  attr_accessible :name

  #has_many :member_organisations
  #has_many :members, through: :member_organisations

  delegate :crms, to: :member, prefix: true
end
