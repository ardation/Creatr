class Theme < ActiveRecord::Base
  ActiveRecord::Base.include_root_in_json = false
  # attr_accessible :title, :body
  has_many :images
  has_many :templates
  has_many :surveys
  belongs_to :owner, :class_name => "Member", :foreign_key => "owner_id"
  has_attached_file :main_image,
    :path => ":class/:id/main_image/:style/:filename",
    :default_url => '/images/:attachment/missing_:style.gif',
    :styles => {
      :thumb => "80x80#",
      :small  => "150x150>",
      :original => "200x140>#" },
    :convert_options => {
      :thumb => "-quality 75 -strip" }
  has_many :templates, :dependent => :destroy
  has_many :images, :dependent => :destroy
  has_many :favourites, dependent: :destroy
  accepts_nested_attributes_for :images, :reject_if => :all_blank, :allow_destroy => true
  attr_accessible :title, :description, :featured, :featured_at, :published, :published_at, :main_image, :css, :images_attributes, :mobile, :tablet, :laptop, :desktop
  validates_attachment :main_image, :size => { :in => 0..100.kilobytes }
  validates_attachment_content_type :main_image, :content_type=> ['image/jpeg', 'image/png', 'image/gif']
  validates_presence_of :title, :main_image, :owner
  validates_uniqueness_of :title
  validate :at_least_one_platform

  def at_least_one_platform
    unless self.mobile or self.tablet or self.laptop or self.desktop
      errors[:platform] << ("Selection: Please choose at least one platform - any platform will do.")
    end
  end

  def main_image_url
    main_image.url(:original)
  end

  def short_description
    ActionController::Base.helpers.truncate(description, :length => 200, :separator => ' ')
  end

  def owner_name
    owner.name
  end

  def favourite?(id)
    !favourites.where(member_id: id).first.nil?
  end

  def publish_pending?
    published? and published_at.nil?
  end

  def editable?(id)
    owner.id == id and !published?
  end

  private

  def set_default_url_on_category
    "http://placehold.it/600x200"
  end

end
