class ContentType < ActiveRecord::Base
  serialize :hash, Hash
  attr_accessible :hash, :js, :name
  belongs_to :inheritance, :class_name => "ContentType", :foreign_key => "inherited_type_id"
  belongs_to :default_template, :class_name => "Template", :foreign_key => "template_id"
  validates_presence_of :hash, :js, :name, :default_template
end
