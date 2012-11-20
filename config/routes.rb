FlamingWight::Application.routes.draw do
  devise_for :members, :controllers => { :omniauth_callbacks => "members/omniauth_callbacks", :confirmations => 'members/confirmations'}

  devise_scope :member do
    get 'sign_in', :to => 'devise/sessions#new', :as => :new_session
    get 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session
  end

  namespace :dashboard do
    resources :themes
    root :to => 'dashboard#index'
    match 'billing' => 'billing#index'
    match 'billing/credit_card' => 'billing#credit_card'
    match 'new' => 'create#index'
    match 'settings' => 'dashboard#settings'
    match 'themes' => 'theme#index'
    match 'ajax/crm_data' => 'create#crm_data'
    namespace :admin do
      match 'accounts' => 'administrator#accounts'
      match 'accounts/:id/activate' => 'administrator#activate'
      match 'accounts/:id/deactivate' => 'administrator#deactivate'
      match 'accounts/:id/promote' => 'administrator#promote'
      match 'accounts/:id/demote' => 'administrator#demote'
      resources :content_types, :except => :destroy
    end
  end

  root :to => "site#index"
  match 'features' => "site#features"
  match 'testimonials' => "site#testimonials"
  match 'pricing' => "site#pricing"
  match 'signup' => 'site#signup'
  match 'activate' => 'site#activate'
  get 'signup_fb' => 'site#signup_fb'
  post 'signup_fb' => 'site#createUser'
  get 'signup_done' => 'site#signup_done'

  match 'member_root' => 'site#features', :as => :dashboard

  match 'resent' => 'site#resent'
  match 'confirmed' => 'site#confirmed'

  

end
