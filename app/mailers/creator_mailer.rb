class CreatorMailer < Devise::Mailer
  helper :application # gives access to all helpers defined within `application_helper`.
  def confirmation_instructions(record)
    @resource = record
    m = Mandrill::API.new(ENV['mandrill_api_key'])
    m.messages 'send-template', {
      :template_name => 'Default',
      :template_content => [
        {:name => :preheader_content, :content => '+Creator is just confirming your email address!'}
      ],
      :message => {
        :subject => 'Confirm your email address',
        :from_email => 'creator@godmedia.org.nz',
        :from_name => '+Creator',
        :to => [
          {
            :name => @resource.name,
            :email => @resource.email
          }
        ],
        :global_merge_vars => [
          {
            :name => :main_image,
            :content => 'http://i47.tinypic.com/2a5f7nc.png'
          },
          { :name => :main_header,
            :content => "Welcome #{@resource.name}!"
          },
          { :name => :main_message,
            :content => 'We need you to confirm your account email through the link below.'
          },
          { :name => :main_button_text,
            :content => 'Confirm my account'
          },
          { :name => :main_button,
            :content => render_to_string("devise/mailer/confirmation_instructions").gsub(/\n/, "")
          }
        ]
      }
    }
    self.message.perform_deliveries = false
  end
end
