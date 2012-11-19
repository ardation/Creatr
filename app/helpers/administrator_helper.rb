module AdministratorHelper
  def activated_status_tag(member)
    if member.activated
      '<span class="label label-success">Activated</span>'.html_safe
    elsif member.confirmed?
      '<span class="label label-important">Review</span>'.html_safe
    else
      '<span class="label label-info">Email Validation</span>'.html_safe
    end
  end

  def admin_status_tag(member)
    if member.admin?
      '&nbsp;<span class="label label-info">Admin</span>'.html_safe
    else
      ''
    end
  end
end
