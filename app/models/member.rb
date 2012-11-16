class Member < ActiveRecord::Base
  devise :omniauthable
  attr_accessible :email, :encrypted_password, :password_confirmation, :remember_me, :provider, :uid, :name, :token

end
