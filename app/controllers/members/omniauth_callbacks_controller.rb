class Members::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  include ApplicationHelper

  def facebook
    @user = Member.find_for_facebook_oauth(request.env['omniauth.auth'])
    session['devise.facebook_data'] = request.env['omniauth.auth'] if @user.nil?
    redirect_to route(@user, false)
  end
end
