class Survey < ActiveRecord::Base
  has_many :permissions
  has_many :members, through: :permissions
  attr_accessible :name


end