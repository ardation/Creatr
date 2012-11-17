class CreateController < ApplicationController
  before_filter :authenticate_member!
  def index
  end
end
