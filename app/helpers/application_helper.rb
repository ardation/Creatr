module ApplicationHelper
  def route(member, redirect = true)
    @data = session["devise.facebook_data"]
    if !member.is_a?(Member) and !@data.nil?
      member = Member.find_for_facebook_oauth(@data)
    end
    if member.is_a?(Member)
      if not member.confirmed?
        @redirect_to = '/members/confirmation' if params[:action] != 'confirm'
      elsif not member.activated
        @redirect_to = '/activate' if params[:action] != 'activate'
      else
        unless signed_in?(member)
          sign_in member, :event => :authentication
        end
        @redirect_to = '/dashboard' if params[:controller] != 'dashboard'
      end
    elsif @data.nil?
      @redirect_to = '/signup' if params[:action] == 'signup_fb'
    else
      @redirect_to = '/signup_fb' if params[:action] == 'facebook'
      @redirect_to = '/signup_fb' if params[:action] == 'signup'
      session.delete("devise.facebook_data") if params[:action] == 'signup_done'
    end

    if redirect
      redirect_to @redirect_to unless @redirect_to.nil?
    else
      @redirect_to
    end
  end
end
