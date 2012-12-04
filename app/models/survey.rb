class Survey < ActiveRecord::Base
  has_many :permissions
  has_many :members, through: :permissions
  has_many :contents
  attr_accessible :name
end