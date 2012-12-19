class Content < ActiveRecord::Base
  attr_accessible :data, :position
  belongs_to :content_type
  belongs_to :campaign
  validates_presence_of :campaign, :content_type, :position, :data
end
