class Theme < ActiveRecord::Base
  # attr_accessible :title, :body
  has_many :images
  has_many :templates
  has_many :surveys
  belongs_to :owner, :class_name => "Member", :foreign_key => "owner_id"
  has_attached_file :featured_image
  has_attached_file :main_image
  has_attached_file :css
  has_many :templates, :dependent => :destroy
  has_many :images, :dependent => :destroy
  attr_accessible :title, :description, :featured, :featured_at, :published, :published_at
end
