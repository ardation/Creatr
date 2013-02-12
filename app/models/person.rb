class Person < ActiveRecord::Base
  belongs_to :campaign
  has_many :answers, dependent: :destroy
  attr_accessible :facebook_access_token, :facebook_id, :first_name, :last_name, :phone, :sms_token, :email, :sms_validated, :photo_validated, :synced
  before_validation :generate_code, :on => :create
  validates_presence_of :first_name
  def generate_code
    begin
      token = rand(10000..99999)
    end while Person.where(:sms_token => token.to_s).exists?
    self.sms_token = token
  end
end
