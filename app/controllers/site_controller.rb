class SiteController < ApplicationController
  include ApplicationHelper
	def index

	end

	def features

	end

	def testimonials

	end

	def pricing

	end

  def confirmed
    if flash[:set].nil?
      redirect_to '/activate'
    else
      render 'devise/confirmations/show'
    end
  end

  def resent
    if flash[:set].nil?
      redirect_to '/activate'
    else
      render 'devise/confirmations/resent'
    end
  end

  def activate
    route(current_member)
  end

  def signup
  	route(current_member)
  end

  def signup_fb
    route(current_member)

    @member = Member.new
    @name = @data['info']['name'] || ""
    @email = @data['info']['email'].include?("@facebook.com") ? "" : @email = @data['info']['email']
  end

  def createUser
  	@member = Member.new
    unless session["devise.facebook_data"].nil?
    	@member.name = params[:member][:name]
    	@member.email = params[:member][:email]
    	@member.token = session["devise.facebook_data"]['credentials']['token']
    	@member.tokenExpires = Time.at(session["devise.facebook_data"]['credentials']['expires_at'])
    	@member.uid = session["devise.facebook_data"]['uid']
    	@member.provider = session["devise.facebook_data"]['provider']
    end
  	unless @member.save
  		@name = params[:member][:name]
  		@email = params[:member][:email]
  		render 'site/signup_fb'
    else
      flash[:set] = true
		  redirect_to '/signup_done'
  	end
  end

  def signup_done
    if flash[:set].nil?
      redirect_to '/activate'
    end
    #self.route(current_member)
  end
end
