class CreateController < DashboardBaseController
  before_filter :authenticate_member!
  def index
  end

  def crm_data
    @crm_data = Array.new
    member = current_member
    member.crms.all.each do |crm|
      @org_data = Array.new
      crm.organisations.each do |organisation|
        @org_data << {
          :org_data => organisation.id,
          :org_name => organisation.name
        }
      end

      @crm_data << {
        :crm_id => crm.id,
        :crm_name => crm.name,
        :organisation => @org_data
      }
    end
    render :json => @crm_data.to_json
  end
end
