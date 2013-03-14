FlamingWight::Application.routes.draw do

  post "pusher" => "pusher#pusher"

  # config/routes
  constraints(PersonalizedDomain) do
    namespace :campaigns, :path => '/' do
      root :to => "campaign#index"
      match "contents/:id" => "campaign#content"
      match "types/:id" => "campaign#content_types"
      post "endpoint" => "campaign#endpoint"
    end
  end

  devise_for :members, :controllers => { :omniauth_callbacks => "members/omniauth_callbacks", :confirmations => 'members/confirmations'}

  devise_scope :member do
    get 'sign_in', :to => 'devise/sessions#new', :as => :new_session
    get 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session
  end

  namespace :dashboard do
    root :to => 'dashboard#index'
    match 'billing' => 'billing#index'
    match 'billing/credit_card' => 'billing#credit_card'
    match 'settings' => 'dashboard#settings'
    put 'settings/mhub' => 'dashboard#settings_mhub'
    post 'settings/mhub' => 'dashboard#settings_mhub'
    match 'iframe' => 'dashboard#iframe'

    resources :themes
    get 'themes/:method/:offset' => 'themes#get_data'
    get 'themes/favourites/add/:theme_id' => 'themes#add_favourite'
    get 'themes/favourites/remove/:theme_id' => 'themes#remove_favourite'
    get 'themes/:method/:offset/:multiplier' => 'themes#get_data'

    get 'campaigns/crm_data' => 'campaigns#crm_data'
    get 'campaigns/content_types' => 'campaigns#content_types'
    post 'campaigns/:id/fb_image' => 'campaigns#fb_image'
    get 'campaigns/:id/sync' => 'campaigns#sync'
    resources :campaigns

    namespace :admin do
      match 'accounts' => 'administrator#accounts'
      match 'accounts/:id/activate' => 'administrator#activate'
      match 'accounts/:id/deactivate' => 'administrator#deactivate'
      match 'accounts/:id/promote' => 'administrator#promote'
      match 'accounts/:id/demote' => 'administrator#demote'
      resources :content_types, :except => :destroy
      resources :themes, :except => [:create, :new]
      get 'themes/:id/unpublish' => 'themes#unpublish'
      get 'themes/:id/publish' => 'themes#publish'
      get 'themes/:id/unfeature' => 'themes#unfeature'
      get 'themes/:id/feature' => 'themes#feature'
    end
  end
  namespace :api do
    match "campaign_code/:token" => 'verify#verify_campaign'
    match ":campaign_token/sms_code/:token" => 'verify#validate_sms_code'
    match ":campaign_token/fb_image/:token" => 'verify#fb_image'
    match ":campaign_token/search" => 'verify#search_by_name'
    match ":campaign_token/person/:token/sms" => 'verify#send_sms'
    match ":campaign_token/person/:token/mobile" => 'verify#update_mobile'
  end
  root :to => "site#index"
  match 'tour' => "site#tour"
  match 'tour/:page' => "site#tour"
  match 'testimonials' => "site#testimonials"
  match 'pricing' => "site#pricing"
  match 'signup' => 'site#signup'
  match 'activate' => 'site#activate'
  get 'signup_fb' => 'site#signup_fb'
  post 'signup_fb' => 'site#createUser'
  get 'signup_done' => 'site#signup_done'
  get 'app' => 'site#app'
  get "survey/:id" => 'campaign#index'

  match 'member_root' => 'site#features', :as => :dashboard

  match 'resent' => 'site#resent'
  match 'confirmed' => 'site#confirmed'

  match "application.manifest" => 'site#manifest'

end
