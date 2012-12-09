class Image < ActiveRecord::Base
  belongs_to :theme
  validates_presence_of :url
  validates_uniqueness_of :url
  attr_accessible :url
end
