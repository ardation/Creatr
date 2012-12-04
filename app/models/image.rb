class Image < ActiveRecord::Base
  belongs_to :theme
  has_attached_file :picture,
    :path => ":class/:id/:style/:filename",
    :default_url => '/images/:attachment/missing_:style.gif',
    :styles => {
      :thumb => "80x80#",
    },
    :convert_options => {
      :thumb => "-quality 75 -strip" }
  validates_attachment_presence :picture
  validates_attachment_size :picture, :less_than => 200.kilobytes
  attr_accessible :picture
end
