class DashboardController < ApplicationController
  layout "dashboard"
  include ApplicationHelper
  before_filter :authenticate_member!
  def index
    route(current_member)
  end
end
