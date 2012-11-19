class Organisation < ActiveRecord::Base

  has_many :surveys

  validates_presence_of :name, :uid

  has_one :crm

  attr_accessible :name, :uid
end
