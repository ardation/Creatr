class Campaign < ActiveRecord::Base
  before_validation :cache_domain
  has_many :permissions
  has_many :members, through: :permissions
  has_many :contents
  has_many :campaign_counters
  belongs_to :theme
  attr_accessible :name, :contents, :start_date, :finish_date, :theme_id, :sms_template, :contents_attributes, :cname_alias
  accepts_nested_attributes_for :contents, :reject_if => :all_blank, :allow_destroy => true
  validate :valid_name
  validates_uniqueness_of :name,
                          :cached_domain
  validates_uniqueness_of :cname_alias,
                          :allow_blank => true
  validates_presence_of   :name,
                          :cached_domain
  validates_exclusion_of  :name,
                          :in => %w(staging),
                          :message => "is taken"
  def valid_name
    reg = /\A(?:[a-z0-9]_?)*[a-z](?:_?[a-z0-9])*\z/i
    errors[:name] = "Invalid characters in your campaign name" unless reg.match self.name
  end

  def cache_domain
    self.cached_domain = if self.cname_alias.blank?
      "#{self.name.downcase}.#{ENV['app_url']}"
    else
      "#{self.cname_alias}"
    end
  end

  def total
    self.campaign_counters.sum(:count)
  end

  def tidy_name
    self.name.gsub(/_/, ' ').capitalize
  end
end
