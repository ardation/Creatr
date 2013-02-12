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

  def content
    @content = @campaign.contents.find_by_position(params[:id])
    @content_type = @content.content_type
  end

  def content_types
    @content_type = ContentType.find(params[:id])
  end

  def submit

  end

  def validate_sms_code
    @person = @campaign.people.find_by_sms_token(params[:token].to_i)
    if @person.nil?
      render json: ":"  #Force JSON Error for CrossDomain
    elsif !@person.sms_validated?
      @person.sms_validated = true
      @person.save
      respond_with "#{params[:callback]}({validate:true})"
    else
      render json: ":"  #Force JSON Error for CrossDomain
    end
  end

  def fb_image
    @person = @campaign.people.find_by_sms_token(params[:token].to_i)
    if @person.nil?
      render json: {validate: false}.to_json
    elsif !@person.photo_validated?
      @person.sms_validated = true
      @person.photo_validated = true
      @person.save
      render json: {validate: true}.to_json
    else
      render json: {validate: false}.to_json
    end
  end
end
