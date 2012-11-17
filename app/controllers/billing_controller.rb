class BillingController < ApplicationController
  before_filter :authenticate_member!
  def index
  	@member = current_member
  end
end
