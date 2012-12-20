class Dashboard::DashboardController < Dashboard::BaseController
  before_filter :authenticate_member!
  def index
    @surveys = current_member.campaigns
  end

  def settings
    # set your secret key
    Stripe.api_key = ENV['stripe_secret_key']


    unless current_member.stripe.blank?
      @customer = Stripe::Customer.retrieve(current_member.stripe)
    end
    mHub = Crm.where(name: "MissionHub").first_or_create
    unless mHub.nil?
      @mhub = current_member.member_crms.where(crm_id: mHub.id).first_or_create
    end
  end

  def settings_mhub
    mHub = Crm.where(name: "MissionHub").first
    @mhub_user = current_member.member_crms.where(crm_id: mHub.id).first_or_create
    @mhub_user.api_key = params[:member_crm][:api_key]
    begin
      @mhub_user.save!
    rescue
      flash[:error] = $!
    end
    redirect_to "#{request.referer}#mhub"
  end

  def iframe
    unless params[:css_render].nil?
      begin
        if params[:css_render] == "scss"
          require 'sass'
          @css = Sass::Engine.new(params[:css], :syntax => :scss).render unless params[:css].nil?
        elsif params[:css_render] == "css"
          require 'sass'
          @css = Sass::Engine.new(params[:css], :syntax => :scss).render unless params[:css].nil?
        end
      rescue
        @error = $!
        @description = "Your CSS has an error. Check and try again."
        render "iframe_error", :layout => "error"
        return
      end
    end
    begin
      @html = params[:html].html_safe unless params[:html].nil?
      unless @html.blank?
        require 'nokogiri'
        doc = Nokogiri::HTML(@html)
        doc.css("style,script").remove
        @html = doc.at_css("body").children.to_s.html_safe
      end
    rescue
      @error = $!
      @description = "Your HTML has an error. Check and try again."
      render "iframe_error", :layout => "error"
      return
    end
    @content_type = ContentType.find(params[:content_type].to_i) unless params[:content_type] == "Body"
    @app_html = params[:app_html]
    render "iframe", :layout => "survey"
  end
end
