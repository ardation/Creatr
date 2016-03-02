class Photo < ActiveRecord::Base
  attr_accessible :file, :person
  belongs_to :person

  has_attached_file :file
  validates_attachment_content_type :file, content_type: /\Aimage\/.*\Z/
end
