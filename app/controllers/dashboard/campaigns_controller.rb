class Dashboard::CampaignsController < Dashboard::ResourceController
  respond_to :json

  def crm_data
    @crms = current_member.crms
    respond_with(@crms)
  end
end
