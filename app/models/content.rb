class Content < ActiveRecord::Base
  attr_accessible :data, :position
  belongs_to :content_type
  belongs_to :survey
  validates_presence_of :survey, :content_type, :position
end
