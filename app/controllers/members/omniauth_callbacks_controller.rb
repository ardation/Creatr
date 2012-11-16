class Members::OmniauthCallbacksController < Devise::OmniauthCallbacksController

  def facebook
    # You need to implement the method below in your model (e.g. app/models/user.rb)
    @user = Member.find_for_facebook_oauth(request.env["omniauth.auth"])

    if @user.persisted?
      if @user.activated?
        sign_in_and_redirect @user, :event => :authentication #this will throw if @user is not activated
        set_flash_message(:notice, :success, :kind => "Facebook") if is_navigational_format?
      else
        session["devise.facebook_data"] = request.env["omniauth.auth"]
        redirect_to :controller => '/site', :action => 'signup' 
        #redirect_to 'site#signup'
      end
    end
  end
end