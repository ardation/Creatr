class Content < ActiveRecord::Base
  attr_accessible :data, :position, :content_type_id, :name
  belongs_to :content_type
  belongs_to :campaign
  validates_presence_of :campaign, :content_type, :position, :data, :name
end
