class Dashboard::Admin::AdministratorController < Dashboard::BaseController
  before_filter :is_admin

  def is_admin
    if !current_member.admin?
      redirect_to 'dashboard/unauthorized'
    end
  end

  def accounts
    Tabletastic.default_table_html = { :class => 'table table-striped' }
    @members = Member.order(:activated).all
  end

  def activate
    if params[:id] != current_member.id
      m = Member.find(params[:id])
      m.activate
      flash[:success] = "Successfully activated #{m.name}"
      unless params[:notify].nil?
        mail(m, "Your account has been activated!", "We've just activated your account which means your ready to start setting up your first campaign, Sweet!", 'http://' + request.env['HTTP_HOST'] + '/dashboard', 'Go To +Creator')
      end
    else
      flash[:error] = "Cannot activate self"
    end
    redirect_to request.referer
  end

  def deactivate
    if params[:id] != current_member.id
      m = Member.find(params[:id])
      m.deactivate
      flash[:warning] = "Successfully deactivated #{m.name}"
      unless params[:notify].nil?
        mail(m, "Your account has been Deactivated!", "Sorry. We had to deactivate your account. Get in touch with our support team if you think we've made a mistake.", 'mailto:creator@godmedia.org.nz?subject=Account%20Deactivation', 'Contact Support')
      end
    else
      flash[:error] = "Cannot deactivate self"
    end
    redirect_to request.referer
  end

  def promote
    if params[:id] != current_member.id
      m = Member.find(params[:id])
      m.promote
      flash[:success] = "Successfully promoted #{m.name}"
    else
      flash[:error] = "Cannot promote self"
    end
    redirect_to request.referer
  end

  def demote
    if params[:id] != current_member.id
      m = Member.find(params[:id])
      m.demote
      flash[:warning] = "Successfully demoted #{m.name}"
    else
      flash[:error] = "Cannot demote self"
    end
    redirect_to request.referer
  end

end
