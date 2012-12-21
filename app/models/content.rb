class Content < ActiveRecord::Base
  attr_accessible :data, :position, :content_type_id, :name
  belongs_to :content_type
  belongs_to :campaign
  validates_presence_of :content_type, :position, :data, :name

  def data=(data)
    write_attribute(:data, data.to_json)
  end
end
