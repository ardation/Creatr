class Dashboard::DashboardController < Dashboard::BaseController
  def index
    @surveys = current_member.surveys
  end

  def campaigns
    @surveys = current_member.surveys
  end

  def settings
    # set your secret key
    Stripe.api_key = ENV['stripe_secret_key']


    unless current_member.stripe.blank?
      @customer = Stripe::Customer.retrieve(current_member.stripe)
    end
    mHub = current_member.crms.where(name: "MissionHub").first
    unless mHub.nil?
      @mhub = current_member.member_crms.where(crm_id: mHub.id).first
    end
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
