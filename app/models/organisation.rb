class Organisation < ActiveRecord::Base

  has_many :campaigns

  validates_presence_of :name, :foreign_id

  belongs_to :crm

  attr_accessible :name, :foreign_id

  has_many :member_organisations
  has_many :members, through: :member_organisations
end
