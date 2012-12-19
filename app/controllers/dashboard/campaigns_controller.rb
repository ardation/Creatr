class Dashboard::CampaignsController < Dashboard::ResourceController
  respond_to :json

  def crm_data
    @crms = current_member.crms
    respond_with(@crms)
  end
  def content_types
    @content_types = ContentType.all
    respond_with(@content_types.to_json(only: [:name, :id, :validator]))
  end
end
