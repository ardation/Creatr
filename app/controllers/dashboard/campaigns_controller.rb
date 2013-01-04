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
    raise "LOL"
  end
end
