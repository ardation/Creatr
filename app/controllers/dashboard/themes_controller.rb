class Dashboard::ThemesController < Dashboard::ResourceController
  def new
    if current_member.admin?
      @content_types = ContentType.all
    else
      @content_types = ContentType.where(is_published: true).all
    end
    super
  end
end
