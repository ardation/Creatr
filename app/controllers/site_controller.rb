class SiteController < ApplicationController
	def index

	end

	def features

	end

	def testimonials

	end

	def pricing

	end

  def signup

  end

  def signup_fb
  	if session.exists? && !session["devise.facebook_data"].nil?
	  	@name = session["devise.facebook_data"]['info']['name']  || ""
	  	@email = if session["devise.facebook_data"]['info']['email'].include?("@facebook.com")
	  		""
		else
			session["devise.facebook_data"]['info']['email']
		end

  	else
    	redirect_to member_omniauth_authorize_path(:facebook)
	end
  end

  def createUser

  	@member = Member.new
  	@member.name = params[:members][:name]
  	@member.email = params[:members][:email]
  	@member.token = session["devise.facebook_data"]['credentials']['token']
  	@member.tokenExpires = Time.at(session["devise.facebook_data"]['credentials']['expires_at'])
  	@member.uid = session["devise.facebook_data"]['uid']

  	@member.save
  end

end
