class ContentType < ActiveRecord::Base
  require 'json'
  attr_accessible :validator, :js, :name, :template_id, :inherited_type_id, :default_template, :is_published
  belongs_to :inheritance, :class_name => "ContentType", :foreign_key => "inherited_type_id"
  validates :name, :format => { :with => /[a-z0-9]/ }, :uniqueness => true, :presence => true
  validates_presence_of :name
  validates_presence_of :default_template, :validator, :unless => :inheritance?
  validate :working_javascript, :working_validator, :working_inheritance
  has_many :content

  def working_javascript
    unless js.empty?
      @jshintrb = Jshintrb.lint(js)
      unless @jshintrb.empty?
        @jshintrb.each do |ex|
          errors.add(:js, ex["reason"] + "Line: " + ex["line"].to_s + " Char:" + ex["character"].to_s)
        end
      end
    end
  end

  def working_inheritance
    @parent = inheritance
    while !@parent.nil?
      if @parent.id == id
        errors.add(:inheritance, "Cannot inherit child Content Type")
        @parent =  nil
      else
        @parent = @parent.inheritance
      end
    end
  end

  def inheritance?
    !inheritance.nil?
  end

  def working_validator
    errors[:validator] << "Not valid json format" unless is_json?(validator) || validator.empty?
  end

  def get_default_template
    @default_template = read_attribute(:default_template)
    @parent = self

    while @default_template.blank?
      @default_template = @parent.default_template
      @parent = @parent.inheritance

    end
    return @default_template
  end

  def is_json?(value)
    begin
      !!JSON.parse(value)
    rescue
      false
    end
  end
end
