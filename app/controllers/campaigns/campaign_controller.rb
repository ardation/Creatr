class Campaigns::CampaignController < Campaigns::BaseController
  respond_to :html, :json
  def index
    unless @campaign.nil?
      @content_types = []
      @templates = []
      @campaign.contents.each do |content|
        unless @content_types.include?(content.content_type)
          @content_types << content.content_type
          @templates << {name: content.content_type.name, content: @campaign.theme.get_content_type_template(content.content_type.id) }
        end
      end
      @content_types = @content_types.to_json(only: [:name, :js, :id, :data_count])
      render layout: "campaign"
    else
      params[:action] = "error"
      render "lost", layout: "campaign", status: 404
    end
  end

  def submit

  end

  def validate_sms_code
    if false
      render json: ":"  #Force JSON Error for CrossDomain
    else
      respond_with "#{params[:callback]}({validate:true})"
    end
  end

  def fb_image
    render json: {validate: true}.to_json
  end
end
