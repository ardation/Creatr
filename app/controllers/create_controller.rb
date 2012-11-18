class CreateController < ApplicationController
  layout "dashboard"
  before_filter :authenticate_member!
  def index
  end
end
