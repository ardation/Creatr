class Organisation < ActiveRecord::Base
  has_many :member_organisations
  has_many :members, through: :member_organisations
end