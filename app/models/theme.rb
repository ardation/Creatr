class Theme < ActiveRecord::Base
  # attr_accessible :title, :body
  has_many :images
  has_many :templates
  has_many :surveys
  belongs_to :owner, :class_name => "Member", :foreign_key => "owner_id"
  has_attached_file :featured_image,
    :path => ":class/:id/featured_image/:style/:filename",
    :default_url => '/images/:attachment/missing_:style.gif',
    :styles => {
      :thumb => "80x80#",
      :small  => "150x150>",
      :original => "600x200>#" },
    :convert_options => {
      :thumb => "-quality 75 -strip" }
  has_attached_file :main_image
  has_attached_file :css
  has_many :templates, :dependent => :destroy
  has_many :images, :dependent => :destroy
  accepts_nested_attributes_for :images, :reject_if => :all_blank, :allow_destroy => true
  attr_accessible :title, :description, :featured, :featured_at, :published, :published_at, :featured_image, :main_image, :css, :images_attributes
  validates_attachment :featured_image, :size => { :in => 0..100.kilobytes }
  validates_attachment_content_type :featured_image, :content_type => ['image/jpeg', 'image/png', 'image/gif']
  validates_attachment :main_image, :size => { :in => 0..100.kilobytes }
  validates_attachment_content_type :main_image, :content_type=> ['image/jpeg', 'image/png', 'image/gif']
  validates_attachment :css, :size => { :in => 0..100.kilobytes }
  validates_attachment_content_type :css, :content_type=> ['text/css']
  validates_presence_of :title, :main_image
  validates_uniqueness_of :title
  private

  def set_default_url_on_category
    "http://placehold.it/600x200"
  end
end
