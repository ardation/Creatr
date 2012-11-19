module ApplicationHelper
  def route(member, redirect = true)
    @data = session["devise.facebook_data"]
    if !member.is_a?(Member) and !@data.nil?
      member = Member.find_for_facebook_oauth(@data)
    end
    if member.is_a?(Member)
      if not member.confirmed?
        @redirect_to = '/members/confirmation' if params[:action] != 'confirm'
      elsif not member.activated
        @redirect_to = '/activate' if params[:action] != 'activate'
      else
        unless signed_in?(member)
          sign_in member, :event => :authentication
        end
        @redirect_to = '/dashboard' if params[:controller] != 'dashboard'
      end
    elsif @data.nil?
      @redirect_to = '/signup' if params[:action] == 'signup_fb'
    else
      @redirect_to = '/signup_fb' if params[:action] == 'facebook'
      @redirect_to = '/signup_fb' if params[:action] == 'signup'
      session.delete("devise.facebook_data") if params[:action] == 'signup_done'
    end

    if redirect
      redirect_to @redirect_to unless @redirect_to.nil?
    else
      @redirect_to
    end
  end

  def mail(member, subject, content, link, link_text)
    m = Mandrill::API.new(ENV['mandrill_api_key'])
    m.messages 'send-template', {
      :template_name => 'Default',
      :template_content => [
        {:name => :preheader_content, :content => subject}
      ],
      :message => {
        :subject => subject,
        :from_email => 'creator@godmedia.org.nz',
        :from_name => '+Creator',
        :to => [
          {
            :name => member.name,
            :email => member.email
          }
        ],
        :global_merge_vars => [
          {
            :name => :main_image,
            :content => 'http://i47.tinypic.com/2a5f7nc.png'
          },
          { :name => :main_header,
            :content => "Hey #{member.name}!"
          },
          { :name => :main_message,
            :content => content
          },
          { :name => :main_button_text,
            :content => link_text
          },
          { :name => :main_button,
            :content => link
          }
        ]
      }
    }
  end
end
