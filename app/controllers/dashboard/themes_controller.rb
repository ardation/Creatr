class Dashboard::ThemesController < Dashboard::ResourceController
  respond_to :html, :json, :xml

  def create
    @theme = Theme.new(params[:theme])
    @theme.owner = current_member
    create!{ "/dashboard/themes/#{@theme.id}/roller" }
  end

  def show
    @theme = Theme.find params[:id]
    if current_member.admin?
      @content_types = ContentType.all
    else
      @content_types = ContentType.where(is_published: true).all
    end
    @media = (if @theme.laptop then "laptop" elsif @theme.desktop then "desktop" elsif @theme.tablet then "tablet" else "phone" end)
    render layout: "roller"
  end

  def get_data
    @offset = ( (params[:offset].to_i || 0) * 4 )
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
    @themes = Theme.where(featured: true, published: true).all(offset: offset, limit: 4, order: :featured_at)
    respond_with(@themes)
  end

  def recent(offset)
    @themes = Theme.where(published: true).all(offset: offset, limit: 4, order: :published_at)
    respond_with(@themes)
  end

  def me(offset)
    @themes = Theme.where(owner_id: current_member.id).all(offset: offset, limit: 4, order: "created_at DESC")
    respond_with(@themes)
  end

  def favourites(offset)
    @themes = []
    current_member.favourites.all(offset: offset, limit: 4, order: "created_at DESC").each do |favourite|
      @themes.push favourite.theme
    end
    respond_with(@themes)
  end
end
