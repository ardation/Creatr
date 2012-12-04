class Dashboard::DashboardController < Dashboard::BaseController
  def index
    #route(current_member)
  end

  def settings
    # set your secret key
    Stripe.api_key = ENV['stripe_secret_key']

    unless current_member.stripe.blank?
      @customer = Stripe::Customer.retrieve(current_member.stripe)
    end

    if current_member.crms.where(name: "MissionHub").nil?
      @mhub_api_key = current_member.crms.where(name: "MissionHub").first.api_key
    end
  end

  def iframe
    unless params[:css_render].nil?
      begin
        if params[:css_render] == "scss"
          require 'sass'
          @css = Sass::Engine.new(params[:css], :syntax => :scss).render unless params[:css].nil?
        elsif params[:css_render] == "sass"
          require 'sass'
          @css = Sass::Engine.new(params[:css]).render unless params[:css].nil?
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
    unless params[:html_render].nil?
      begin
        if params[:html_render] == "HAML"
          require 'haml'
          @html = Haml::Engine.new(params[:html], :suppress_eval => true).render unless params[:html].nil?
        else
          @html = params[:html].html_safe unless params[:html].nil?
        end
        #strip style and script tags
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
    end
    render "iframe", :layout => "survey"
  end
end
