class Campaigns::BaseController < ApplicationController
  before_filter :get_campaign

  protected

  def get_campaign
    @campaign = Campaign.first(:conditions => {
        :cached_domain => request.host
    })
  end
end
