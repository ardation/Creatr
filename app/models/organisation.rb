class Organisation < ActiveRecord::Base

  has_many :surveys

  validates_presence_of :name, :uid

  has_one :crm

  attr_accessible :name, :uid

  has_many :member_organisations
  has_many :members, through: :member_organisations
end
