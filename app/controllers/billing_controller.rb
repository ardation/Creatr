class BillingController < ApplicationController
  layout "dashboard"
  before_filter :authenticate_member!
  def index
  	@member = current_member
  end
end
