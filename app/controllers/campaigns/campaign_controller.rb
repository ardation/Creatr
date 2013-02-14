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
      @content_types = @content_types.to_json(only: [:name, :js, :id, :data_count, :sync_type])
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

  def endpoint
    @campaign.people.create params[:person]
    render json: {validate: true}.to_json
  end

  def validate_sms_code
    @person = @campaign.people.find_by_sms_token(params[:token].to_i)
    if @person.nil?
      render json: ":"  #Force JSON Error for CrossDomain
    elsif !@person.sms_validated?
      @person.sms_validate
      respond_with "#{params[:callback]}({validate:true})"
    else
      render json: ":"  #Force JSON Error for CrossDomain
    end
  end

  #def fb

  #end
  def fb_image
    @person = @campaign.people.find_by_sms_token(params[:token].to_i)
    if @person.nil? or params[:file].blank?
      render json: {validate: false}.to_json
    elsif !@person.photo_validated?
      @person.upload_photo params[:file]
      @person.photo_validate
      render json: {validate: true}.to_json
    else
      render json: {validate: false}.to_json
    end
  end
end
