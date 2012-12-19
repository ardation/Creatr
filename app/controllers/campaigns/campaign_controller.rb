class Campaigns::CampaignController < Campaigns::BaseController
  def index
    unless @campaign.nil?
      @content_types = Array.new
      @campaign.contents.each do |content|
        @content_types << content.content_type unless @content_types.include?(content.content_type)
      end
      @content_types = @content_types.to_json(only: [:name, :js, :id])
      render layout: "campaign"
    else
      params[:action] = "error"
      render "lost", layout: "campaign", status: 404
    end
  end
end
