class Api::VerifyController < ApplicationController
  respond_to :json

  def verify_campaign
    @campaign = Campaign.find_by_campaign_code(params['token'].to_i)
    if @campaign.nil?
      render json: ":"  #Force JSON Error for CrossDomain
    else
      respond_with "#{params[:callback]}(#{@campaign.to_json(only: [:id, :cached_domain, :start_date, :finish_date, :name, :campaign_code], methods: [:total])})"
    end
  end
end
