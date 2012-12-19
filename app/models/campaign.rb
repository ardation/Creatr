class Campaign < ActiveRecord::Base
  has_many :permissions
  has_many :members, through: :permissions
  has_many :contents
  belongs_to :theme
  attr_accessible :name, :contents, :start_date, :finish_date, :theme_id, :sms_template, :contents_attributes
  accepts_nested_attributes_for :contents, :reject_if => :all_blank, :allow_destroy => true
  validate :valid_name

  def valid_name
    reg = /\A(?:[a-z0-9]_?)*[a-z](?:_?[a-z0-9])*\z/i
    errors[:name] = "Invalid characters in your campaign name" unless reg.match self.name
  end
end
