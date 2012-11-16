class Member < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :omniauthable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :encrypted_password, :password_confirmation, :remember_me, :provider, :uid, :name
  # attr_accessible :title, :body

	def self.find_for_facebook_oauth(auth, signed_in_resource=nil)
		user = Member.where(:provider => auth.provider, :uid => auth.uid).first
		unless user
			user = Member.create(name:auth.info.name,
							provider:auth.provider,
							uid:auth.uid,
							email:auth.info.email,
							encrypted_password:Devise.friendly_token[0,20]
						)
		end
		user
	end
end
