class Member < ActiveRecord::Base
  devise :omniauthable
  attr_accessible :email, :encrypted_password, :password_confirmation, :remember_me, :provider, :uid, :name, :token, :usage

	def self.find_for_facebook_oauth(auth)
		return Member.where(:provider => auth.provider, :uid => auth.uid).first

    /unless user
      user = Member.create(name:auth.info.name,
              provider:auth.provider,
              uid:auth.uid,
              email:auth.info.email,
              encrypted_password:Devise.friendly_token[0,20]
            )
    end/
	end
end
