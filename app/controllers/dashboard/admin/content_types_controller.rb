class Dashboard::Admin::ContentTypesController < Dashboard::ResourceController
  before_filter :is_admin

  def index
    Tabletastic.default_table_html = { class: 'table table-striped' }
    super
  end

  protected

  def is_admin
    redirect_to 'dashboard/unauthorized' unless current_member.admin?
  end
end
