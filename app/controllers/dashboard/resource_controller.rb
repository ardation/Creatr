class Dashboard::ResourceController < InheritedResources::Base
  layout "dashboard"
  include ApplicationHelper
  before_filter :authenticate_member!
end
