class Person < ActiveRecord::Base
  belongs_to :campaign
  has_many :answers, dependent: :destroy
  accepts_nested_attributes_for :answers
  attr_accessible :facebook_access_token, :facebook_id, :first_name, :last_name, :phone, :mobile, :sms_token, :email, :gender, :answers_attributes
  attr_reader :sms_validated, :photo_validated, :synced
  before_validation :generate_code, :on => :create
  before_create :get_extended_token
  after_create :send_sms
  validates_presence_of :first_name, :campaign, :mobile
  validates_uniqueness_of :mobile

  def upload_photo(file)
    unless self.facebook_access_token.blank?
      @graph = Koala::Facebook::API.new(self.facebook_access_token)
      @graph.put_picture(file, {:message => "Get your free sunglass on campus from Student Life! http://slnz.co"}, "me")
    end
  end

  def sms_validate
    self.sms_validated = true
    self.save
  end

  def photo_validate
    self.sms_validated = true
    self.photo_validated = true
    self.save
  end

  def mobile=(number)
    super(number.to_i)
  end

  def sync
    crm_base_model = "#{self.campaign.organisation.crm.name}Crm"
    crm_base_model = Kernel.const_get(crm_base_model)
    crm_base_model.sync(self, self.campaign, self.campaign.members.first)
  end

  private

  def generate_code
    begin
      token = rand(10000..99999)
    end while Person.where(:sms_token => token.to_s).exists?
    self.sms_token = token
  end

  def get_extended_token
    #Create a new koala Oauth object.
    unless self.facebook_access_token.blank?
      begin
        oauth = Koala::Facebook::OAuth.new(367941839912657, 'e8d52319cc337c4e457c60f584206f4d')
        self.facebook_access_token = oauth.exchange_access_token(self.facebook_access_token)
      rescue => ex
        self.facebook_access_token = ""
      end
    end
  end

  def send_sms
    if !self.mobile.blank? and !self.campaign.sms_template.blank?
      begin
      @client = Twilio::REST::Client.new(ENV['sms_sid'], ENV['sms_token'])
      @account = @client.account
      @message = @account.sms.messages.create({:from => '+17784021163', :to => "+64#{self.mobile}", :body => "#{self.campaign.sms_template.gsub(/\[fname\]/, self.first_name)} #{self.sms_token}" })
    rescue => ex
      #fake number
    end
    end
  end
end
