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
    @campaign.contents.each do |content|
      case content.content_type.sync_type
      when ContentType::CHECK_BOX, ContentType::DROPDOWN, ContentType::RADIO_BUTTON
        data = JSON.parse content.data
        data["Answers"] = data["Answers"].split(',').map{|data| data.strip}.join(',')
        content.data = data
      when ContentType::CONTACT
        data = JSON.parse content.data
        data["DegreeOptions"] = data["DegreeOptions"].split(',').map{|data| data.strip}.join(',')
        data["YearOptions"] = data["YearOptions"].split(',').map{|data| data.strip}.join(',')
        data["HallOptions"] = data["HallOptions"].split(',').map{|data| data.strip}.join(',')
        content.data = data
      end
    end

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
end
