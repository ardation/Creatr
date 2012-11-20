class Member < ActiveRecord::Base

  has_many :member_crms
  has_many :crms, :through => :member_crms

  has_many :permissions
  has_many :surveys, through: :permissions

  has_many :organisations, through: :crms

  devise :omniauthable, :confirmable, :registerable
  attr_accessible :email, :encrypted_password, :password_confirmation, :remember_me, :provider, :uid, :name, :token, :usage, :tokenExpires, :stripe
  validates_presence_of :email, :name, :uid, :provider
  validates_uniqueness_of :email, :uid

	def self.find_for_facebook_oauth(auth)
		return Member.where(:provider => auth.provider, :uid => auth.uid).first
	end

  def only_if_unconfirmed
    pending_any_confirmation {yield}
  end

  def activate
    self.activated = true
    self.save
  end

  def deactivate
    self.activated = false
    self.save
  end

  def promote
    self.admin = true
    self.save
  end

  def demote
    self.admin = false
    self.save
  end

end
