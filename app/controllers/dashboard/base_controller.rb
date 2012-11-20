class Dashboard::BaseController < ApplicationController
  layout "dashboard"
  include ApplicationHelper
  before_filter :authenticate_member!
end
