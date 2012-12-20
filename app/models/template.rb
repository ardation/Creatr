class Template < ActiveRecord::Base
  belongs_to :theme
  belongs_to :content_type
  attr_accessible :content, :content_type_id, :name
end
