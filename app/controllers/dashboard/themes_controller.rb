class Dashboard::ThemesController < Dashboard::ResourceController
  respond_to :html, :json, :xml

  def edit
    if current_member.admin?
      @content_types = ContentType.all
    else
      @content_types = ContentType.where(is_published: true).all
    end
    super
  end

  def create
    @theme = Theme.new(params[:theme])
    @theme.owner = current_member
    create!{ edit_dashboard_theme_url(@theme) }
  end

  def get_data
    @offset = ( (params[:offset].to_i || 0) * 6 )
    @offset = 0 if @offset < 0
    send(params[:method], @offset) if ['featured', 'recent', 'me', 'favourites'].include?(params[:method])
  end

  def add_favourite
    begin
      Theme.find(params[:theme_id])
      Favourite.where(theme_id: params[:theme_id], member_id: current_member.id).first_or_create
      render :json => "done"
    rescue
      render :json => "failed"
    end
  end

  def remove_favourite
    Favourite.where(theme_id: params[:theme_id], member_id: current_member.id).destroy_all
    render :json => "done"
  end

  private

  def featured(offset)
    @themes = Theme.where(featured: true, published: true).all(offset: offset, limit: 6, order: :featured_at)
    respond_with(@themes)
  end

  def recent(offset)
    @themes = Theme.where(published: true).all(offset: offset, limit: 6, order: :published_at)
    respond_with(@themes)
  end

  def me(offset)
    @themes = Theme.where(owner_id: current_member.id).all(offset: offset, limit: 6, order: "created_at DESC")
    respond_with(@themes)
  end

  def favourites(offset)
    @themes = []
    current_member.favourites.all(offset: offset, limit: 6, order: "created_at DESC").each do |favourite|
      @themes.push favourite.theme
    end
    respond_with(@themes)
  end
end
