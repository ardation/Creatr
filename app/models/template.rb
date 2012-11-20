class Template < ActiveRecord::Base
  belongs_to :theme
  belongs_to :content_type
  has_attached_file :hamlbars
  validates_attachment_presence :hamlbars
  validates_attachment_size :hamlbars, :less_than => 1.megabytes
end
