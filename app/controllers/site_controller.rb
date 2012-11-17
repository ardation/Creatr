class SiteController < ApplicationController
	def index

	end

	def features

	end

	def testimonials

	end

	def pricing

	end

  def activate
    if current_member.nil?
      redirect_to '/'
    else
      if current_member.activated
        redirect_to '/dashboard'
      end
    end
  end

  def signup
  	unless session["devise.facebook_data"].nil?
      redirect_to '/signup_fb'
    end
  end

  def signup_fb
    @data = session["devise.facebook_data"]
    unless @data.nil?
    	@member = Member.find_for_facebook_oauth(@data)

    	if @member.nil?
        @member = Member.new
		  	@name = @data['info']['name'] || ""
        @email = @data['info']['email'].include?("@facebook.com") ? "" : @email = @data['info']['email']
    	else
        unless @member.activated
          sign_in @member, :event => :authentication
          redirect_to '/activate'
        else
          redirect_to '/dashboard'
        end
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
      sign_in @member, :event => :authentication
		  redirect_to '/signup_done'
  	end
  end

  def signup_done
    if session["devise.facebook_data"].nil?
      redirect_to '/'
    end
  end
end
