class Survey < ActiveRecord::Base
  has_many :permissions

  attr_accessible :name

end