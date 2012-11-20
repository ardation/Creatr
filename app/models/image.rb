class Image < ActiveRecord::Base
  belongs_to :theme
  has_attached_file :picture
  validates_attachment_presence :picture
  validates_attachment_size :picture, :less_than => 500.kilobytes
end
