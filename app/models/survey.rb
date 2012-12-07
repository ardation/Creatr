class Survey < ActiveRecord::Base
  has_many :permissions
  has_many :members, through: :permissions
  has_many :contents
  belongs_to :theme
  attr_accessible :name, :contents
end
