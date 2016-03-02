class Dashboard::CreateController < Dashboard::BaseController
  before_filter :authenticate_member!
  def index
  end

  def crm_data
    @crm_data = []
    member = current_member

    member.crms.all.each do |crm|
      @orgs = []
      crm.organisations.all.each do |org|
        @orgs << {
          org_name: org.name,
          org_id: org.id
        }
      end
      @crm_data << {
        crm_id: crm.id,
        crm_name: crm.name,
        orgs: @orgs
      }
    end
    render json: @crm_data.to_json
  end

  def content_types
    @content_types = ContentType.all
    render json: @content_types.to_json(only: [:name, :id, :validator])
  end
end
