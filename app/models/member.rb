class Member < ActiveRecord::Base
  devise :omniauthable, :confirmable, :registerable
  attr_accessible :email, :encrypted_password, :password_confirmation, :remember_me, :provider, :uid, :name, :token, :usage, :tokenExpires
  validates_presence_of :email, :name, :uid, :provider
  validates_uniqueness_of :email, :uid

	def self.find_for_facebook_oauth(auth)
		return Member.where(:provider => auth.provider, :uid => auth.uid).first
	end

  def only_if_unconfirmed
    pending_any_confirmation {yield}
  end
end
