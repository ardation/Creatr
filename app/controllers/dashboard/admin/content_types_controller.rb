class Dashboard::Admin::ContentTypesController < Dashboard::ResourceController
  before_filter :is_admin

  def index
    Tabletastic.default_table_html = { :class => 'table table-striped' }
    super
  end

  def is_admin
    if !current_member.admin?
      redirect_to 'dashboard/unauthorized'
    end
  end

end
