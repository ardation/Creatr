class Campaign < ActiveRecord::Base
  before_validation :cache_domain
  has_many :permissions, dependent: :destroy
  has_many :members, through: :permissions
  has_many :contents, dependent: :destroy
  has_many :campaign_counters, dependent: :destroy
  has_many :people, dependent: :destroy
  belongs_to :theme
  belongs_to :organisation
  accepts_nested_attributes_for :contents, :reject_if => :all_blank, :allow_destroy => true
  attr_accessible :name, :short_name, :contents, :start_date, :finish_date, :theme_id, :sms_template, :contents_attributes, :cname_alias, :organisation_id, :foreign_id
  validate :valid_short_name
  validates_uniqueness_of :short_name,
                          :cached_domain
  validates_uniqueness_of :cname_alias,
                          :allow_blank => true
  validates_presence_of   :name,
                          :short_name,
                          :cached_domain,
                          :organisation,
                          :campaign_code
  validates_exclusion_of  :name,
                          :in => %w(staging),
                          :message => "is taken"
  validates_length_of :campaign_code, :minimum => 5, :maximum => 5
  before_validation :generate_code, :on => :create

  def generate_code
    begin
      token = rand(10000..99999)
    end while Campaign.where(:campaign_code => token.to_s).exists?
    self.campaign_code = token
  end

  def valid_short_name
    reg = /\A(?:[a-z0-9]_?)*[a-z](?:_?[a-z0-9])*\z/i
    errors[:short_name] = "Invalid characters in your campaign name" unless reg.match self.short_name
  end

  def cache_domain
    self.cached_domain = if self.cname_alias.blank?
      "#{self.short_name.downcase}.#{ENV['app_url']}"
    else
      "#{self.cname_alias}"
    end
  end

  def total
    self.campaign_counters.sum(:count)
  end
end
