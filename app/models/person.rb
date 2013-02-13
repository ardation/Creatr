
class Person < ActiveRecord::Base
  belongs_to :campaign
  has_many :answers, dependent: :destroy
  attr_accessible :facebook_access_token, :facebook_id, :first_name, :last_name, :phone, :sms_token, :email, :sms_validated, :photo_validated, :synced
  before_validation :generate_code, :on => :create
  before_create :get_extended_token
  after_create :send_sms
  validates_presence_of :first_name, :campaign

  def upload_photo(file)
    @graph = Koala::Facebook::API.new(self.facebook_access_token)
    @graph.put_picture(file, {:message => "Get your free sunglass on campus from Student Life! http://slnz.co"}, "me")
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
    oauth = Koala::Facebook::OAuth.new(367941839912657, 'e8d52319cc337c4e457c60f584206f4d')
    self.facebook_access_token = oauth.exchange_access_token(self.facebook_access_token)
  end

  def send_sms
    if !self.phone.blank? and !self.campaign.sms_template.blank?
      @client = Twilio::REST::Client.new(ENV['sms_sid'], ENV['sms_token'])
      @account = @client.account
      @message = @account.sms.messages.create({:from => '+17784021163', :to => "+64#{self.phone}", :body => "#{self.campaign.sms_template.gsub(/\[fname\]/, self.first_name)} #{self.sms_token}" })
    end
  end
end
