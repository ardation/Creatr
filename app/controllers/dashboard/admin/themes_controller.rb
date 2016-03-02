class Dashboard::Admin::ThemesController < Dashboard::ResourceController
  before_filter :is_admin

  def index
    @themes = Theme.where(published: true).all
    Tabletastic.default_table_html = { class: 'table table-striped' }
  end

  def publish
    m = Theme.find(params[:id])
    m.publish
    m.save
    flash[:success] = "Successfully published #{m.title}"
    redirect_to request.referer
  end

  def unpublish
    m = Theme.find(params[:id])
    m.unpublish
    m.save
    flash[:success] = "Successfully unpublished #{m.title}"
    redirect_to request.referer
  end

  def feature
    m = Theme.find(params[:id])
    m.feature
    m.save
    flash[:success] = "Successfully featured #{m.title}"
    redirect_to request.referer
  end

  def unfeature
    m = Theme.find(params[:id])
    m.unfeature
    m.save
    flash[:success] = "Successfully unfeatured #{m.title}"
    redirect_to request.referer
  end

  protected

  def is_admin
    redirect_to 'dashboard/unauthorized' unless current_member.admin?
  end
end
