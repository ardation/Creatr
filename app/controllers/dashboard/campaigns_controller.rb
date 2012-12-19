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
end
