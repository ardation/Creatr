FlamingWight::Application.routes.draw do
  devise_for :members, :controllers => { :omniauth_callbacks => "members/omniauth_callbacks", :confirmations => 'members/confirmations'}

  devise_scope :member do
    get 'sign_in', :to => 'devise/sessions#new', :as => :new_session
    get 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session
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

  match 'dashboard' => 'dashboard#index'
  match 'dashboard/billing' => 'billing#index'
  match 'dashboard/new' => 'create#index'
  match 'dashboard/settings' => 'dashboard#settings'
  match 'dashboard/admin/accounts' => 'administrator#accounts'
  match 'dashboard/admin/accounts/:id/activate' => 'administrator#activate'
  match 'dashboard/admin/accounts/:id/deactivate' => 'administrator#deactivate'
  match 'dashboard/admin/accounts/:id/promote' => 'administrator#promote'
  match 'dashboard/admin/accounts/:id/demote' => 'administrator#demote'
  match 'member_root' => 'site#features', :as => :dashboard

  match 'resent' => 'site#resent'
  match 'confirmed' => 'site#confirmed'

  match 'organisations' => 'organisation#index'
end
