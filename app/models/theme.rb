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
  has_many :content_types, through: :templates
  has_many :images, :dependent => :destroy
  has_many :favourites, dependent: :destroy
  accepts_nested_attributes_for :images, :reject_if => :all_blank, :allow_destroy => true
  accepts_nested_attributes_for :templates, :reject_if => :all_blank, :allow_destroy => true
  attr_accessible :title, :description, :featured, :featured_at, :published, :published_at, :main_image, :css, :images_attributes, :mobile, :tablet, :laptop, :desktop, :templates_attributes, :container_template
  validates_attachment :main_image, :size => { :in => 0..100.kilobytes }
  validates_attachment_content_type :main_image, :content_type=> ['image/jpeg', 'image/png', 'image/gif']
  validates_presence_of :title, :main_image, :owner
  validates_uniqueness_of :title
  validate :at_least_one_platform
  validate :css_validator
  before_create :create_default_container


  def create_default_container
    self.container_template = "<div>{{outlet}}</div>"
  end

  def get_content_type_template(id)
    @record = self.templates.where(content_type_id:id).first
    if @record.nil?
      ContentType.find(:first, id).default_template
    else
      @record.content
    end
  end

  def templates_attributes=(data)
    data.each do |t|
      t = t[1]
      record = self.templates.where(content_type_id: t["content_type_id"].to_i ).first_or_create
      record.content = t["content"]
      begin
        record.save!
      rescue
        @template_attributes_errors = "Your " + record.content_type.name + " template has a syntax error. Check and try again."
      end
    end
  end

  def at_least_one_platform
    unless self.mobile or self.tablet or self.laptop or self.desktop
      errors[:platform] << ("Selection: Please choose at least one platform - any platform will do.")
    end
  end

  def css_validator
    begin
      css = Sass::Engine.new(self.css, :syntax => :scss).render unless self.css.nil?
    rescue
      errors[:css] = "Your CSS has an error. Check and try again."
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
