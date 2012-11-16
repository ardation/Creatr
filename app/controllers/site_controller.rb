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
  	unless session["devise.facebook_data"].nil?
	  	@member = Member.find_for_facebook_oauth(session["devise.facebook_data"])
	  	unless @member.nil?
	  		if @member.activated
	        sign_in_and_redirect @member, :event => :authentication #this will throw if @user is not activated
	        set_flash_message(:notice, :success, :kind => "Facebook") if is_navigational_format?
		    else
		    	session["devise.facebook_data"] = request.env["omniauth.auth"]
		    	redirect_to '/activate'
		    end
	  	end
	end
  end

  def signup_fb
  	@member = Member.find_for_facebook_oauth(session["devise.facebook_data"]) unless session["devise.facebook_data"].nil?

  	if @member.nil?
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
	else
		redirect_to member_omniauth_authorize_path(:facebook)
	end
  end

  def createUser

  	@member = Member.new
  	@member.name = params[:member][:name]
  	@member.email = params[:member][:email]
  	@member.token = session["devise.facebook_data"]['credentials']['token']
  	@member.tokenExpires = Time.at(session["devise.facebook_data"]['credentials']['expires_at'])
  	@member.uid = session["devise.facebook_data"]['uid']
  	@member.provider = session["devise.facebook_data"]['provider']
  	
  	unless @member.save!
  		@name = params[:member][:name]
  		@email = params[:member][:email]
  		render 'site/signup_fb'
	else
		render 'site/signup_done'
  	end
  	#@member.errors[:email]
  end

end
