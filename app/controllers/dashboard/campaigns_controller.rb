class Dashboard::CampaignsController < Dashboard::ResourceController
  load_and_authorize_resource
  respond_to :json
  def index
    Tabletastic.default_table_html = {:cellspacing => 0, :class => 'table table-striped'}
    super
  end

  def crm_data
    @crms = current_member.crms
    respond_with(@crms)
  end

  def content_types
    @content_types = ContentType.all
    respond_with(@content_types.to_json(only: [:name, :id, :validator]))
  end

  def create
    create!
    @campaign_permission = Permission.new(campaign: @campaign, member: current_member)
    @campaign_permission.save

    crm_base_model = "#{@campaign.organisation.crm.name}Crm"
    crm_base_model = Kernel.const_get(crm_base_model)
    crm_base_model.create(@campaign, current_member)
  end

  def destroy
    crm_base_model = "#{@campaign.organisation.crm.name}Crm"
    crm_base_model = Kernel.const_get(crm_base_model)
    crm_base_model.delete(@campaign, current_member)
    destroy!
  end

  def fb_image
    if params[:file]
      @campaign.fb_image = params[:file]
      @campaign.save
      @campaign.people.where("photo_validated = false and facebook_access_token <> '' and sms_validated = true").order("id ASC").all.map{|p| p.delay.upload_photo( @campaign.fb_image.url )}
      flash[:notice] = "Cool. We are going to post onto peoples timelines now!"
      redirect_to dashboard_campaign_path @campaign
    else
      flash[:notice] = "You need to choose a photo to upload!"
      redirect_to edit_dashboard_campaign_path @campaign
    end
  end

  def sync
    @campaign.people.where(sms_validated:true, synced:false).all.map{|p| p.delay.sync}
    flash[:notice] = "Cool. We are going to sync people with your endpoint now!"
    redirect_to dashboard_campaign_path @campaign
  end

  def export

  end
end
